import {
  //for fetching daemon list
  GET_DAEMON_CONFIGURE_DATA,
  GET_DAEMON_CONFIGURE_DATA_SUCCESS,
  GET_DAEMON_CONFIGURE_DATA_FAILURE,

  //for Add daemon 
  ADD_DAEMON_CONFIGURE_DATA,
  ADD_DAEMON_CONFIGURE_DATA_SUCCESS,
  ADD_DAEMON_CONFIGURE_DATA_FAILURE,

  //for edit daemon 
  EDIT_DAEMON_CONFIGURE_DATA,
  EDIT_DAEMON_CONFIGURE_DATA_SUCCESS,
  EDIT_DAEMON_CONFIGURE_DATA_FAILURE,

  //clear data
  CLEAR_DAEMON_CONFIGURATION,
  ADD_EDIT_DAEMON_CLEAR,
} from "../ActionTypes";
import { action } from "../GlobalActions";

//action for Daemon Configure and set type for reducers
export function getDaemonData() { return action(GET_DAEMON_CONFIGURE_DATA) }

//action for set Success and Daemon Configuration and set type for reducers
export function getDaemonSuccess(payload) { return action(GET_DAEMON_CONFIGURE_DATA_SUCCESS, { payload }) }

//action for set failure and error to Daemon Configuration and set type for reducers
export function getDaemonFailure(payload) { return action(GET_DAEMON_CONFIGURE_DATA_FAILURE, { payload }) }

//action for add Daemon Configuration and set type for reducers
export function addDaemonData(payload) { return action(ADD_DAEMON_CONFIGURE_DATA, { payload }) }

//action for set Success and Daemon Configuration and set type for reducers
export function addDaemonSuccess(payload) { return action(ADD_DAEMON_CONFIGURE_DATA_SUCCESS, { payload }) }

//action for set failure and error to Daemon Configuration and set type for reducers
export function addDaemonFailure(payload) { return action(ADD_DAEMON_CONFIGURE_DATA_FAILURE, { payload }) }

//action for add Daemon Configuration and set type for reducers
export function editDaemonData(payload) { return action(EDIT_DAEMON_CONFIGURE_DATA, { payload }) }

//action for set Success and Daemon Configuration and set type for reducers
export function editDaemonSuccess(payload) { return action(EDIT_DAEMON_CONFIGURE_DATA_SUCCESS, { payload }) }

//action for set failure and error to Daemon Configuration and set type for reducers
export function editDaemonFailure(payload) { return action(EDIT_DAEMON_CONFIGURE_DATA_FAILURE, { payload }) }

//for add edit clear
export function AddEditDaemonClear() { return action(ADD_EDIT_DAEMON_CLEAR) }

export function clearDiamonConfiguration() { return action(CLEAR_DAEMON_CONFIGURATION) }



