import {
    GET_INTERNALTRANSFER_HISTORY,
    GET_INTERNALTRANSFER_HISTORY_SUCCESS,
    GET_INTERNALTRANSFER_HISTORY_FAILURE
  } from "Actions/types";
  
  const INITIAL_STATE = {
    internalTransferHistory: [],
    Loading: false
  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GET_INTERNALTRANSFER_HISTORY:
        return { ...state, Loading: true };
  
      case GET_INTERNALTRANSFER_HISTORY_SUCCESS:
        console.log(action);
        return {
          ...state,
          Loading: false,
          internalTransferHistory: action.payload
        };
  
      case GET_INTERNALTRANSFER_HISTORY_FAILURE:
        return { ...state, Loading: false };
  
      default:
        return { ...state };
    }
  };
  