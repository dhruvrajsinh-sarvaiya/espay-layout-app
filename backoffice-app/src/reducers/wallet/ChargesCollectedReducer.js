import {
    //Charges Collected List
    GET_CHARGECOLLECTED_REPORT,
    GET_CHARGECOLLECTED_REPORT_SUCCESS,
    GET_CHARGECOLLECTED_REPORT_FAILURE,

    //get trasancation type 
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    //get all wallet type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    //clear data
    CLEAR_CHARGES_COLLECTED,

    //clear data on logout
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

const INITIAL_STATE = {
    //Charges Collected List
    chargeCollectedLoading: false,
    chargeCollectedData: null,

    //for Wallet list
    walletData: null,

    //get trasancation type
    walletTransactionType: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //clear ledger response
        case CLEAR_CHARGES_COLLECTED:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // Handle Daemon Address List data
        case GET_CHARGECOLLECTED_REPORT:
            return Object.assign({}, state, { chargeCollectedLoading: true, chargeCollectedData: null })
        // Handle Daemon Address List data Success
        case GET_CHARGECOLLECTED_REPORT_SUCCESS:
            return Object.assign({}, state, { chargeCollectedLoading: false, chargeCollectedData: action.payload })
        // Handle Daemon Address List data Failure
        case GET_CHARGECOLLECTED_REPORT_FAILURE:
            return Object.assign({}, state, { chargeCollectedLoading: false, chargeCollectedData: action.payload })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload })

        //handle get wallet type Method
        case GET_WALLET_TRANSACTION_TYPE:
            return Object.assign({}, state, { walletTransactionType: null })
        //handle set wallet type Success Method
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return Object.assign({}, state, { walletTransactionType: action.payload })
        //handle set wallet type failure Method
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, { walletTransactionType: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};
