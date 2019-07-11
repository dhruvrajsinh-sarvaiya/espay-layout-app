/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing reducer 
*/
import {
    //list all wallets
    LISTALLWALLETS,
    LISTALLWALLETS_SUCCESS,
    LISTALLWALLETS_FAILURE,
    //list wallet users...
    LISTWALLETUSERS,
    LISTWALLETUSERS_SUCCESS,
    LISTWALLETUSERS_FAILURE,
    //add wallet user...
    ADDWALLETUSER,
    ADDWALLETUSER_SUCCESS,
    ADDWALLETUSER_FAILURE,
    //list wallet requests...
    LISTWALLETREQUEST,
    LISTWALLETREQUEST_SUCCESS,
    LISTWALLETREQUEST_FAILURE,
    //accept reject wallet request...
    ACCEPTREJECTWALLETREQUEST,
    ACCEPTREJECTWALLETREQUEST_SUCCESS,
    ACCEPTREJECTWALLETREQUEST_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    walletList: [],
    walletRequests: [],
    walletUserList: [],
    addUserResponse: {},
    walletRequestResponse: {}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {
        //list all wallets...
        case LISTALLWALLETS:
            return { ...state, loading: true, walletList: [] }
        case LISTALLWALLETS_SUCCESS:
            return { ...state, loading: false, walletList: action.payload }
        case LISTALLWALLETS_FAILURE:
            return { ...state, loading: false, walletList: [] }
        //list wallet users...
        case LISTWALLETUSERS:
            return { ...state, loading: true, walletUserList: [] }
        case LISTWALLETUSERS_SUCCESS:
            return { ...state, loading: false, walletUserList: action.payload }
        case LISTWALLETUSERS_FAILURE:
            return { ...state, loading: false, walletUserList: [] }
        //add wallet user...
        case ADDWALLETUSER:
            return { ...state, loading: true, addUserResponse: {} }
        case ADDWALLETUSER_SUCCESS:
            return { ...state, loading: false, addUserResponse: action.payload }
        case ADDWALLETUSER_FAILURE:
            return { ...state, loading: false, addUserResponse: action.payload }
        //list wallet requests...
        case LISTWALLETREQUEST:
            return { ...state, loading: true, walletRequests: [], walletRequestResponse: {} }
        case LISTWALLETREQUEST_SUCCESS:
            return { ...state, loading: false, walletRequests: action.payload.Data, walletRequestResponse: {} }
        case LISTWALLETREQUEST_FAILURE:
            return { ...state, loading: false, walletRequests: [], walletRequestResponse: {} }
        //accept reject wallet request...
        case ACCEPTREJECTWALLETREQUEST:
            return { ...state, loading: true, walletRequestResponse: {} }
        case ACCEPTREJECTWALLETREQUEST_SUCCESS:
            return { ...state, loading: false, walletRequestResponse: action.payload }
        case ACCEPTREJECTWALLETREQUEST_FAILURE:
            return { ...state, loading: false, walletRequestResponse: action.payload }
        default:
            return { ...state };
    }
};
