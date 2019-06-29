/* 
    Developer : Nishant Vadgama
    Date : 25-09-2018
    File Comment : Limits controll reducer file
*/

import {
    // get wallet list
    GET_LC_WALLETS,
    GET_LC_WALLETS_SUCCESS,
    GET_LC_WALLETS_FAILURE,
    // get limit config
    GET_LIMITINFO,
    GET_LIMITINFO_SUCCES,
    GET_LIMITINFO_FAILURE,
    // set limit config
    POST_LIMITINFO,
    POST_LIMITINFO_SUCCESS,
    POST_LIMITINFO_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    wallets: [],
    limitInfo: {},
    showLoading: false,
    response: {}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // get wallets
        case GET_LC_WALLETS:
            return { ...state, loading: true, response: {}, limitInfo: {} };
        case GET_LC_WALLETS_SUCCESS:
            return { ...state, loading: false, wallets: action.payload.Wallets, response: {} };
        case GET_LC_WALLETS_FAILURE:
            return { ...state, loading: false, response: {} };
        //get limit config
        case GET_LIMITINFO:
            return { ...state, showLoading: true, limitInfo: {}, response: {} };
        case GET_LIMITINFO_SUCCES:
            return {
                ...state,
                showLoading: false,
                limitInfo: action.payload,
                response: {}
            };
        case GET_LIMITINFO_FAILURE:
            return { ...state, showLoading: false, response: {}, limitInfo: {} };
        //set limit config
        case POST_LIMITINFO:
            return { ...state, showLoading: true, response: {} };
        case POST_LIMITINFO_SUCCESS:
            return { ...state, showLoading: false, response: action.payload };
        case POST_LIMITINFO_FAILURE:
            return { ...state, showLoading: false, reponse: {} };

        default:
            return { ...state };
    }
};
