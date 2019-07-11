// Reducer For Handle Exchange Feed Configuration By Tejas
// import types
import {
  GET_EXCHANGE_FEED_CONFIGURATION_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  exchangeFeedList: [],
  addexchangeFeedList: [],
  updateexchangeFeedList: [],
  loading: false,
  addLoading:false,
  updateLoading:false,
  addError:[],
  updateError:[],
  socketMethods: [],
  socketMethodErrors: [],
  socketMethodLoading: false,
  limitMethods: [],
  limitMethodErrors: [],
  limitMethodLoading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE;
  }

  switch (action.type) {
    // get Exchange Feed Configuration List
    case GET_EXCHANGE_FEED_CONFIGURATION_LIST:
      return { ...state, loading: true };

    // set Data Of Exchange Feed Configuration List
    case GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS:
      return { ...state, exchangeFeedList: action.payload, loading: false };

    // Display Error for Exchange Feed Configuration List failure
    case GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE:
      return { ...state, loading: false, exchangeFeedList: [] };

    // add Exchange Feed Configuration List
    case ADD_EXCHANGE_FEED_CONFIGURATION_LIST:
      return { ...state, addLoading: true,addError:[] };

    // set Data Of add Exchange Feed Configuration List
    case ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS:
      return { ...state, addexchangeFeedList: action.payload, addLoading: false,addError:[] };

    // Display Error for add Exchange Feed Configuration List failure
    case ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE:
      return { ...state, addLoading: false, addexchangeFeedList: [],addError:action.payload };

    // update Exchange Feed Configuration List
    case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST:
      return { ...state, updateLoading: true,updateError:[] };

    // set Data Of update Exchange Feed Configuration List
    case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        updateexchangeFeedList: action.payload,
        updateLoading: false,
        updateError:[]
      };

    // Display Error for update Exchange Feed Configuration List failure
    case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE:
      return { ...state, updateLoading: false, updateexchangeFeedList: [],updateError:action.payload };

    // get Exchange Feed Configuration Socket methods List
    case GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST:
      return { ...state, socketMethodLoading: true };

    // set Data Of Exchange Feed Configuration Socket methods List
    case GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS:
      return { ...state, socketMethods: action.payload, socketMethodLoading: false, socketMethodErrors: [] };

    // Display Error for Exchange Feed Configuration Socket methods List failure
    case GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE:
      return { ...state, socketMethodLoading: false, socketMethods: [], socketMethodErrors: action.payload };

    // get Exchange Feed Configuration limit methods List
    case GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST:
      return { ...state, limitMethodLoading: true };

    // set Data Of Exchange Feed Configuration limit methods List
    case GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS:
      return { ...state, limitMethods: action.payload, limitMethodLoading: false, limitMethodErrors: [] };

    // Display Error for Exchange Feed Configuration limit methods List failure
    case GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE:
      return { ...state, limitMethodLoading: false, limitMethods: [], limitMethodErrors: action.payload };

    default:
      return { ...state };
  }
};
