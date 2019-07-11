/* 
    Developer : Nishant Vadgama
    Date : 01-10-2018
    File Comment : Decentralize Address Generation Reducer 
*/

import {
    GET_CURRENCY,
    GET_CURRENCY_SUCCESS,
    GET_CURRENCY_FAILURE,
    DECENT_ADDRESS_GENERATION,
    DECENT_ADDRESS_GEN_SUCCESS,
    DECENT_ADDRESS_GEN_FAILURE
} from 'Actions/types';

const INIT_STATE = {
    currencies: [],
    showLoading: false
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        case GET_CURRENCY:
            return { ...state, showLoading: true };

        case GET_CURRENCY_SUCCESS:
            return { ...state, showLoading: false, currencies: action.payload };

        case GET_CURRENCY_FAILURE:
            return { ...state, showLoading: false };

        case DECENT_ADDRESS_GENERATION:
            return { ...state, showLoading: true };

        case DECENT_ADDRESS_GEN_SUCCESS:
            return { ...state, showLoading: false, reponse: action.payload };

        case DECENT_ADDRESS_GEN_FAILURE:
            return { ...state, showLoading: false };

        default:
            return { ...state };
    }
};