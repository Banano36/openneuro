import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetPage from './dataset-page.jsx'
import * as DatasetQueryFragments from './dataset-query-fragments.js'

const getDatasetPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      starred
      ...DatasetDraft
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetComments
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_COMMENTS}
`

const DatasetQuery = ({ match }) => (
  <Query
    query={getDatasetPage}
    variables={{ datasetId: match.params.datasetId }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Spinner text="Loading Dataset" active />
      } else if (error) {
        throw new Error(error)
      } else {
        return <DatasetPage dataset={data.dataset} />
      }
    }}
  </Query>
)

DatasetQuery.propTypes = {
  match: PropTypes.object,
}

export default DatasetQuery
