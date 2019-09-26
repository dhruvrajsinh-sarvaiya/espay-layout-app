import {
    //trntype role wise List
    GET_TRNTYPE_ROLEWISE,
    GET_TRNTYPE_ROLEWISE_SUCCESS,
    GET_TRNTYPE_ROLEWISE_FAILURE,

    //trntype role wise update status
    UPDATE_TRNTYPE_ROLEWISE_STATUS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE,

    //trntype role wise add 
    ADD_TRNTYPE_ROLEWISE,
    ADD_TRNTYPE_ROLEWISE_SUCCESS,
    ADD_TRNTYPE_ROLEWISE_FAILURE,

    //get trasancation type 
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    //get roles
    GET_ROLE_DETAILS,
    GET_ROLE_DETAILS_SUCCESS,
    GET_ROLE_DETAILS_FAILURE,

    //clear data
    CLEAR_TRNTYPE_ROLEWISE_DATA,

    //clear data on logout
    ACTION_LOGOUT,

} from "../../actions/ActionTypes";

// initial state
const INITIAL_STATE = {

    //trntype role wise List
    roleTrnListData: null,
    loading: false,

    //trntype role wise update status
    updateStatus: null,
    updateStatusFetching: false,

    //trntype role wise add 
    addRoleWiseData: null,
    addFetching: false,

    //roles 
    isRoleFetching: false,
    roleDetails: null,

    //wallettypes
    isWalletTransactionType: false,
    walletTransactionType: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        //clear ledger response
        case CLEAR_TRNTYPE_ROLEWISE_DATA:
            { return INITIAL_STATE; }

        // Handle Get Trn Type Role Wise
        case GET_TRNTYPE_ROLEWISE:
            return Object.assign({}, state, { roleTrnListData: null, loading: true, })
        // Handle Get Trn Type Role Wise success
        case GET_TRNTYPE_ROLEWISE_SUCCESS:
            return Object.assign({}, state, { roleTrnListData: action.payload, loading: false, })
        // Handle Get Trn Type Role Wise failuire
        case GET_TRNTYPE_ROLEWISE_FAILURE:
            return Object.assign({}, state, { roleTrnListData: action.payload, loading: false, })

        //Handle Update Trn Type Role Wise Status
        case UPDATE_TRNTYPE_ROLEWISE_STATUS:
            return Object.assign({}, state, { updateStatusFetching: true, updateStatus: null, })
        //Handle Update Trn Type Role Wise Status success
        case UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS:
            return Object.assign({}, state, { updateStatusFetching: false, updateStatus: action.payload })
        //Handle Update Trn Type Role Wise Status failure
        case UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE:
            return Object.assign({}, state, { updateStatusFetching: false, updateStatus: action.payload })

        //Handle add Trn Type Role Wise 
        case ADD_TRNTYPE_ROLEWISE:
            return Object.assign({}, state, { addFetching: true, addRoleWiseData: null })
        //Handle add Trn Type Role Wise success
        case ADD_TRNTYPE_ROLEWISE_SUCCESS:
            return Object.assign({}, state, { addFetching: false, addRoleWiseData: action.payload })
        //Handle add Trn Type Role Wise failure
        case ADD_TRNTYPE_ROLEWISE_FAILURE:
            return Object.assign({}, state, { addFetching: false, addRoleWiseData: action.payload })

        //handle get roles Method 
        case GET_ROLE_DETAILS:
            return Object.assign({}, state, { isRoleFetching: true, roleDetails: null })
        //handle set roles Success Method
        case GET_ROLE_DETAILS_SUCCESS:
            return Object.assign({}, state, { isRoleFetching: false, roleDetails: action.payload })
        //handle set roles failure Method
        case GET_ROLE_DETAILS_FAILURE:
            return Object.assign({}, state, { isRoleFetching: false, roleDetails: action.payload })

        //handle get wallet type Method
        case GET_WALLET_TRANSACTION_TYPE:
            return Object.assign({}, state, { isWalletTransactionType: true, walletTransactionType: null })
        //handle set wallet type Success Method
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return Object.assign({}, state, { isWalletTransactionType: false, walletTransactionType: action.payload })
        //handle set wallet type failure Method
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, { isWalletTransactionType: false, walletTransactionType: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
