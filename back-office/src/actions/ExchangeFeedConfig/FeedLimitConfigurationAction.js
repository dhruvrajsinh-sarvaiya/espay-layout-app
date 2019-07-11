// Actions For Feed Limit Configuration List By Tejas 18/2/2019

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
  
  //action for Feed Limit Configuration List and set type for reducers
  export const getFeedLimitList = Data => ({
    type: GET_FEED_LIMIT_LIST,
    payload: { Data }
  });
  
  //action for set Success and Feed Limit Configuration List and set type for reducers
  export const getFeedLimitListSuccess = response => ({
    type: GET_FEED_LIMIT_LIST_SUCCESS,
    payload: response.Response
  });
  
  //action for set failure and error to Feed Limit Configuration List and set type for reducers
  export const getFeedLimitListFailure = error => ({
    type: GET_FEED_LIMIT_LIST_FAILURE,
    payload: error
  });
  
  //action for add Feed Limit Configuration and set type for reducers
  export const addFeedLimitList = Data => ({
    type: ADD_FEED_LIMIT_CONFIGURATION,
    payload: { Data }
  });
  
  //action for set Success and add Feed Limit Configuration and set type for reducers
  export const addFeedLimitListSuccess = response => ({
    type: ADD_FEED_LIMIT_CONFIGURATION_SUCCESS,
    payload: response
  });
  
  //action for set failure and error to add Feed Limit Configuration and set type for reducers
  export const addFeedLimitListFailure = error => ({
    type: ADD_FEED_LIMIT_CONFIGURATION_FAILURE,
    payload: error
  });
  
  //action for update Feed Limit Configuration and set type for reducers
  export const updateFeedLimitList = Data => ({
    type: UPDATE_FEED_LIMIT_CONFIGURATION,
    payload: { Data }
  });
  
  //action for set Success and update Feed Limit Configuration and set type for reducers
  export const updateFeedLimitListSuccess = response => ({
    type: UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to update Feed Limit Configuration and set type for reducers
  export const updateFeedLimitListFailure = error => ({
    type: UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE,
    payload: error.message
  });
  
    //action for update Feed Limit Configuration and set type for reducers
    export const getExchangeFeedLimit = Data => ({
        type: GET_FEED_LIMIT_TYPE,
        payload: { Data }
      });
      
      //action for set Success and update Feed Limit Configuration and set type for reducers
      export const getExchangeFeedLimitSuccess = response => ({
        type: GET_FEED_LIMIT_TYPE_SUCCESS,
        payload: response.Response
      });
      
      //action for set failure and error to update Feed Limit Configuration and set type for reducers
      export const getExchangeFeedLimitFailure = error => ({
        type: GET_FEED_LIMIT_TYPE_FAILURE,
        payload: error
      });

  
  