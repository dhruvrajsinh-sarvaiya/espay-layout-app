import {
    GET_EXTERNALTRANSFER_HISTORY,
    GET_EXTERNALTRANSFER_HISTORY_SUCCESS,
    GET_EXTERNALTRANSFER_HISTORY_FAILURE
  } from "Actions/types";
  
  const INITIAL_STATE = {
    externalTransferHistory: [],
    Loading: false
  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GET_EXTERNALTRANSFER_HISTORY:
        return { ...state, Loading: true };
  
      case GET_EXTERNALTRANSFER_HISTORY_SUCCESS:
        return {
          ...state,
          Loading: false,
          externalTransferHistory: action.payload
        };
  
      case GET_EXTERNALTRANSFER_HISTORY_FAILURE:
        return { ...state, Loading: false };
  
      default:
        return { ...state };
    }
  };
  