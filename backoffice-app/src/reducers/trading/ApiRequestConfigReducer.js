// Reducer For Handle Api Request
// import types
import {
  //add api request
  ADD_API_REQUEST_LIST,
  ADD_API_REQUEST_LIST_SUCCESS,
  ADD_API_REQUEST_LIST_FAILURE,

  //update api request
  UPDATE_API_REQUEST_LIST,
  UPDATE_API_REQUEST_LIST_SUCCESS,
  UPDATE_API_REQUEST_LIST_FAILURE,

  //app type
  GET_APP_TYPE,
  GET_APP_TYPE_SUCCESS,
  GET_APP_TYPE_FAILURE,

  //clear data
  ADD_API_REQUEST_LIST_CLEAR,
  UPDATE_API_REQUEST_LIST_CLEAR,
  ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// Set Initial State
const initialState = {

  //add api request
  addRequestList: null,
  addLoading: false,
  addError: null,

  //update api request
  updateRequestList: null,
  updateError: null,
  updateLoading: false,

  //app type
  loading: false,
  error: null,
  appTypeList: null,
};

export default (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return initialState

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return initialState

    // Add Api Response Config
    case ADD_API_REQUEST_LIST:
      return Object.assign({}, state, { addLoading: true })
    // set Data Of Add Api Response Config
    case ADD_API_REQUEST_LIST_SUCCESS:
      return Object.assign({}, state, { addRequestList: action.payload, addLoading: false, addError: null })
    // Display Error for Add Api Response Config failure
    case ADD_API_REQUEST_LIST_FAILURE:
      return Object.assign({}, state, { addLoading: false, addRequestList: null, addError: action.payload })

    // update Api Response Config
    case UPDATE_API_REQUEST_LIST:
      return Object.assign({}, state, { updateLoading: true })
    // set Data Of update Api Response Config
    case UPDATE_API_REQUEST_LIST_SUCCESS:
      return Object.assign({}, state, { updateRequestList: action.payload, updateLoading: false, updateError: null })
    // Display Error for update Api Response Config failure
    case UPDATE_API_REQUEST_LIST_FAILURE:
      return Object.assign({}, state, { updateLoading: false, updateRequestList: null, updateError: action.payload })

    // update Api Response Config
    case GET_APP_TYPE:
      return Object.assign({}, state, { loading: true })
    // set Data Of update Api Response Config
    case GET_APP_TYPE_SUCCESS:
      return Object.assign({}, state, { appTypeList: action.payload, loading: false, error: null })
    // Display Error for update Api Response Config failure
    case GET_APP_TYPE_FAILURE:
      return Object.assign({}, state, { loading: false, appTypeList: null, error: action.payload })

    // clear Data Of Add Api Response Config
    case ADD_API_REQUEST_LIST_CLEAR:
      return Object.assign({}, state, { addRequestList: null, addLoading: false, addError: null })
    // clear Data Of update Api Response Config
    case UPDATE_API_REQUEST_LIST_CLEAR:
      return Object.assign({}, state, { updateRequestList: null, updateLoading: false, updateError: null })

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
