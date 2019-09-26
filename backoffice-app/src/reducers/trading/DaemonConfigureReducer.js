
import {
  //for fetching daemon list
  GET_DAEMON_CONFIGURE_DATA,
  GET_DAEMON_CONFIGURE_DATA_SUCCESS,
  GET_DAEMON_CONFIGURE_DATA_FAILURE,

  //for Add daemon 
  ADD_DAEMON_CONFIGURE_DATA,
  ADD_DAEMON_CONFIGURE_DATA_SUCCESS,
  ADD_DAEMON_CONFIGURE_DATA_FAILURE,

  //for add edit daemon
  ADD_EDIT_DAEMON_CLEAR,

  //for edit daemon
  EDIT_DAEMON_CONFIGURE_DATA,
  EDIT_DAEMON_CONFIGURE_DATA_SUCCESS,
  EDIT_DAEMON_CONFIGURE_DATA_FAILURE,

  //clear data
  CLEAR_DAEMON_CONFIGURATION,
  ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// Set Initial State
const initialState = {
  //for fetching daemon list
  daemonConfig: null,
  loading: false,

  //for Add daemon 
  addDaemon: null,
  isAddDaemon: false,

  //for edit daemon
  editDaemon: null,
  isEditDaemon: false,
};

const daemonConfigureReducer = (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return initialState

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return initialState

    // To reset initial state on clear data
    case CLEAR_DAEMON_CONFIGURATION:
      return initialState

    // get Daemon
    case GET_DAEMON_CONFIGURE_DATA:
      return Object.assign({}, state, { loading: true/* , addDaemon: null, editDaemon: null  */ })
    // set Data Of  Daemon
    case GET_DAEMON_CONFIGURE_DATA_SUCCESS:
      return Object.assign({}, state, { daemonConfig: action.payload, loading: false })
    // Display Error for Daemon  failure
    case GET_DAEMON_CONFIGURE_DATA_FAILURE:
      return Object.assign({}, state, { loading: false, daemonConfig: null })

    // Add Daemon
    case ADD_DAEMON_CONFIGURE_DATA:
      return Object.assign({}, state, { isAddDaemon: true/* , addDaemon: null, editDaemon: null */ })
    // set Add Of  Daemon
    case ADD_DAEMON_CONFIGURE_DATA_SUCCESS:
      return Object.assign({}, state, { addDaemon: action.payload, isAddDaemon: false })
    // Display Error for Daemon  failure
    case ADD_DAEMON_CONFIGURE_DATA_FAILURE:
      return Object.assign({}, state, { isAddDaemon: false, addDaemon: action.payload })

    // edit Daemon request
    case EDIT_DAEMON_CONFIGURE_DATA:
      return Object.assign({}, state, { isEditDaemon: true, editDaemon: null/* , addDaemon: null  */ })
    // edit Daemon success
    case EDIT_DAEMON_CONFIGURE_DATA_SUCCESS:
      return Object.assign({}, state, { editDaemon: action.payload, isEditDaemon: false })
    // edit daemon failure
    case EDIT_DAEMON_CONFIGURE_DATA_FAILURE:
      return Object.assign({}, state, { editDaemon: action.payload, isEditDaemon: false })

    // Display Error for delete Match Engine List failure
    case ADD_EDIT_DAEMON_CLEAR:
      return Object.assign({}, state, { addDaemon: null, editDaemon: null })

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};

export default daemonConfigureReducer;
