import {
    // Get Organization Wallets
    GET_ORG_WALLETS,
    GET_ORG_WALLETS_SUCCESS,
    GET_ORG_WALLETS_FAILURE,

    // Get Organization Ledger
    GET_ORG_LEDGER,
    GET_ORG_LEDGER_SUCCESS,
    GET_ORG_LEDGER_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    //clear data on logout
    ACTION_LOGOUT,

    //clear data
    CLEAR_ORGINAZIATION_LEDGER,
} from '../../actions/ActionTypes';

// initial state
const INITIAL_STATE = {
    //Wallet List data
    walletLoading: false,
    WalletData: null,

    //ledger List data
    ledgerLoading: false,
    ledgerData: null,

    //for currency
    currencyLoading: false,
    currencyData: null
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // Handle Get Wallet List data
        case GET_ORG_WALLETS:
            return Object.assign({}, state, { walletLoading: true, WalletData: null })
        // Handle Get Wallet List Success
        case GET_ORG_WALLETS_SUCCESS:
            return Object.assign({}, state, { walletLoading: false, WalletData: action.payload })
        // Handle Get Wallet List Failure
        case GET_ORG_WALLETS_FAILURE:
            return Object.assign({}, state, { walletLoading: false, WalletData: action.payload })

        // Handle Get Ledger List data
        case GET_ORG_LEDGER:
            return Object.assign({}, state, { ledgerLoading: true, ledgerData: null })
        // Handle Get Ledger List Succes data
        case GET_ORG_LEDGER_SUCCESS:
            return Object.assign({}, state, { ledgerLoading: false, ledgerData: action.payload })
        // Handle Get Ledger List Failure data
        case GET_ORG_LEDGER_FAILURE:
            return Object.assign({}, state, { ledgerLoading: false, ledgerData: action.payload })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { currencyLoading: true, currencyData: null })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { currencyLoading: false, currencyData: action.payload })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { currencyLoading: false, currencyData: action.payload })

        //clear ledger response
        case CLEAR_ORGINAZIATION_LEDGER:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}