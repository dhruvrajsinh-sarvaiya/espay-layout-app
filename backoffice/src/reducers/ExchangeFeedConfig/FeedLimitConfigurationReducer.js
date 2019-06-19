// Reducer For Handle Feed Limit Configuration By Tejas 18/2/2019
// import types
import {
    GET_FEED_LIMIT_LIST,
    GET_FEED_LIMIT_LIST_SUCCESS,
    GET_FEED_LIMIT_LIST_FAILURE,
    ADD_FEED_LIMIT_CONFIGURATION,
    ADD_FEED_LIMIT_CONFIGURATION_SUCCESS,
    ADD_FEED_LIMIT_CONFIGURATION_FAILURE,
    UPDATE_FEED_LIMIT_CONFIGURATION,
    UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS,
    UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE,  
    GET_FEED_LIMIT_TYPE,
    GET_FEED_LIMIT_TYPE_SUCCESS,
    GET_FEED_LIMIT_TYPE_FAILURE,  
  } from "Actions/types";
  
  // Set Initial State
  const INITIAL_STATE = {
    feedLimitList: [],
    addFeedLimitList: [],
    updateFeedLimitList: [],
    loading: false,
    addLoading:false,  
    updateLoading:false,
    addError:[],
    error:[],
    updateError:[],
    feedLimitTypes:[],
    feedLimitLoading:false,
    feedLimitError:[]
  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      // get Feed Limit Configuration
      case GET_FEED_LIMIT_LIST:
        return { ...state, loading: true,error:[] };
  
      // set Data Of Feed Limit Configuration
      case GET_FEED_LIMIT_LIST_SUCCESS:
        return { ...state, feedLimitList: action.payload, loading: false,error:[] };
  
      // Display Error for Feed Limit Configuration failure
      case GET_FEED_LIMIT_LIST_FAILURE:
  
        return { ...state, loading: false, feedLimitList: [],error:action.payload };
  
      // add Feed Limit Configuration
      case ADD_FEED_LIMIT_CONFIGURATION:
        return { ...state, addLoading: true,addError:[] };
  
      // set Data Of add Feed Limit Configuration
      case ADD_FEED_LIMIT_CONFIGURATION_SUCCESS:
        return { ...state, addFeedLimitList: action.payload, addLoading: false,addError:[] };
  
      // Display Error for add Feed Limit Configuration failure
      case ADD_FEED_LIMIT_CONFIGURATION_FAILURE:
  
        return { ...state, addLoading: false, addFeedLimitList: [],addError:action.payload };
  
      // update Feed Limit Configuration
      case UPDATE_FEED_LIMIT_CONFIGURATION:
        return { ...state, updateLoading: true,updateError:[] };
  
      // set Data Of update Feed Limit Configuration
      case UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS:
        return {
          ...state,
          updateFeedLimitList: action.payload,
          updateLoading: false,
          updateError:[]
        };
  
      // Display Error for update Feed Limit Configuration failure
      case UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE:
  
        return { ...state, updateLoading: false, updateFeedLimitList: [],updateError:action.payload };
    
         // update Feed Limit Configuration
      case GET_FEED_LIMIT_TYPE:
      return { ...state, feedLimitLoading: true,feedLimitError:[] };

    // set Data Of update Feed Limit Configuration
    case GET_FEED_LIMIT_TYPE_SUCCESS:
      return {
        ...state,
        feedLimitTypes: action.payload,
        feedLimitLoading: false,
        feedLimitError:[]
      };

    // Display Error for update Feed Limit Configuration failure
    case GET_FEED_LIMIT_TYPE_FAILURE:

      return { ...state, feedLimitLoading: false, feedLimitTypes: [],feedLimitError:action.payload };
  
      
      default:
        return { ...state };
    }
  };
  