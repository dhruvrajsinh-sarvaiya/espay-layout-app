/* 
    Developer : Nishant Vadgama
    Date : 05-12-2018
    File Comment : Transaction Types Reducer
*/
import {
    //Withdrawal Summary
    WITHDRAWALSUMMARY,
    WITHDRAWALSUMMARY_SUCCESS,
    WITHDRAWALSUMMARY_FAIL,
} from "Actions/types";

// initial state
const INIT_STATE = {
    withdrawalSummary: {
        loading: false
    },
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
      }
    switch (action.type) {
        //withdrawal summary
        case WITHDRAWALSUMMARY:
            return { ...state, withdrawalSummary: { loading: true } };
        case WITHDRAWALSUMMARY_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, withdrawalSummary: action.payload };
        case WITHDRAWALSUMMARY_FAIL:
            return { ...state, withdrawalSummary: { loading: false } };

        default:
            return { ...state };
    }
};
