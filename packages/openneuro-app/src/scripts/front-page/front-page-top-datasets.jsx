import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'
import Spinner from '../common/partials/spinner.jsx'
import { Link } from 'react-router-dom'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import styled from '@emotion/styled'
import Uppercase from '../styles/uppercase.jsx'

const FontWeight600 = styled.span`
  font-weight: 600;
`

const WhiteText = styled.div`
  color: #fff;
  font-size: 16px;
  a {
    color: #fff;
    bottom-border: 1px dashed var(--tertiary);
  }
  a:hover {
    color: #eee;
  }
`

const PaddedRow = styled.div`
  padding-bottom: 1em;
`

const TOP_VIEWED = gql`
  query top_viewed_datasets {
    datasets(
      first: 5
      orderBy: { views: descending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          analytics {
            views
          }
          latestSnapshot {
            tag
            description {
              Name
            }
          }
        }
      }
    }
  }
`

const RECENTLY_PUBLISHED = gql`
  query recently_published_datasets {
    datasets(
      first: 5
      orderBy: { publishDate: descending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          publishDate
          latestSnapshot {
            tag
            description {
              Name
            }
          }
        }
      }
    }
  }
`

const DatasetLink = ({ node }) => {
  return (
    <Link to={`/datasets/${node.id}/versions/${node.latestSnapshot.tag}`}>
      {node.latestSnapshot.description.Name}
    </Link>
  )
}

DatasetLink.propTypes = {
  node: PropTypes.object,
}

const FrontPageTopActive = ({ datasets }) => {
  return (
    <>
      {datasets.map(({ node }, index) => (
        <PaddedRow className="row" key={index}>
          <div className="col-sm-2">
            <FontWeight600>
              <i className="fa fa-eye" />{' '}
              {node.analytics.views.toLocaleString()}
            </FontWeight600>
          </div>
          <div className="col-sm-10">
            <DatasetLink node={node} />
          </div>
        </PaddedRow>
      ))}
      <PaddedRow className="row">
        <div className="col-sm-2"> </div>
        <div className="col-sm-10">
          <Link to="/public/datasets">View More...</Link>
        </div>
      </PaddedRow>
    </>
  )
}

FrontPageTopActive.propTypes = {
  datasets: PropTypes.array,
}

const FrontPageTopRecent = ({ datasets }) => {
  return (
    <>
      {datasets.map(({ node }, index) => (
        <PaddedRow className="row" key={index}>
          <div className="col-sm-8">
            <DatasetLink node={node} />
          </div>
          <div className="col-sm-4">
            <FontWeight600>
              <Uppercase>
                {formatDistanceToNow(parseISO(node.publishDate))} ago
              </Uppercase>
            </FontWeight600>
          </div>
        </PaddedRow>
      ))}
    </>
  )
}

FrontPageTopRecent.propTypes = {
  datasets: PropTypes.array,
}

/**
 * @param {import('graphql').DocumentNode} query
 * @returns {function (import('@apollo/client').QueryResult): React.ReactElement}
 */
export const FrontPageTopResult = query => ({ loading, error, data }) => {
  if (loading) {
    return <Spinner active />
  } else if (error || data.datasets == null) {
    Sentry.captureException(error)
    return <div>Failed to load top datasets, please try again later.</div>
  } else {
    // Remove any edges which could not be loaded
    const edges = data.datasets.edges.filter(dataset => dataset !== null)
    if (query === TOP_VIEWED) {
      return <FrontPageTopActive datasets={edges} />
    } else if (query === RECENTLY_PUBLISHED) {
      return <FrontPageTopRecent datasets={edges} />
    }
  }
}

const FrontPageTopQuery = ({ query }) => {
  const result = useQuery(query)
  return FrontPageTopResult(query)(result)
}

FrontPageTopQuery.propTypes = {
  query: PropTypes.object,
}

const FrontPageTopDatasets = () => (
  <>
    <div className="browse-pipelines">
      <h3 className="browse-pipeline-header">Recent Activity</h3>
      <div className="container">
        <div className="row">
          <WhiteText>
            <div className="col-sm-6 mate-slide fade-in">
              <h4>Most Active</h4>
              <FrontPageTopQuery query={TOP_VIEWED} />
            </div>
            <div className="col-sm-6 mate-slide fade-in browse">
              <h4>Recently Published</h4>
              <FrontPageTopQuery query={RECENTLY_PUBLISHED} />
            </div>
          </WhiteText>
        </div>
      </div>
    </div>
  </>
)

export default FrontPageTopDatasets
