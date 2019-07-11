// Reducer For Handle Bug Report By Tejas
// import types
import {
  GET_FILE_LIST,
  GET_FILE_LIST_SUCCESS,
  GET_FILE_LIST_FAILURE,
  CLEAR_FILE_LIST,
  CLEAR_FILE_LIST_SUCCESS,
  CLEAR_FILE_LIST_FAILURE,
  GET_FILE_DETAIL,
  GET_FILE_DETAIL_SUCCESS,
  GET_FILE_DETAIL_FAILURE
} from "Actions/types";

import { NotificationManager } from "react-notifications";

// Set Initial State
const INITIAL_STATE = {
  fileList: [],
  clearFileList: [],
  fileDetail: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    // get File List
    case GET_FILE_LIST:
      return { ...state, loading: true };

    // set Data Of File List
    case GET_FILE_LIST_SUCCESS:
      return { ...state, fileList: action.payload, loading: false };

    // Display Error for File List failure
    case GET_FILE_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, fileList: [] };

    // clear File List
    case CLEAR_FILE_LIST:
      return { ...state, loading: true };

    // set Data Of File List
    case CLEAR_FILE_LIST_SUCCESS:
      return { ...state, clearFileList: action.payload, loading: false };

    // Display Error for File List failure
    case CLEAR_FILE_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, clearFileList: [] };

    // Get File Detail
    case GET_FILE_DETAIL:
      return { ...state, loading: true };

    // set Data Of File Detail
    case GET_FILE_DETAIL_SUCCESS:
      return { ...state, fileDetail: action.payload, loading: false };

    // Display Error for File Detail failure
    case GET_FILE_DETAIL_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, fileDetail: [] };

    default:
      return { ...state };
  }
};
