/* 
    Developer : Parth Andhariya
    Date : 04-06-2019
    File Comment :  Withdrawal Approval Reducer
*/
import {
     // list 
     GET_LIST_WITHDRAWAL_REQUEST,
     GET_LIST_WITHDRAWAL_REQUEST_SUCCESS,
     GET_LIST_WITHDRAWAL_REQUEST_FAILURE,
      //Accpet/Reject
      GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST,
      GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_SUCCESS,
      GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_FAILURE,
} from "Actions/types";
// initial state
const INITIAL_STATE = {
    loading: false,
    WithdrawalRequest: [],
    AcceptRejectWithdeawal: '',
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        //list...
        case GET_LIST_WITHDRAWAL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_LIST_WITHDRAWAL_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                WithdrawalRequest: action.payload.Data,
            };
        case GET_LIST_WITHDRAWAL_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                WithdrawalRequest: [],
            };
        //Accept/Reject...
        case GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                AcceptRejectWithdeawal: action.payload,
            };
        case GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                AcceptRejectWithdeawal: action.payload,
            };
           
        default:
            return { ...state };
    }
};
