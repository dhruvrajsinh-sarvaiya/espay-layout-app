/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    File Comment : Withdraw History Reducer action manager
*/
// import only required withdraw history actions
import {
    GET_WITHDRAW_HISTORY,
    GET_WITHDRAW_HISTORY_SUCCESS,
    GET_WITHDRAW_HISTORY_FAILURE,
    //resend mail confirmation...
    RESENDMAIL,
    RESENDMAIL_SUCCESS,
    RESENDMAIL_FAILURE
} from 'Actions/types';


//Set Initial State
const INITIAL_STATE = {
    withdrawhistory: [],
    resendMailResponse: {},
    withdrawhistoryLoading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {
        case GET_WITHDRAW_HISTORY:
            return { ...state, withdrawhistoryLoading: true, resendMailResponse: {} };
        case GET_WITHDRAW_HISTORY_SUCCESS:
            return { ...state, withdrawhistoryLoading: false, withdrawhistory: action.payload };
        case GET_WITHDRAW_HISTORY_FAILURE:
            return { ...state, withdrawhistoryLoading: false, withdrawhistory: [] };

        //resend mail confirmation
        case RESENDMAIL:
            return { ...state, withdrawhistoryLoading: true, resendMailResponse: {} };
        case RESENDMAIL_SUCCESS:
            return { ...state, withdrawhistoryLoading: false, resendMailResponse: action.payload };
        case RESENDMAIL_FAILURE:
            return { ...state, withdrawhistoryLoading: false, resendMailResponse: action.error };

        default: return { ...state };
    }
}