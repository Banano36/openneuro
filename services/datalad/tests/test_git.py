import falcon
from falcon import testing
import pygit2

from .dataset_fixtures import *
from datalad_service.common import git


test_auth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDQ0ZjVjNS1iMjFiLTQyMGItOTU1NS1hZjg1NmVmYzk0NTIiLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJzY29wZXMiOlsiZGF0YXNldDpnaXQiXSwiZGF0YXNldCI6ImRzMDAwMDAxIiwiaWF0IjoxNjA4NDEwNjEyLCJleHAiOjIxNDc0ODM2NDd9.0aA9cZWMieYr9zbmVrTeFEhpATqmT_X4tVX1VR1uabA"


def test_git_show(new_dataset):
    assert git.git_show(new_dataset.path, 'HEAD',
                        'dataset_description.json') == '{"BIDSVersion": "1.0.2", "License": "This is not a real dataset", "Name": "Test fixture new dataset"}'


def test_git_tag(new_dataset):
    repo = pygit2.Repository(new_dataset.path)
    assert git.git_tag(repo) == []
    # Create a tag and check again
    repo.references.create('refs/tags/test-tag', repo.head.target.hex)
    assert git.git_tag(repo)[0].name == 'refs/tags/test-tag'


def test_git_refs_resource(client):
    ds_id = 'ds000001'
    response = client.simulate_get(
        '/git/0/{}/info/refs?service=git-receive-pack'.format(ds_id), headers={"authorization": test_auth})
    assert response.status == falcon.HTTP_OK
    # A basic check for the terminator sequence at the end
    assert b'0000' == response.content[-4:]
    lines = response.content.decode().split('\n')
    # We expect preamble, three objects, and a 0000 terminator
    assert len(lines) == 5
    assert 'service=git-receive-pack' in lines[0]
    # Check master ref looks right
    assert lines[2][0:4] == '003f'
    assert lines[2][4:44].isalnum()  # 40 character sha256
    assert lines[2][44] == ' '  # delimiter
    assert lines[2][45:] == 'refs/heads/master'


def test_git_upload_resource(client):
    ds_id = 'ds000001'
    get_response = client.simulate_get(
        '/git/0/{}/info/refs?service=git-upload-pack'.format(ds_id), headers={"authorization": test_auth})
    lines = get_response.content.decode().split('\n')
    # Grab two refs to ask for
    annex = lines[2][4:44]
    head = lines[3][4:44]
    upload_pack_input = "0032want {}\n0032want {}\n00000009done\n""".format(
        head, annex)
    # Ask for them
    response = client.simulate_post(
        '/git/0/{}/git-upload-pack'.format(ds_id), headers={"authorization": test_auth}, body=upload_pack_input)
    assert response.status == falcon.HTTP_OK
    # Just look for the start of a pack stream
    assert response.content[0:12] == b'0008NAK\nPACK'


def test_git_receive_resource(client):
    ds_id = 'ds000001'
    get_response = client.simulate_get(
        '/git/0/{}/info/refs?service=git-upload-pack'.format(ds_id), headers={"authorization": test_auth})
    lines = get_response.content.decode().split('\n')
    # Just try a noop push to avoid changing the test dataset
    receive_pack_input = '0000'
    response = client.simulate_post(
        '/git/0/{}/git-receive-pack'.format(ds_id), headers={"authorization": test_auth}, body=receive_pack_input)
    assert response.status == falcon.HTTP_OK


def test_git_tag_tree(new_dataset):
    tag = '1.0.0'
    repo = pygit2.Repository(new_dataset.path)
    # Create a tag
    repo.references.create(f'refs/tags/{tag}', repo.head.target.hex)
    assert git.git_tag_tree(repo, tag) == repo.get(repo.head.target).tree_id
