/**
 * Auther : Salim Deraiya
 * Created : 24/12/2018
 * Social Trading Policy Reducers
 */

import {
    GET_SOCIAL_TRADING_POLICY,
    GET_SOCIAL_TRADING_POLICY_SUCCESS,
    GET_SOCIAL_TRADING_POLICY_FAILURE
} from 'Actions/types';

/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    socialTradePolicyData: [],
}

//Check Action for Complain...
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SOCIAL_TRADING_POLICY:
            return { ...state, loading: true, socialTradePolicyData : [] };

        case GET_SOCIAL_TRADING_POLICY_SUCCESS:
            return { ...state, loading: false, socialTradePolicyData: action.payload };

        case GET_SOCIAL_TRADING_POLICY_FAILURE:
            return { ...state, loading: false, socialTradePolicyData: action.payload };

        default:
            return { ...state };
    }
}