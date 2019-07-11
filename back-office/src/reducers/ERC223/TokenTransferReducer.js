
/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Token Transfer Reducer
*/
import {
    //TokenTransfer
    GET_TOKEN_TRANSFER,
    GET_TOKEN_TRANSFER_SUCCESS,
    GET_TOKEN_TRANSFER_FAILURE,
    //token transfer list
    GET_TOKEN_TRANSFER_LIST,
    GET_TOKEN_TRANSFER_LIST_SUCCESS,
    GET_TOKEN_TRANSFER_LIST_FAILURE,
 } from "Actions/types";
 
 const INITIAL_STATE = {
     loading: false,
     TotalCount : 0,
     tokenTransfer: [],
     tokenTransferList: []
 }
 
 export default (state, action) => {
    if (typeof state === 'undefined') {
      return INITIAL_STATE
    }
     switch (action.type) {
             // token transfer...
         case GET_TOKEN_TRANSFER:
         case GET_TOKEN_TRANSFER_LIST:
             return { ...state, loading: true};
         case GET_TOKEN_TRANSFER_SUCCESS:
         case GET_TOKEN_TRANSFER_FAILURE:
             return { ...state, loading: false, tokenTransfer: action.payload};

        case GET_TOKEN_TRANSFER_LIST_SUCCESS:
            return { ...state, loading: false, tokenTransferList: action.payload.Data};
        case GET_TOKEN_TRANSFER_LIST_FAILURE:
            return { ...state, loading: false, tokenTransferList: []};
         default:
             return { ...state };
     }
 }
 