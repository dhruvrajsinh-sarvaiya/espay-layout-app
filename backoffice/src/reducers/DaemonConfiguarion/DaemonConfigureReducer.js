// Reducer for Active User Data By Tejas

import {
  GET_DAEMON_CONFIGURE_DATA,
  GET_DAEMON_CONFIGURE_DATA_SUCCESS,
  GET_DAEMON_CONFIGURE_DATA_FAILURE,
  ADD_DAEMON_CONFIGURE_DATA,
  ADD_DAEMON_CONFIGURE_DATA_SUCCESS,
  ADD_DAEMON_CONFIGURE_DATA_FAILURE,
  EDIT_DAEMON_CONFIGURE_DATA,
  EDIT_DAEMON_CONFIGURE_DATA_SUCCESS,
  EDIT_DAEMON_CONFIGURE_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  daemonConfig: [],
  addDaemon: [],
  loading: false,
  editDaemon: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Daemon
    case GET_DAEMON_CONFIGURE_DATA:
      return { ...state, loading: true };

    // set Data Of  Daemon
    case GET_DAEMON_CONFIGURE_DATA_SUCCESS:
      return { ...state, daemonConfig: action.payload, loading: false };

    // Display Error for Daemon  failure
    case GET_DAEMON_CONFIGURE_DATA_FAILURE:
      return { ...state, loading: false, daemonConfig: [] };

    // Add Daemon
    case ADD_DAEMON_CONFIGURE_DATA:
      return { loading: true };

    // set Add Of  Daemon
    case ADD_DAEMON_CONFIGURE_DATA_SUCCESS:
      return { ...state, addDaemon: action.payload, loading: false };

    // Display Error for Daemon  failure
    case ADD_DAEMON_CONFIGURE_DATA_FAILURE:
      return { ...state, addDaemon: action.payload, loading: false };

    // edit Daemon request
    case EDIT_DAEMON_CONFIGURE_DATA:
      return { loading: true };

    // edit Daemon success
    case EDIT_DAEMON_CONFIGURE_DATA_SUCCESS:
      return { ...state, editDaemon: action.payload, loading: false };

    // edit daemon failure
    case EDIT_DAEMON_CONFIGURE_DATA_FAILURE:
      return { ...state, editDaemon: action.payload, loading: false };

    default:
      return { ...state };
  }
};
