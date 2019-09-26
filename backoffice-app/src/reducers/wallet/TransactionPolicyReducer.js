import {
    //transaction policy list
    GET_TRANSACTION_POLICY,
    GET_TRANSACTION_POLICY_SUCCESS,
    GET_TRANSACTION_POLICY_FAILURE,

    //update transaction policy status delete
    UPDATE_TRANSACTION_POLICY_STATUS,
    UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS,
    UPDATE_TRANSACTION_POLICY_STATUS_FAILURE,

    //Add transaction policy 
    ADD_TRANSACTION_POLICY,
    ADD_TRANSACTION_POLICY_SUCCESS,
    ADD_TRANSACTION_POLICY_FAILURE,

    //update transaction policy 
    UPDATE_TRANSACTION_POLICY,
    UPDATE_TRANSACTION_POLICY_SUCCESS,
    UPDATE_TRANSACTION_POLICY_FAILURE,

    //get trasancation type 
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    //get roles
    GET_ROLE_DETAILS,
    GET_ROLE_DETAILS_SUCCESS,
    GET_ROLE_DETAILS_FAILURE,

    //clear transaction policy response
    CLEAR_TRANSACTION_POLICY,

    //for the clear data on logout
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    //transaction policy list
    transactionPolicyData: null,
    Loading: false,

    //update transaction policy status delete
    isUpdateStatus: false,
    updateStatus: null,

    //Add transaction policy 
    isAddPolicy: false,
    addTransactionData: null,

    //update transaction policy 
    isUpdatePolicy: false,
    updateTransactionData: null,

    //roles 
    isRoleFetching: false,
    roleDetails: null,

    //get trasancation type
    isWalletTransactionType: false,
    walletTransactionType: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // Handle Get Transaction Policy List data
        case GET_TRANSACTION_POLICY:
            return Object.assign({}, state, { Loading: true, transactionPolicyData: null })
        // Set Transaction Policy List success data
        case GET_TRANSACTION_POLICY_SUCCESS:
            return Object.assign({}, state, { Loading: false, transactionPolicyData: action.payload, })
        // Set Transaction Policy List Failure data
        case GET_TRANSACTION_POLICY_FAILURE:
            return Object.assign({}, state, { Loading: false, transactionPolicyData: action.payload, })

        //handle get Delete Transaction Policy Method
        case UPDATE_TRANSACTION_POLICY_STATUS:
            return Object.assign({}, state, { isUpdateStatus: true, updateStatus: null })
        //handle set Delete Transaction Policy Success Method
        case UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS:
            return Object.assign({}, state, { isUpdateStatus: false, updateStatus: action.payload })
        //handle set Delete Transaction Policy failure Method
        case UPDATE_TRANSACTION_POLICY_STATUS_FAILURE:
            return Object.assign({}, state, { isUpdateStatus: false, updateStatus: action.payload })

        //handle get add Transaction Policy Method
        case ADD_TRANSACTION_POLICY:
            return Object.assign({}, state, { isAddPolicy: true, addTransactionData: null })
        //handle set add Transaction Policy Success Method
        case ADD_TRANSACTION_POLICY_SUCCESS:
            return Object.assign({}, state, { isAddPolicy: false, addTransactionData: action.payload })
        //handle set add Transaction Policy failure Method
        case ADD_TRANSACTION_POLICY_FAILURE:
            return Object.assign({}, state, { isAddPolicy: false, addTransactionData: action.payload })

        //handle get update Transaction Policy Method
        case UPDATE_TRANSACTION_POLICY:
            return Object.assign({}, state, { isUpdatePolicy: true, updateTransactionData: null })
        //handle set update Transaction Policy Success Method
        case UPDATE_TRANSACTION_POLICY_SUCCESS:
            return Object.assign({}, state, { isUpdatePolicy: false, updateTransactionData: action.payload })
        //handle set update Transaction Policy failure Method
        case UPDATE_TRANSACTION_POLICY_FAILURE:
            return Object.assign({}, state, { isUpdatePolicy: false, updateTransactionData: action.payload })

        //handle get wallet type Method
        case GET_WALLET_TRANSACTION_TYPE:
            return Object.assign({}, state, { isWalletTransactionType: true, walletTransactionType: null })
        //handle set wallet type Success Method
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return Object.assign({}, state, { isWalletTransactionType: false, walletTransactionType: action.payload })
        //handle set wallet type failure Method
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, { isWalletTransactionType: false, walletTransactionType: action.payload })

        //handle get roles Method 
        case GET_ROLE_DETAILS:
            return Object.assign({}, state, { isRoleFetching: true, roleDetails: null })
        //handle set roles Success Method
        case GET_ROLE_DETAILS_SUCCESS:
            return Object.assign({}, state, { isRoleFetching: false, roleDetails: action.payload })
        //handle set roles failure Method
        case GET_ROLE_DETAILS_FAILURE:
            return Object.assign({}, state, { isRoleFetching: false, roleDetails: action.payload })

        //clear transaction policy response
        case CLEAR_TRANSACTION_POLICY:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
