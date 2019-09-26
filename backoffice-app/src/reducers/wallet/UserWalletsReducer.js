import {
    // Get User Wallets List
    GET_USER_WALLETS_LIST,
    GET_USER_WALLETS_LIST_SUCCESS,
    GET_USER_WALLETS_LIST_FAILURE,

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

    // Clear User Wallets Data
    CLEAR_USER_WALLETS_DATA,

    // Action Logout
    ACTION_LOGOUT,

    // Get Auth User List
    GET_AUTH_USER_LIST,
    GET_AUTH_USER_LIST_SUCCESS,
    GET_AUTH_USER_LIST_FAILURE,

    // Get Wallet Ledger List
    GET_WALLET_LEDGER_LIST,
    GET_WALLET_LEDGER_LIST_SUCCESS,
    GET_WALLET_LEDGER_LIST_FAILURE
} from "../../actions/ActionTypes";

// Initial State for User Wallets
const INITIAL_STATE = {
    // for User Wallets List
    UserWalletsList: null,
    UserWalletsLoading: false,
    UserWalletsError: false,

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

    // for Auth User List
    AuthUserList: null,
    AuthUserLoading: false,
    AuthUserError: false,

    // for Wallet Ledger List
    WalletLedgerList: null,
    WalletLedgerLoading: false,
    WalletLedgerError: false,
}

export default function UserWalletsReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle User Wallets List method data
        case GET_USER_WALLETS_LIST:
            return Object.assign({}, state, {
                UserWalletsList: null,
                UserWalletsLoading: true
            })
        // Set User Wallets List success data
        case GET_USER_WALLETS_LIST_SUCCESS:
            return Object.assign({}, state, {
                UserWalletsList: action.data,
                UserWalletsLoading: false,
            })
        // Set User Wallets List failure data
        case GET_USER_WALLETS_LIST_FAILURE:
            return Object.assign({}, state, {
                UserWalletsList: null,
                UserWalletsLoading: false,
                UserWalletsError: true
            })

        // Clear User Wallets method data
        case CLEAR_USER_WALLETS_DATA:
            return Object.assign({}, state, {
                UserWalletsList: null,
                WalletLedgerList: null,
                AuthUserList: null
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

        // Handle Auth User List method data
        case GET_AUTH_USER_LIST:
            return Object.assign({}, state, {
                AuthUserList: null,
                AuthUserLoading: true
            })
        // Set Auth User List success data
        case GET_AUTH_USER_LIST_SUCCESS:
            return Object.assign({}, state, {
                AuthUserList: action.data,
                AuthUserLoading: false,
            })
        // Set Auth User List failure data
        case GET_AUTH_USER_LIST_FAILURE:
            return Object.assign({}, state, {
                AuthUserList: null,
                AuthUserLoading: false,
                AuthUserError: true
            })

        // Handle Auth User List method data
        case GET_WALLET_LEDGER_LIST:
            return Object.assign({}, state, {
                WalletLedgerList: null,
                WalletLedgerLoading: true
            })
        // Set Auth User List success data
        case GET_WALLET_LEDGER_LIST_SUCCESS:
            return Object.assign({}, state, {
                WalletLedgerList: action.data,
                WalletLedgerLoading: false,
            })
        // Set Auth User List failure data
        case GET_WALLET_LEDGER_LIST_FAILURE:
            return Object.assign({}, state, {
                WalletLedgerList: null,
                WalletLedgerLoading: false,
                WalletLedgerError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}