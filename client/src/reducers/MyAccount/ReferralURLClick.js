/**
 * Create By Sanjay 
 * Created Date 06/03/2019
 * Reducer For Referral URL Click By User
 */

import {
    REFERRAL_URL_CLICK,
    REFERRAL_URL_CLICK_SUCCESS,
    REFERRAL_URL_CLICK_FAILURE
} from 'Actions/types';

const INIT_STATE = {
    loading: true,
    referralCodeFromURL: {}
}

export default (state,action) => {
	if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case REFERRAL_URL_CLICK:
            return { ...state, loading: true };

        case REFERRAL_URL_CLICK_SUCCESS:
            return { ...state, loading: false, referralCodeFromURL: action.payload };

        case REFERRAL_URL_CLICK_FAILURE:
            return { ...state, loading: false, referralCodeFromURL: action.payload };        

        default:
            return { ...state };
    }
}