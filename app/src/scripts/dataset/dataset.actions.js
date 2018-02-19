import Reflux from 'reflux'

var Actions = Reflux.createActions([
  'addFile',
  'addDirectoryFile',
  'checkUserSubscription',
  'createSnapshot',
  'createComment',
  'cancelDirectoryUpload',
  'createSubscription',
  'deleteAttachment',
  'deleteComment',
  'deleteDataset',
  'deleteFile',
  'deleteDirectory',
  'deleteJob',
  'deleteSubscription',
  'disableUpdateWarn',
  'dismissError',
  'dismissJobsModal',
  'dismissMetadataIssue',
  'displayFile',
  'downloadLogs',
  'editFile',
  'flagForValidation',
  'getAttachmentDownloadTicket',
  'getDatasetDownloadTicket',
  'getFileDownloadTicket',
  'getResultDownloadTicket',
  'getJobLogs',
  'getLogstream',
  'refreshJob',
  'loadApps',
  'loadComments',
  'loadDataset',
  'loadSnapshot',
  'loadUsers',
  'prepareJobSubmission',
  'publish',
  'retryJob',
  'reloadDataset',
  'saveDescription',
  'selectJob',
  'setInitialState',
  'sortComments',
  'startJob',
  'cancelJob',
  'trackDownload',
  'trackView',
  'toggleFolder',
  'toggleResultFolder',
  'toggleModal',
  'toggleSidebar',
  'uploadAttachment',
  'updateComment',
  'updateDescription',
  'updateName',
  'updateNote',
  'updateFile',
  'updateREADME',
  'updateStatus',
])

export default Actions
