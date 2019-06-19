/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Referral Friends Reducers
 */
import {
    REFERRAL_FRIENDS_LIST,
    REFERRAL_FRIENDS_SUCCESS,
    REFERRAL_FRIENDS_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : true,
    list : []
}

//Check Action for Referral Friends...
export default (state = INIT_STATE, action) => {
    //console.log('Reducers:',action.type);

    switch(action.type) 
    {
        case REFERRAL_FRIENDS_LIST:
            return { ...state, loading : true };

        case REFERRAL_FRIENDS_SUCCESS:
            return { ...state, loading : false, list : action.payload };

        case REFERRAL_FRIENDS_FAILURE:
            return { ...state, loading : false, error : action.payload };

        default : 
            return { ...state };
    }
}