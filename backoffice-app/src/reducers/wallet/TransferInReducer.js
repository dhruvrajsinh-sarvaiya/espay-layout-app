import {
    // Get Transfer In List
    GET_TRANSFER_IN_LIST,
    GET_TRANSFER_IN_LIST_SUCCESS,
    GET_TRANSFER_IN_LIST_FAILURE,

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

    // Get Transfer Out List
    GET_TRANSFER_OUT_LIST,
    GET_TRANSFER_OUT_LIST_SUCCESS,
    GET_TRANSFER_OUT_LIST_FAILURE,

    // Clear Data
    ACTION_LOGOUT,
    CLEAR_TRANSFER_IN_OUT_DATA
} from "../../actions/ActionTypes";

// Initial State for Transfer In
const INITIAL_STATE = {
    // Transfer In List
    TransferInList: null,
    TransferInLoading: false,
    TransferInError: false,

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

    // common loading for walletdata and transfer in/out
    CommonLoading: false,

    // Transfer Out List
    TransferOutList: null,
    TransferOutLoading: false,
    TransferOutError: false,
}

export default function TransferInReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Transfer In List method data
        case GET_TRANSFER_IN_LIST:
            return Object.assign({}, state, {
                TransferInList: null,
                TransferOutList: null,
                TransferInLoading: true,
                CommonLoading: true,
            })
        // Set Transfer In List success data
        case GET_TRANSFER_IN_LIST_SUCCESS:
            return Object.assign({}, state, {
                TransferInList: action.data,
                TransferOutList: null,
                TransferInLoading: false,
                CommonLoading: false,
            })
        // Set Transfer In List failure data
        case GET_TRANSFER_IN_LIST_FAILURE:
            return Object.assign({}, state, {
                TransferInList: null,
                TransferOutList: null,
                TransferInLoading: false,
                TransferInError: true,
                CommonLoading: false,
            })

        // Handle Transfer Out List method data
        case GET_TRANSFER_OUT_LIST:
            return Object.assign({}, state, {
                TransferOutList: null,
                TransferInList: null,
                TransferOutLoading: true,
                CommonLoading: true,
            })
        // Set Transfer Out List success data
        case GET_TRANSFER_OUT_LIST_SUCCESS:
            return Object.assign({}, state, {
                TransferOutList: action.data,
                TransferInList: null,
                TransferOutLoading: false,
                CommonLoading: false,
            })
        // Set Transfer Out List failure data
        case GET_TRANSFER_OUT_LIST_FAILURE:
            return Object.assign({}, state, {
                TransferOutList: null,
                TransferInList: null,
                TransferOutLoading: false,
                TransferOutError: true,
                CommonLoading: false,
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
                WalletDataListLoading: true,
                CommonLoading: true,
            })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
                CommonLoading: false,
            })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true,
                CommonLoading: false,
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

        // Handle Clear Transfer In/Out Data method data
        case CLEAR_TRANSFER_IN_OUT_DATA:
            return Object.assign({}, state, {
                TransferInList: null,
                TransferOutList: null
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
