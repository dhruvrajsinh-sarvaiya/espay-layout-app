// Actions For Maarkets Data By Tejas

// import types
import {
    GET_MARKETS,
    GET_MARKETS_SUCCESS,
    GET_MARKETS_FAILURE
  } from "Actions/types";
  
  //action for Markets Data List and set type for reducers
  export const getMarketsDataList = Data => ({
    type: GET_MARKETS,
    payload: { Data }
  });
  
  //action for set Success and Markets Data List and set type for reducers
  export const getMarketsDataListSuccess = response => ({
    type: GET_MARKETS_SUCCESS,
    payload: response.Response
  });
  
  //action for set failure and error to Markets Data List and set type for reducers
  export const getMarketsDataListFailure = error => ({
    type: GET_MARKETS_FAILURE,
    payload: error
  });
  