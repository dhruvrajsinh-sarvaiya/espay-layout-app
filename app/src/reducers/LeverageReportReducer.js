// Action types for Leverage Report
import {
    // Leverage Request Report List
    LEVERAGE_REQUEST_REPORT_LIST,
    LEVERAGE_REQUEST_REPORT_LIST_SUCCESS,
    LEVERAGE_REQUEST_REPORT_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,
} from "../actions/ActionTypes";

const initialState = {

    //Initial State For Leverage REPORT Data
    LeverageReportFetchData: true,
    LeverageReportdata: '',
    LeverageReportisFetching: false,

    //Initial State For Wallet Type Data
    WalletTypeFetchData: true,
    WalletTypedata: '',
}

const LeverageReportReducer = (state = initialState, action) => {
    switch (action.type) {
        // Handle Fetch Balance method data
        case FETCH_BALANCE:
            return Object.assign({}, state, {
                WalletTypeFetchData: true,
                WalletTypedata: '',
                LeverageReportFetchData: true,
            });
        // Set Fetch Balance success data
        case FETCH_BALANCE_SUCCESS:
            return Object.assign({}, state, {
                WalletTypeFetchData: false,
                WalletTypedata: action.data,
                LeverageReportFetchData: true,
            });
        // Set Fetch Balance failure data
        case FETCH_BALANCE_FAILURE:
            return Object.assign({}, state, {
                WalletTypeFetchData: false,
                WalletTypedata: action.e,
                LeverageReportFetchData: true,
            });

        // Handle Leverage Request Report List method data
        case LEVERAGE_REQUEST_REPORT_LIST:
            return Object.assign({}, state, {
                LeverageReportFetchData: true,
                LeverageReportisFetching: true,
                LeverageReportdata: '',
                WalletTypeFetchData: true,
            });
        // Set Leverage Request Report List success data
        case LEVERAGE_REQUEST_REPORT_LIST_SUCCESS:
            return Object.assign({}, state, {
                LeverageReportFetchData: false,
                LeverageReportisFetching: false,
                LeverageReportdata: action.response,
                WalletTypeFetchData: true,
            });
        // Set Leverage Request Report List failure data
        case LEVERAGE_REQUEST_REPORT_LIST_FAILURE:
            return Object.assign({}, state, {
                LeverageReportFetchData: false,
                LeverageReportisFetching: false,
                LeverageReportdata: action.error,
                WalletTypeFetchData: true,
            });

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default LeverageReportReducer;