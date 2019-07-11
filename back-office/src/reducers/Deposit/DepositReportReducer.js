/* 
    Developer : Nishant Vadgama
    Date : 18-03-2019
    File Comment : Deposit Report reducer constants
*/
import {
    // get deposit report
    GET_DEPOSIT_REPORT_DETAIL,
    GET_DEPOSIT_REPORT_DETAIL_SUCCESS,
    GET_DEPOSIT_REPORT_DETAIL_FAILURE,
    // process deposit recon
    DEPOSIT_RECON_PROCESS,
    DEPOSIT_RECON_PROCESS_SUCCESS,
    DEPOSIT_RECON_PROCESS_FAILURE,
    // 2FA AUTHENTICATION
    WITHDRAWA2FAAUTH,
    WITHDRAWA2FAAUTH_SUCCESS,
    WITHDRAWA2FAAUTH_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    errors: {},
    TotalCount: 0,
    depositReportData: [],
    depositResponce: {},
    reconResponse: {},
    response2fa: { loading: false },
    error2fa: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        case GET_DEPOSIT_REPORT_DETAIL:
            return { ...state, loading: true, errors: {}, depositReportData: [], depositResponce: {}, reconResponse: {} };
        case GET_DEPOSIT_REPORT_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                depositReportData: action.payload.Deposit,
                TotalCount: action.payload.TotalCount,
                depositResponce: action.payload.BizResponseObj,
                errors: {},
            };
        case GET_DEPOSIT_REPORT_DETAIL_FAILURE:
            return { ...state, loading: false, errors: action.payload, depositReportData: [], TotalCount: 0, depositResponce: action.payload.BizResponseObj };
        // process deposit recon
        case DEPOSIT_RECON_PROCESS:
            return { ...state, reconResponse: {}, loading: true, response2fa: { loading: false } };
        case DEPOSIT_RECON_PROCESS_SUCCESS:
        case DEPOSIT_RECON_PROCESS_FAILURE:
            return { ...state, reconResponse: action.payload, loading: false };
        // VERIFY 2FA AUTHENTICATION FOR WITHDRAWAL
        case WITHDRAWA2FAAUTH:
            return { ...state, response2fa: { loading: true }, reconResponse: {} }
        case WITHDRAWA2FAAUTH_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, response2fa: action.payload, error2fa: {} }
        case WITHDRAWA2FAAUTH_FAILURE:
            return { ...state, error2fa: action.payload, response2fa: { loading: false } }
        default:
            return { ...state };
    }
};
