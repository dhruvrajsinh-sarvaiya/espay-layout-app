/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Referral Latest Commission History Reducers
 */
import {
    REFERRAL_LATEST_COMMISSION_HISTORY_LIST, 
    REFERRAL_LATEST_COMMISSION_HISTORY_SUCCESS, 
    REFERRAL_LATEST_COMMISSION_HISTORY_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    list : []
}

//Check Action for Referral Latest Commission History...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case REFERRAL_LATEST_COMMISSION_HISTORY_LIST:
            return { ...state, loading : true };

        case REFERRAL_LATEST_COMMISSION_HISTORY_SUCCESS:
            return { ...state, loading : true, list : action.payload };

        case REFERRAL_LATEST_COMMISSION_HISTORY_FAILURE:
            return { ...state, loading : false, error : action.payload };

        default : 
            return { ...state };
    }
}