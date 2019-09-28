import {
    //Wallet Usage policy list
    GET_WALLET_USAGE_POLICY,
    GET_WALLET_USAGE_POLICY_SUCCESS,
    GET_WALLET_USAGE_POLICY_FAILURE,

    //update Wallet Usage policy status delete
    UPDATE_WALLET_USAGE_POLICY_STATUS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE,

    //Add Wallet Usage policy 
    ADD_WALLET_USAGE_POLICY,
    ADD_WALLET_USAGE_POLICY_SUCCESS,
    ADD_WALLET_USAGE_POLICY_FAILURE,

    //update Wallet Usage policy 
    UPDATE_WALLET_USAGE_POLICY,
    UPDATE_WALLET_USAGE_POLICY_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_FAILURE,

    //get wallet type 
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,
    GET_WALLET_TYPE,

    //clear Wallet Usage policy response
    CLEAR_WALLET_POLICY,

    //for the clear data on logout
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    //Wallet Usage policy list
    Loading: false,
    walletUsagePolicyData: null,

    //update Wallet Usage policy status delete
    isUpdateStatus: false,
    updateStatus: null,

    //Add Wallet Usage policy 
    isAddWalletPolicy: false,
    addWalletUsagePolicyData: null,

    //update Wallet Usage policy 
    isUpdateWalletPolicy: false,
    updateWalletUsagePolicyData: null,

    //get wallet type
    isWalletType: false,
    walletType: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // Handle Get Wallet Usage Policy List data
        case GET_WALLET_USAGE_POLICY:
            return Object.assign({}, state, { Loading: true, walletUsagePolicyData: null, })
        // Set Wallet Usage Policy List success data
        case GET_WALLET_USAGE_POLICY_SUCCESS:
            return Object.assign({}, state, { Loading: false, walletUsagePolicyData: action.payload, })
        // Set Wallet Usage Policy List Failure data
        case GET_WALLET_USAGE_POLICY_FAILURE:
            return Object.assign({}, state, { Loading: false, walletUsagePolicyData: action.payload })

        //handle get Delete Wallet Usage Policy Method
        case UPDATE_WALLET_USAGE_POLICY_STATUS:
            return Object.assign({}, state, { isUpdateStatus: true, updateStatus: null })
        //handle set Delete Wallet Usage Policy Success Method
        case UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS:
            return Object.assign({}, state, { isUpdateStatus: false, updateStatus: action.payload })
        //handle set Delete Wallet Usage Policy failure Method
        case UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE:
            return Object.assign({}, state, { isUpdateStatus: false, updateStatus: action.payload })

        //handle get add Wallet Usage Policy Method
        case ADD_WALLET_USAGE_POLICY:
            return Object.assign({}, state, { isAddWalletPolicy: true, addWalletUsagePolicyData: null })
        //handle set add Wallet Usage Policy Success Method
        case ADD_WALLET_USAGE_POLICY_SUCCESS:
            return Object.assign({}, state, { isAddWalletPolicy: false, addWalletUsagePolicyData: action.payload })
        //handle set add Wallet Usage Policy failure Method
        case ADD_WALLET_USAGE_POLICY_FAILURE:
            return Object.assign({}, state, { isAddWalletPolicy: false, addWalletUsagePolicyData: action.payload })

        //handle get update Wallet Usage Policy Method
        case UPDATE_WALLET_USAGE_POLICY:
            return Object.assign({}, state, { isUpdateWalletPolicy: true, updateWalletUsagePolicyData: null })
        //handle set update Wallet Usage Policy Success Method
        case UPDATE_WALLET_USAGE_POLICY_SUCCESS:
            return Object.assign({}, state, { isUpdateWalletPolicy: false, updateWalletUsagePolicyData: action.payload })
        //handle set update Wallet Usage Policy failure Method
        case UPDATE_WALLET_USAGE_POLICY_FAILURE:
            return Object.assign({}, state, { isUpdateWalletPolicy: false, updateWalletUsagePolicyData: action.payload })

        //handle get wallet type Method
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { isWalletType: true, walletType: null })
        //handle set wallet type Success Method
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { isWalletType: false, walletType: action.payload })
        //handle set wallet type failure Method
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { isWalletType: false, walletType: action.payload })

        //clear Wallet Usage policy response
        case CLEAR_WALLET_POLICY:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
