// Action types for Token Stacking
import {
    // Fetch Slab List
    FETCH_SLAB_LIST,
    FETCH_SLAB_LIST_SUCCESS,
    FETCH_SLAB_LIST_FAILURE,

    // Fetching Token Stacking History Data
    FETCHING_TOKEN_STACKING_HISTORY_DATA,
    FETCHING_TOKEN_STACKING_HISTORY_SUCCESS,
    FETCHING_TOKEN_STACKING_HISTORY_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Pre Confirmation Details
    PRECONFIRMATIONDETAILS,
    PRECONFIRMATIONDETAILS_SUCCESS,
    PRECONFIRMATIONDETAILS_FAILURE,

    // Stack Request
    STAKREQUEST,
    STAKREQUEST_SUCCESS,
    STAKREQUEST_FAILURE,

    // Dropdown Change
    DropdownChange,

    //For Wallet Type Master
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTER_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    // Get Wallets Address
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,

    //For Unstaking
    UNSTAKING_REQUEST,
    UNSTAKING_REQUEST_SUCCESS,
    UNSTAKING_REQUEST_FAILURE,

} from "../actions/ActionTypes";

// Initial state for Token Stacking
const INTIAL_STATE = {

    //Initial State For Slab List Data
    SlabListFetchData: true,
    SlabListisFetching: false,
    SlabListdata: '',

    // Initial State For Token Stacking History Data
    TokenStackingHistoryFetchData: true,
    TokenStackingHistorydata: '',
    TokenStackingIsFetching: false,

    PreReqData: '',
    PreReqFetchData: true,
    PreReqIsFetching: false,

    PostReqData: '',
    PostReqFetchData: true,
    PostReqIsFetching: false,

    //For Currency Type List
    WalletListData: '',
    WalletListFetchData: true,
    WalletListIsFetching: false,

    //For Wallet Type List
    WalletData: '',
    WalletFetchData: true,
    WalletDataIsFetching: false,

    //For Unstaking
    UnstakingRequestDate: '',
    UnstakingRequestFetchData: true,
    UnstakingRequestIsFetching: false,
}

const TokenStackingReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        case DropdownChange:
            return Object.assign({}, state, {
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
                TokenStackingHistoryFetchData: true,
            });

        // Handle Unstacking Request method data
        case UNSTAKING_REQUEST:
            return {
                ...state,
                UnstakingRequestIsFetching: true,
                UnstakingRequestFetchData: true,
                UnstakingRequestDate: '',
            };
        // Set Unstacking Request success data
        case UNSTAKING_REQUEST_SUCCESS:
            return {
                ...state,
                UnstakingRequestIsFetching: false,
                UnstakingRequestFetchData: false,
                UnstakingRequestDate: action.payload,
            };
        // Set Unstacking Request failure data
        case UNSTAKING_REQUEST_FAILURE:
            return {
                ...state,
                UnstakingRequestIsFetching: false,
                UnstakingRequestFetchData: false,
                UnstakingRequestDate: action.payload,
            };

        // Handle Wallet Address method data
        case GET_AD_WALLETS:
            return {
                ...state,
                WalletDataIsFetching: true,
                WalletFetchData: true,
                WalletData: '',
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
            };
        // Set Wallet Address success data
        case GET_AD_WALLETS_SUCCESS:
            return {
                ...state,
                WalletDataIsFetching: false,
                WalletFetchData: false,
                WalletData: action.payload,
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
            };
        // Set Wallet Address failure data
        case GET_AD_WALLETS_FAILURE:
            return {
                ...state,
                WalletDataIsFetching: false,
                WalletFetchData: false,
                WalletData: action.payload,
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
            };

        // Handle Slab List method data
        case FETCH_SLAB_LIST:
            return Object.assign({}, state, {
                SlabListFetchData: true,
                SlabListisFetching: true,
                SlabListdata: '',
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });
        // Set Slab List success data
        case FETCH_SLAB_LIST_SUCCESS:

            return Object.assign({}, state, {
                SlabListFetchData: false,
                SlabListisFetching: false,
                SlabListdata: action.data,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });
        // Set Slab List failure data
        case FETCH_SLAB_LIST_FAILURE:
            return Object.assign({}, state, {
                SlabListFetchData: false,
                SlabListisFetching: false,
                SlabListdata: action.e,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });

        // Handle Stack Request method data
        case STAKREQUEST:
            return Object.assign({}, state, {
                PostReqFetchData: true,
                PostReqIsFetching: true,
                PostReqData: '',
                SlabListFetchData: true,
                PreReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });
        // Set Stack Request success data
        case STAKREQUEST_SUCCESS:

            return Object.assign({}, state, {
                PostReqFetchData: false,
                PostReqIsFetching: false,
                PostReqData: action.payload,
                SlabListFetchData: true,
                PreReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });
        // Set Stack Request failure data
        case STAKREQUEST_FAILURE:
            return Object.assign({}, state, {
                PostReqFetchData: false,
                PostReqIsFetching: false,
                PostReqData: action.payload,
                SlabListFetchData: true,
                PreReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });

        // Handle Pre Confirmation Detail method data
        case PRECONFIRMATIONDETAILS:
            return Object.assign({}, state, {
                PreReqFetchData: true,
                PreReqIsFetching: true,
                PreReqData: '',
                SlabListFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });
        // Set Pre Confirmation Detail success data
        case PRECONFIRMATIONDETAILS_SUCCESS:

            return Object.assign({}, state, {
                PreReqFetchData: false,
                PreReqIsFetching: false,
                PreReqData: action.payload,
                SlabListFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });
        // Set Pre Confirmation Detail failure data
        case PRECONFIRMATIONDETAILS_FAILURE:
            return Object.assign({}, state, {
                PreReqFetchData: false,
                PreReqIsFetching: false,
                PreReqData: action.payload,
                SlabListFetchData: true,
                PostReqFetchData: true,
                WalletListFetchData: true,
                WalletFetchData: true,
            });

        // Handle Wallet Type Master method data
        case GET_WALLET_TYPE_MASTER:
            return Object.assign({}, state, {
                WalletListIsFetching: true,
                WalletListData: '',
                WalletListFetchData: true,
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletFetchData: true,
            });
        // Set Wallet Type Master success data
        case GET_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, {
                WalletListIsFetching: false,
                WalletListData: action.payload,
                WalletListFetchData: false,
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletFetchData: true,
            });
        // Set Wallet Type Master failure data
        case GET_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, {
                WalletListIsFetching: false,
                WalletListData: action.payload,
                WalletListFetchData: false,
                SlabListFetchData: true,
                PreReqFetchData: true,
                PostReqFetchData: true,
                WalletFetchData: true,
            });

        // Handle Token Stacking History method data
        case FETCHING_TOKEN_STACKING_HISTORY_DATA:
            return Object.assign({}, state, {
                TokenStackingHistoryFetchData: true,
                TokenStackingIsFetching: true,
                TokenStackingHistorydata: ''
            });
        // Set Token Stacking History success data
        case FETCHING_TOKEN_STACKING_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                TokenStackingHistoryFetchData: false,
                TokenStackingIsFetching: false,
                TokenStackingHistorydata: action.data
            });
        // Set Token Stacking History failure data
        case FETCHING_TOKEN_STACKING_HISTORY_FAILURE:
            return Object.assign({}, state, {
                TokenStackingHistoryFetchData: false,
                TokenStackingIsFetching: false,
                TokenStackingHistorydata: action.e
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default TokenStackingReducer;



