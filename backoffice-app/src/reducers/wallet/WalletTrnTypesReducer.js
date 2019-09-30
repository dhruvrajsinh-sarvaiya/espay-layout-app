import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Wallet Trn Types List
    GET_WALLET_TRN_TYPES_LIST,
    GET_WALLET_TRN_TYPES_LIST_SUCCESS,
    GET_WALLET_TRN_TYPES_LIST_FAILURE,

    // Change Wallet Trn Type
    CHANGE_WALLET_TRN_TYPE,
    CHANGE_WALLET_TRN_TYPE_SUCCESS,
    CHANGE_WALLET_TRN_TYPE_FAILURE,

    // Clear Wallet Transaction Type Data
    CLEAR_WALLET_TRN_TYPES_DATA,

    // Get Wallet Transaction Type
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    // Add Wallet Trn Types
    ADD_WALLET_TRN_TYPES,
    ADD_WALLET_TRN_TYPES_SUCCESS,
    ADD_WALLET_TRN_TYPES_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Wallet Transaction Types Module
const INITIAL_STATE = {

    // for Wallet Transaction Types List
    WalletTrnTypesList: null,
    WalletTrnTypesLoading: false,
    WalletTrnTypesError: false,

    // for Wallet Transaction Types List
    ChangeWalletTrnType: null,
    ChangeWalletTrnTypeLoading: false,
    ChangeWalletTrnTypeError: false,

    // Transaction Types
    TransactionTypesData: null,
    TransactionTypesLoading: false,
    TransactionTypesError: false,

    // Add Wallet Transaction Types
    AddWalletTrnTypesData: null,
    AddWalletTrnTypesLoading: false,
    AddWalletTrnTypesError: false,
}

export default function WalletTrnTypesReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE
        
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Wallet Trn Types List method data
        case GET_WALLET_TRN_TYPES_LIST:
            return Object.assign({}, state, {
                WalletTrnTypesList: null,
                WalletTrnTypesLoading: true
            })
        // Set Wallet Trn Types List success data
        case GET_WALLET_TRN_TYPES_LIST_SUCCESS:
            return Object.assign({}, state, {
                WalletTrnTypesList: action.data,
                WalletTrnTypesLoading: false,
            })
        // Set Wallet Trn Types List failure data
        case GET_WALLET_TRN_TYPES_LIST_FAILURE:
            return Object.assign({}, state, {
                WalletTrnTypesList: null,
                WalletTrnTypesLoading: false,
                WalletTrnTypesError: true
            })

        // Handle Change Wallet Trn Types method data
        case CHANGE_WALLET_TRN_TYPE:
            return Object.assign({}, state, {
                ChangeWalletTrnType: null,
                ChangeWalletTrnTypeLoading: true
            })
        // Set Change Wallet Trn Types success data
        case CHANGE_WALLET_TRN_TYPE_SUCCESS:
            return Object.assign({}, state, {
                ChangeWalletTrnType: action.data,
                ChangeWalletTrnTypeLoading: false,
            })
        // Set Change Wallet Trn Types failure data
        case CHANGE_WALLET_TRN_TYPE_FAILURE:
            return Object.assign({}, state, {
                ChangeWalletTrnType: null,
                ChangeWalletTrnTypeLoading: false,
                ChangeWalletTrnTypeError: true
            })

        // Handle Get Wallet Trn Types List method data
        case GET_WALLET_TRANSACTION_TYPE:
            return Object.assign({}, state, {
                TransactionTypesData: null,
                TransactionTypesLoading: true
            })
        // Set Get Wallet Trn Types List success data
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return Object.assign({}, state, {
                TransactionTypesData: action.payload,
                TransactionTypesLoading: false,
            })
        // Set Get Wallet Trn Types List failure data
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, {
                TransactionTypesData: null,
                TransactionTypesLoading: false,
                TransactionTypesError: true
            })

        // Handle Add Wallet Trn Types List method data
        case ADD_WALLET_TRN_TYPES:
            return Object.assign({}, state, {
                AddWalletTrnTypesData: null,
                AddWalletTrnTypesLoading: true
            })
        // Set Add Wallet Trn Types List success data
        case ADD_WALLET_TRN_TYPES_SUCCESS:
            return Object.assign({}, state, {
                AddWalletTrnTypesData: action.data,
                AddWalletTrnTypesLoading: false,
            })
        // Set Add Wallet Trn Types List failure data
        case ADD_WALLET_TRN_TYPES_FAILURE:
            return Object.assign({}, state, {
                AddWalletTrnTypesData: null,
                AddWalletTrnTypesLoading: false,
                AddWalletTrnTypesError: true
            })

        // Handle Clear Wallet Trn Types method data
        case CLEAR_WALLET_TRN_TYPES_DATA:
            return Object.assign({}, state, {
                ChangeWalletTrnType: null,
                WalletTrnTypesList: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}