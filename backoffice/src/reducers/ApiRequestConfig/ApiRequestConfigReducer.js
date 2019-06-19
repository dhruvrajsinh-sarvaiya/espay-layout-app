// Reducer For Handle Api Request By Tejas
// import types
import {
  ADD_API_REQUEST_LIST,
  ADD_API_REQUEST_LIST_SUCCESS,
  ADD_API_REQUEST_LIST_FAILURE,
  UPDATE_API_REQUEST_LIST,
  UPDATE_API_REQUEST_LIST_SUCCESS,
  UPDATE_API_REQUEST_LIST_FAILURE,
  GET_APP_TYPE_LIST,
  GET_APP_TYPE_LIST_SUCCESS,
  GET_APP_TYPE_LIST_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  addRequestList: [],
  updateRequestList: [],
  addError: [],
  updateError: [],
  updateLoading: false,
  addLoading: false,
  loading: false,
  error: [],
  appTypeList: [],
  appTypeListLoading:false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // Add Api Response Config
    case ADD_API_REQUEST_LIST:
      return { ...state, addLoading: true };

    // set Data Of Add Api Response Config
    case ADD_API_REQUEST_LIST_SUCCESS:
      return { ...state, addRequestList: action.payload, addLoading: false, addError: [] };

    // Display Error for Add Api Response Config failure
    case ADD_API_REQUEST_LIST_FAILURE:
      return { ...state, addLoading: false, addRequestList: [], addError: action.payload };

    // update Api Response Config
    case UPDATE_API_REQUEST_LIST:
      return { ...state, updateLoading: true };

    // set Data Of update Api Response Config
    case UPDATE_API_REQUEST_LIST_SUCCESS:
      return { ...state, updateRequestList: action.payload, updateLoading: false, updateError: [] };

    // Display Error for update Api Response Config failure
    case UPDATE_API_REQUEST_LIST_FAILURE:

      return { ...state, updateLoading: false, updateRequestList: [], updateError: action.payload };


    // update Api Response Config
    case GET_APP_TYPE_LIST:
      return { ...state, appTypeListLoading: true };

    // set Data Of update Api Response Config
    case GET_APP_TYPE_LIST_SUCCESS:
      return { ...state, appTypeList: action.payload, appTypeListLoading: false, error: [] };

    // Display Error for update Api Response Config failure
    case GET_APP_TYPE_LIST_FAILURE:

      return { ...state, appTypeListLoading: false, appTypeList: [], error: action.payload };


    default:
      return { ...state };
  }
};
