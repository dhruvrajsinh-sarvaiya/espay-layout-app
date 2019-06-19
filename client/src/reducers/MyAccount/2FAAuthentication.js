/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * 2FA Authentication Reducers
 * Google / SMS Authentication
 */
 import {
    TWO_FA_GOOGLE_AUTHENTICATION, 
    TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS, 
    TWO_FA_GOOGLE_AUTHENTICATION_FAILURE, 
    TWO_FA_SMS_AUTHENTICATION,
    TWO_FA_SMS_AUTHENTICATION_SUCCESS,
    TWO_FA_SMS_AUTHENTICATION_FAILURE,
    SEND_SMS,
    SEND_SMS_SUCCESS,
    SEND_SMS_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : []
}

//Check Action for 2FA Authentication...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case TWO_FA_GOOGLE_AUTHENTICATION:
            return { ...state, loading : true, data : '' };

        case TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case TWO_FA_GOOGLE_AUTHENTICATION_FAILURE:
            return { ...state, loading : false, data : action.payload };

        case TWO_FA_SMS_AUTHENTICATION:
            return { ...state, loading : true };

        case TWO_FA_SMS_AUTHENTICATION_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case TWO_FA_SMS_AUTHENTICATION_FAILURE:
            return { ...state, loading : false, error : action.payload };        

        case SEND_SMS:
            return { ...state, loading : true };

        case SEND_SMS_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SEND_SMS_FAILURE:
            return { ...state, loading : false, error : action.payload };

        default : 
            return { ...state };
    }
}