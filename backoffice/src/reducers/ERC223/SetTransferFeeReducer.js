
/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Set transfer Fee Reducer
*/
import {
    //setTransferFee
    SET_TRANSFER_FEE,
    SET_TRANSFER_FEE_SUCCESS,
    SET_TRANSFER_FEE_FAILURE,
    //set transfer fee list
    GET_SET_TRANSFER_FEE,
    GET_SET_TRANSFER_FEE_LIST_SUCCESS,
    GET_SET_TRANSFER_FEE_LIST_FAILURE,
 } from "Actions/types";
 
 const INITIAL_STATE = {
     loading: false,
     TotalCount : 0,
     TransferFee: [],
     TransferFeeList:[]
 }
 
 export default (state = INITIAL_STATE, action) => {
     switch (action.type) {
             // set transfer fee...
         case SET_TRANSFER_FEE:
             return { ...state, loading: true}; 
         case SET_TRANSFER_FEE_SUCCESS:
             return { ...state, loading: false, TransferFee: action.payload};
         case SET_TRANSFER_FEE_FAILURE:
             return { ...state, loading: false, TransferFee: action.payload};
             // set transfer fee list...
         case GET_SET_TRANSFER_FEE:
            return { ...state, loading: true}; 
         case GET_SET_TRANSFER_FEE_LIST_SUCCESS:
            return { ...state, loading: false, TransferFeeList: action.payload.Data};
         case GET_SET_TRANSFER_FEE_LIST_FAILURE:
            return { ...state, loading: false, TransferFeeList: []};
         default:
             return { ...state };
     }
 }
 