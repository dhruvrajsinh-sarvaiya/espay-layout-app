/**
 * Author : Salim Deraiya
 * Created : 04/03/2019
 * Affiliate Configuration
*/

import {

    //For Save Affilaite Setup Configuration
    SAVE_AFFILIATE_SETUP_CONFIGURATION,
    SAVE_AFFILIATE_SETUP_CONFIGURATION_SUCCESS,
    SAVE_AFFILIATE_SETUP_CONFIGURATION_FAILURE,

    //For Get Affilaite Setup Configuration
    GET_AFFILIATE_SETUP_CONFIGURATION,
    GET_AFFILIATE_SETUP_CONFIGURATION_SUCCESS,
    GET_AFFILIATE_SETUP_CONFIGURATION_FAILURE,

    //For Save Affiliate Commission Pattern
    SAVE_AFFILIATE_COMMISSION_PATTERN,
    SAVE_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    SAVE_AFFILIATE_COMMISSION_PATTERN_FAILURE,

    //For Get Affiliate Commission Pattern
    GET_AFFILIATE_COMMISSION_PATTERN,
    GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    GET_AFFILIATE_COMMISSION_PATTERN_FAILURE

} from "Actions/types";

const INIT_STATE = {
    setupConfig: [],
    commissionPattern: [],
    data : [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
      }
    switch (action.type) {
        //For Save Affilaite Setup Configuration
        case SAVE_AFFILIATE_SETUP_CONFIGURATION:
            return { ...state, loading: true, data: [], setupConfig : '' };

        case SAVE_AFFILIATE_SETUP_CONFIGURATION_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case SAVE_AFFILIATE_SETUP_CONFIGURATION_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //For Get Affilaite Setup Configuration
        case GET_AFFILIATE_SETUP_CONFIGURATION:
            return { ...state, loading: true, setupConfig: [] };

        case GET_AFFILIATE_SETUP_CONFIGURATION_SUCCESS:
            return { ...state, loading: false, setupConfig: action.payload };

        case GET_AFFILIATE_SETUP_CONFIGURATION_FAILURE:
            return { ...state, loading: false, setupConfig: action.payload };

        //For Save Affiliate Commission Pattern
        case SAVE_AFFILIATE_COMMISSION_PATTERN:
            return { ...state, loading: true, data: [], commissionPattern : '' };

        case SAVE_AFFILIATE_COMMISSION_PATTERN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case SAVE_AFFILIATE_COMMISSION_PATTERN_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //For Get Affiliate Commission Pattern
        case GET_AFFILIATE_COMMISSION_PATTERN:
            return { ...state, loading: true, commissionPattern: [] };

        case GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS:
            return { ...state, loading: false, commissionPattern: action.payload };

        case GET_AFFILIATE_COMMISSION_PATTERN_FAILURE:
            return { ...state, loading: false, commissionPattern: action.payload };

        default:
            return { ...state };
    }
};