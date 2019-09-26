import {
    //wallettypes List 
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTER_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    //wallettypes delete 
    DELETE_WALLET_TYPE_MASTER,
    DELETE_WALLET_TYPE_MASTER_SUCCESS,
    DELETE_WALLET_TYPE_MASTER_FAILURE,

    //wallettypes add 
    ADD_WALLET_TYPE_MASTER,
    ADD_WALLET_TYPE_MASTER_SUCCESS,
    ADD_WALLET_TYPE_MASTER_FAILURE,

    //wallettypes update 
    UPDATE_WALLET_TYPE_MASTER,
    UPDATE_WALLET_TYPE_MASTER_SUCCESS,
    UPDATE_WALLET_TYPE_MASTER_FAILURE,

    //get currency list
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,

    // Clear User Wallets Data
    CLEAR_WALLET_TYPE_MASTER_DATA,
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Initial State for User Wallets
const INITIAL_STATE = {

    //for currency
    pairCurrencyLoading: false,
    pairCurrencyList: null,

    //wallettypes List data
    Loading: false,
    wallettypesData: null,

    //wallettypes delete data
    deleteLoading: false,
    deleteData: null,

    //wallettypes add data
    addLoading: false,
    addData: null,

    //wallettypes edit data
    editLoading: false,
    editData: null,
}

export default function WalletTypesReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // To reset initial state on logout
        case CLEAR_WALLET_TYPE_MASTER_DATA:
            return INITIAL_STATE;

        //get currency 
        case GET_CURRENCY_LIST:
            return Object.assign({}, state, { pairCurrencyList: null, pairCurrencyLoading: true })
        case GET_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, { pairCurrencyList: action.payload, pairCurrencyLoading: false })
        case GET_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, { pairCurrencyList: action.payload, pairCurrencyLoading: false })

        // Handle Wallet types List method data
        case GET_WALLET_TYPE_MASTER:
            return Object.assign({}, state, { Loading: true, wallettypesData: null, })
        // Set Wallet types List success data
        case GET_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, { Loading: false, wallettypesData: action.payload, })
        // Set Wallet types List failure data
        case GET_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, { Loading: false, wallettypesData: action.payload, })

        // Handle Wallet types delete method data
        case DELETE_WALLET_TYPE_MASTER:
            return Object.assign({}, state, { deleteLoading: true, deleteData: null })
        // Set Wallet types delete success data
        case DELETE_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, { deleteLoading: false, deleteData: action.payload })
        // Set Wallet types delete failure data
        case DELETE_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, { deleteLoading: false, deleteData: action.payload })

        // Handle Wallet types add method data
        case ADD_WALLET_TYPE_MASTER:
            return Object.assign({}, state, { addLoading: true, addData: null })
        // Set Wallet types add success data
        case ADD_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })
        // Set Wallet types add failure data
        case ADD_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })

        // Handle Wallet types edit method data
        case UPDATE_WALLET_TYPE_MASTER:
            return Object.assign({}, state, { editLoading: true, editData: null })
        // Set Wallet types edit success data
        case UPDATE_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, { editLoading: false, editData: action.payload })
        // Set Wallet types edit failure data
        case UPDATE_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, { editLoading: false, editData: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}