/* 
    Developer : Nishant Vadgama,
    Date : 24-09-2018
    FIle Comment : convert token action methods
*/
import {
    GET_CTINFO,
    GET_CTINFO_SUCCESS,
    GET_CTINFO_FAILURE,
    SUBMIT_CTREQUEST,
    SUBMIT_CTREQUEST_SUCCESS,
    SUBMIT_CTREQUEST_FAILURE,
} from 'Actions/types';

const INIT_STATE = {
    showLoading: false,
    buyCurrency: [],
    fromCurrency: []
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case GET_CTINFO:
            return { ...state, showLoading: true }

        case GET_CTINFO_SUCCESS:
            return { ...state, showLoading: false, buyCurrency: action.payload.buyCurrency, fromCurrency: action.payload.fromCurrency }

        case GET_CTINFO_FAILURE:
            return { ...state, showLoading: false }

        case SUBMIT_CTREQUEST:
            return { ...state, showLoading: true }

        case SUBMIT_CTREQUEST_SUCCESS:
            return { ...state, showLoading: false, success: aciton.payload }

        case SUBMIT_CTREQUEST_FAILURE:
            return { ...state, showLoading: false }

        default:
            return { ...state }
    }
}