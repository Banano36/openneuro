import React from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'

const Files = ({
  datasetId,
  snapshotTag,
  datasetName,
  files,
  editMode = false,
}) => {
  const fileTree = flatToTree(files)
  return (
    <ul className="top-level-item">
      <li className="clearfix">
        <FileTree
          datasetId={datasetId}
          snapshotTag={snapshotTag}
          path={''}
          {...fileTree}
          name={datasetName}
          editMode={editMode}
          defaultExpanded={true}
        />
      </li>
    </ul>
  )
}

Files.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
  datasetName: PropTypes.string,
  files: PropTypes.array,
  editMode: PropTypes.bool,
  fetchMore: PropTypes.func,
}

export default Files
