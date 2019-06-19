// Actions For Top Gainers and losers Data By Tejas Date:4-1-2019

// import types
import {
    GET_TOP_GAINERS_DATA,
    GET_TOP_GAINERS_DATA_SUCCESS,
    GET_TOP_GAINERS_DATA_FAILURE,
    GET_TOP_GAINERS_LOSERS_DATA,
    GET_TOP_GAINERS_LOSERS_DATA_SUCCESS,
    GET_TOP_GAINERS_LOSERS_DATA_FAILURE,
    GET_TOP_LOSERS_DATA,
  GET_TOP_LOSERS_DATA_SUCCESS,
  GET_TOP_LOSERS_DATA_FAILURE
  } from "Actions/types";
  
  //action for ge Top Gainers and set type for reducers
  export const getTopGainersData = Data => ({
    type: GET_TOP_GAINERS_DATA,
    payload: { Data }
  });
  
  //action for set Success and Top Gainers and set type for reducers
  export const getTopGainersSuccess = response => ({
    type: GET_TOP_GAINERS_DATA_SUCCESS,
    payload: response.Response
  });
  
  //action for set failure and error to Top Gainers and set type for reducers
  export const getTopGainersFailure = error => ({
    type: GET_TOP_GAINERS_DATA_FAILURE,
    payload: error
  });

   //action for ge Top Losers and set type for reducers
   export const getTopLosersData = Data => ({
    type: GET_TOP_LOSERS_DATA,
    payload: { Data }
  });
  
  //action for set Success and Top Losers and set type for reducers
  export const getTopLosersSuccess = response => ({
    type: GET_TOP_LOSERS_DATA_SUCCESS,
    payload: response.Response
  });
  
  //action for set failure and error to Top Losers and set type for reducers
  export const getTopLosersFailure = error => ({
    type: GET_TOP_LOSERS_DATA_FAILURE,
    payload: error
  });

  
  //action for ge Top Gainers and Losers and set type for reducers
  export const getTopGainersLosersData = Data => ({
    type: GET_TOP_GAINERS_LOSERS_DATA,
    payload: { Data }
  });
  
  //action for set Success and Top Gainers and Losers and set type for reducers
  export const getTopGainersLosersSuccess = response => ({
    type: GET_TOP_GAINERS_LOSERS_DATA_SUCCESS,
    payload: response.Response
  });
  
  //action for set failure and error to Top Gainers and Losers and set type for reducers
  export const getTopGainersLosersFailure = error => ({
    type: GET_TOP_GAINERS_LOSERS_DATA_FAILURE,
    payload: error
  });
  
  