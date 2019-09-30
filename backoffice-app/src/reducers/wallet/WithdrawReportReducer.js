import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Withdraw Report
    GET_WITHDRAW_REPORT,
    GET_WITHDRAW_REPORT_SUCCESS,
    GET_WITHDRAW_REPORT_FAILURE,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // Organization List
    ORGLIST,
    ORGLIST_SUCCESS,
    ORGLIST_FAIL,

    // Withdraw Recon Process
    WITHDRAW_RECON_PROCESS,
    WITHDRAW_RECON_PROCESS_SUCCESS,
    WITHDRAW_RECON_PROCESS_FAILURE,

    // Clear Withdraw Report
    CLEAR_WITHDRAW_REPORT_DATA
} from "../../actions/ActionTypes";

// Initial State for Withdraw Report
const INITIAL_STATE = {
    // for Withdraw Report List
    WithdrawReportList: null,
    WithdrawReportLoading: false,
    WithdrawReportError: false,

    // for user data
    UserDataList: null,
    UserDataListLoading: false,
    UserDataListError: false,

    // for wallet
    WalletDataList: null,
    WalletDataListLoading: false,
    WalletDataListError: false,

    // for organization list
    OrganizationList: null,
    OrganizationListLoading: false,
    OrganizationListError: false,
}

export default function WithdrawReportReducer(state, action) {

    // If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Withdraw Report List method data
        case GET_WITHDRAW_REPORT:
            return Object.assign({}, state, {
                WithdrawReportList: null,
                WithdrawReportLoading: true
            })
        // Set Withdraw Report List success data
        case GET_WITHDRAW_REPORT_SUCCESS:
            return Object.assign({}, state, {
                WithdrawReportList: action.data,
                WithdrawReportLoading: false,
            })
        // Set Withdraw Report List failure data
        case GET_WITHDRAW_REPORT_FAILURE:
            return Object.assign({}, state, {
                WithdrawReportList: null,
                WithdrawReportLoading: false,
                WithdrawReportError: true
            })

        // Handle Get User Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: true
            })
        // Set Get User Data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                UserDataList: action.payload,
                UserDataListLoading: false,
            })
        // Set Get User Data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: false,
                UserDataListError: true
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: true
            })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
            })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true
            })

        // Handle Get Organization List method data
        case ORGLIST:
            return Object.assign({}, state, {
                OrganizationList: null,
                OrganizationListLoading: true
            })
        // Set Get Organization List success data
        case ORGLIST_SUCCESS:
            return Object.assign({}, state, {
                OrganizationList: action.payload,
                OrganizationListLoading: false,
            })
        // Set Get Organization List failure data
        case ORGLIST_FAIL:
            return Object.assign({}, state, {
                OrganizationList: null,
                OrganizationListLoading: false,
                OrganizationListError: true
            })

        // Handle Get Withdraw Recon Data method data
        case WITHDRAW_RECON_PROCESS:
            return Object.assign({}, state, {
                WithdrawRecon: null,
                WithdrawReconLoading: true
            })
        // Set Get Withdraw Recon Data success data
        case WITHDRAW_RECON_PROCESS_SUCCESS:
            return Object.assign({}, state, {
                WithdrawRecon: action.data,
                WithdrawReconLoading: false,
            })
        // Set Get Withdraw Recon Data failure data
        case WITHDRAW_RECON_PROCESS_FAILURE:
            return Object.assign({}, state, {
                WithdrawRecon: null,
                WithdrawReconLoading: false,
                WithdrawReconError: true
            })

        // Handle Get Withdraw Recon Data method data
        case CLEAR_WITHDRAW_REPORT_DATA:
            return Object.assign({}, state, {
                WithdrawRecon: null,
                WithdrawReportList: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}