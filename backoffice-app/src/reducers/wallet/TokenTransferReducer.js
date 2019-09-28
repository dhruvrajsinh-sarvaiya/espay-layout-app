import {
    //TokenTransfer
    GET_TOKEN_TRANSFER,
    GET_TOKEN_TRANSFER_SUCCESS,
    GET_TOKEN_TRANSFER_FAILURE,

    //token transfer list
    GET_TOKEN_TRANSFER_LIST,
    GET_TOKEN_TRANSFER_LIST_SUCCESS,
    GET_TOKEN_TRANSFER_LIST_FAILURE,

    //get wallet type 
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,
    GET_WALLET_TYPE,

    // Clear User Wallets Data
    CLEAR_TOKEN_TRANSFER_DATA,
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Initial State for User Wallets
const INITIAL_STATE = {
    //TokenTransfer List data
    Loading: false,
    tokenTransferData: null,

    //TokenTransfer add data
    addLoading: false,
    addData: null,

    //get wallet type
    isWalletType: false,
    walletType: null,
}

export default function TokenTransferReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // To reset initial state on logout
        case CLEAR_TOKEN_TRANSFER_DATA:
            return INITIAL_STATE;

        // Handle TokenTransfer List method data
        case GET_TOKEN_TRANSFER_LIST:
            return Object.assign({}, state, { Loading: true, tokenTransferData: null, })
        // Set TokenTransfer List success data
        case GET_TOKEN_TRANSFER_LIST_SUCCESS:
            return Object.assign({}, state, { Loading: false, tokenTransferData: action.payload, })
        // Set TokenTransfer List failure data
        case GET_TOKEN_TRANSFER_LIST_FAILURE:
            return Object.assign({}, state, { Loading: false, tokenTransferData: action.payload, })

        // Handle TokenTransfer add method data
        case GET_TOKEN_TRANSFER:
            return Object.assign({}, state, { addLoading: true, addData: null })
        // Set TokenTransfer add success data
        case GET_TOKEN_TRANSFER_SUCCESS:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })
        // Set TokenTransfer  add failure data
        case GET_TOKEN_TRANSFER_FAILURE:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })

        //handle get wallet type Method
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { isWalletType: true, walletType: null })
        //handle set wallet type Success Method
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { isWalletType: false, walletType: action.payload })
        //handle set wallet type failure Method
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { isWalletType: false, walletType: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}