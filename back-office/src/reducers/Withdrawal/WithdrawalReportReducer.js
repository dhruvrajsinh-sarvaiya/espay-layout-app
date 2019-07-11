import {
    GET_WITHDRAWAL_REPORT_DETAIL,
    GET_WITHDRAWAL_REPORT_DETAIL_SUCCESS,
    GET_WITHDRAWAL_REPORT_DETAIL_FAILURE,
    DEPOSIT_WITHDRAWAL_RECON_PROCESS,
    DEPOSIT_WITHDRAWAL_RECON_PROCESS_SUCCESS,
    DEPOSIT_WITHDRAWAL_RECON_PROCESS_FAILURE
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    errors: {},
    TotalCount: 0,
    withdrawalReportData: [],
    withdrawalResponce: {},
    loading: false,
    reconResponse: {}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        case GET_WITHDRAWAL_REPORT_DETAIL:
            return { ...state, loading: true, errors: {}, withdrawalReportData: [], withdrawalResponce: {}, reconResponse: {} };
        case GET_WITHDRAWAL_REPORT_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                withdrawalReportData: action.payload.Withdraw,
                TotalCount: action.payload.TotalCount,
                withdrawalResponce: action.payload.BizResponseObj,
                errors: {},
            };
        case GET_WITHDRAWAL_REPORT_DETAIL_FAILURE:
            return { ...state, loading: false, errors: action.payload, withdrawalReportData: [], TotalCount: 0, withdrawalResponce: action.payload.BizResponseObj };
        // added by parth andhariya
        // process deposit recon
        case DEPOSIT_WITHDRAWAL_RECON_PROCESS:
            return { ...state, reconResponse: {}, loading: true, errors: {}, };
        case DEPOSIT_WITHDRAWAL_RECON_PROCESS_SUCCESS:
            return { ...state, reconResponse: action.payload, loading: false, errors: {}, };
        case DEPOSIT_WITHDRAWAL_RECON_PROCESS_FAILURE:
            return { ...state, reconResponse: action.payload, loading: false, errors: action.payload };
        default:
            return { ...state };
    }
};
