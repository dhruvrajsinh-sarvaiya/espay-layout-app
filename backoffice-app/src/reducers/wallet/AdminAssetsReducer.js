import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Admin Assets List
    GET_ADMIN_ASSETS_LIST,
    GET_ADMIN_ASSETS_LIST_SUCCESS,
    GET_ADMIN_ASSETS_LIST_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Admin Assets Module
const INITIAL_STATE = {

    // for Admin Assets List
    AdminAssetsList: null,
    AdminAssetsLoading: false,
    AdminAssetsError: false,

    // for wallet
    WalletDataList: null,
    WalletDataListLoading: false,
    WalletDataListError: false,
}

export default function AdminAssetsReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Admin Assets List method data
        case GET_ADMIN_ASSETS_LIST:
            return Object.assign({}, state, {
                AdminAssetsList: null,
                AdminAssetsLoading: true
            })
        // Set Admin Assets List success data
        case GET_ADMIN_ASSETS_LIST_SUCCESS:
            return Object.assign({}, state, {
                AdminAssetsList: action.data,
                AdminAssetsLoading: false,
            })
        // Set Admin Assets List failure data
        case GET_ADMIN_ASSETS_LIST_FAILURE:
            return Object.assign({}, state, {
                AdminAssetsList: null,
                AdminAssetsLoading: false,
                AdminAssetsError: true
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: true
            })
        // Set Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
            })
        // Set Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}