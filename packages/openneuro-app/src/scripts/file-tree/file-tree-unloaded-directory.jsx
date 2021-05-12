import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import DatasetQueryContext from '../datalad/dataset/dataset-query-context.js'
import FileTreeLoading from './file-tree-loading.jsx'
import { gql } from '@apollo/client'

export const DRAFT_FILES_QUERY = gql`
  query getDraftFileTree($datasetId: ID!, $filePrefix: String!) {
    dataset(id: $datasetId) {
      draft {
        files(prefix: $filePrefix) {
          id
          key
          filename
          size
          directory
          annexed
        }
      }
    }
  }
`

export const SNAPSHOT_FILES_QUERY = gql`
  query getSnapshotFileTree(
    $datasetId: ID!
    $snapshotTag: String!
    $filePrefix: String!
  ) {
    snapshot(datasetId: $datasetId, tag: $snapshotTag) {
      files(prefix: $filePrefix) {
        id
        key
        filename
        size
        directory
        annexed
      }
    }
  }
`

export const mergeNewFiles =
  (directory, snapshotTag) =>
  (past, { fetchMoreResult }) => {
    // Deep clone the old dataset object
    const newDatasetObj = JSON.parse(JSON.stringify(past))
    const mergeNewFileFilter = f => f.id !== directory.id
    // Remove ourselves from the array
    if (snapshotTag) {
      newDatasetObj.getSnapshotFileTree.files =
        newDatasetObj.getSnapshotFileTree.files.filter(mergeNewFileFilter)
      newDatasetObj.getSnapshotFileTree.files.push(
        ...fetchMoreResult.getSnapshotFileTree.files,
      )
    } else {
      newDatasetObj.getDraftFileTree.draft.files =
        newDatasetObj.getDraftFileTree.draft.files.filter(mergeNewFileFilter)
      newDatasetObj.getDraftFileTree.draft.files.push(
        ...fetchMoreResult.getDraftFileTree.draft.files,
      )
    }
    return newDatasetObj
  }

export const fetchMoreDirectory = (
  fetchMore,
  datasetId,
  snapshotTag,
  directory,
) =>
  fetchMore({
    query: snapshotTag ? SNAPSHOT_FILES_QUERY : DRAFT_FILES_QUERY,
    variables: { datasetId, snapshotTag, filePrefix: directory.filename + '/' },
    updateQuery: mergeNewFiles(directory, snapshotTag),
  })

const FileTreeUnloadedDirectory = ({ datasetId, snapshotTag, directory }) => {
  const [loading, setLoading] = useState(false)
  const [displayLoading, setDisplayLoading] = useState(false)
  const { fetchMore } = useContext(DatasetQueryContext)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setDisplayLoading(true), 150)
      return () => clearTimeout(timer)
    }
  }, [loading])
  return (
    <button
      className="btn-file-folder"
      onClick={() => {
        // Show a loading state while we wait on the directory to stream in
        setLoading(true)
        fetchMoreDirectory(fetchMore, datasetId, snapshotTag, directory)
        // No need to clear since this component is unmounted immediately
      }}>
      <i className={`type-icon fa fa-folder${loading ? '-open' : ''}`} />{' '}
      {directory.filename}
      <i className={`accordion-icon fa fa-caret${loading ? '-up' : '-down'}`} />
      {displayLoading && <FileTreeLoading size={directory.size} />}
    </button>
  )
}

FileTreeUnloadedDirectory.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
  directory: PropTypes.object,
}

export default FileTreeUnloadedDirectory
