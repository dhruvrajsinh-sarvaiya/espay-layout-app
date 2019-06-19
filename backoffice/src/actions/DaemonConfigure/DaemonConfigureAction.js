// Actions For Daemon Configure Data By Tejas

// import types
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

//action for Daemon Configure and set type for reducers
export const getDaemonData = Data => ({
  type: GET_DAEMON_CONFIGURE_DATA,
  payload: Data
});

//action for set Success and Daemon Configuration and set type for reducers
export const getDaemonSuccess = response => ({
  type: GET_DAEMON_CONFIGURE_DATA_SUCCESS,
  payload: response
});

//action for set failure and error to Daemon Configuration and set type for reducers
export const getDaemonFailure = error => ({
  type: GET_DAEMON_CONFIGURE_DATA_FAILURE,
  payload: error
});

//action for add Daemon Configuration and set type for reducers
export const addDaemonData = daemonRequest => ({
  type: ADD_DAEMON_CONFIGURE_DATA,
  payload: daemonRequest
});

//action for set Success and Daemon Configuration and set type for reducers
export const addDaemonSuccess = response => ({
  type: ADD_DAEMON_CONFIGURE_DATA_SUCCESS,
  payload: response
});

//action for set failure and error to Daemon Configuration and set type for reducers
export const addDaemonFailure = error => ({
  type: ADD_DAEMON_CONFIGURE_DATA_FAILURE,
  payload: error
});

//action for add Daemon Configuration and set type for reducers
export const editDaemonData = daemonRequest => ({
  type: EDIT_DAEMON_CONFIGURE_DATA,
  payload: daemonRequest
});

//action for set Success and Daemon Configuration and set type for reducers
export const editDaemonSuccess = response => ({
  type: EDIT_DAEMON_CONFIGURE_DATA_SUCCESS,
  payload: response
});

//action for set failure and error to Daemon Configuration and set type for reducers
export const editDaemonFailure = error => ({
  type: EDIT_DAEMON_CONFIGURE_DATA_FAILURE,
  payload: error
});