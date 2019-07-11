/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Display Affiliate reducers
*/
import {

    //For Display Affiliate Report
    AFFILIATE_SIGNUP_REPORT,
    AFFILIATE_SIGNUP_REPORT_SUCCESS,
    AFFILIATE_SIGNUP_REPORT_FAILURE,

    //For Display Affiliate Commission Report
    AFFILIATE_COMMISSION_REPORT,
    AFFILIATE_COMMISSION_REPORT_SUCCESS,
    AFFILIATE_COMMISSION_REPORT_FAILURE,

} from "Actions/types";

const INIT_STATE = {
    signupData: [],
    commissionData: [],
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
      }
    switch (action.type) {
        //For Display Affiliate Report
        case AFFILIATE_SIGNUP_REPORT:
            return { ...state, loading: true, signupData: [] };

        case AFFILIATE_SIGNUP_REPORT_SUCCESS:
            return { ...state, loading: false, signupData: action.payload };

        case AFFILIATE_SIGNUP_REPORT_FAILURE:
            return { ...state, loading: false, signupData: action.payload };

        //For Display Affiliate Report
        case AFFILIATE_COMMISSION_REPORT:
            return { ...state, loading: true, commissionData: [] };

        case AFFILIATE_COMMISSION_REPORT_SUCCESS:
            return { ...state, loading: false, commissionData: action.payload };

        case AFFILIATE_COMMISSION_REPORT_FAILURE:
            return { ...state, loading: false, commissionData: action.payload };

        default:
            return { ...state };
    }
};