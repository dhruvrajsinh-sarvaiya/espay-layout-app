/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup Mobile With OTP Reducers
 */
import {
    
    //Signup With Mobile
    SIGNUP_WITH_MOBILE,
    SIGNUP_WITH_MOBILE_SUCCESS,
    SIGNUP_WITH_MOBILE_FAILURE,

    //Resend OTP to Mobile
    SIGNUP_MOBILE_RESEND_OTP,
    SIGNUP_MOBILE_RESEND_OTP_SUCCESS,
    SIGNUP_MOBILE_RESEND_OTP_FAILURE,

    //Verify OTP Mobile
    SIGNUP_MOBILE_VERIFY_OTP,
    SIGNUP_MOBILE_VERIFY_OTP_SUCCESS,
    SIGNUP_MOBILE_VERIFY_OTP_FAILURE,

 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    redirect : false
}

//Check Action for Signup Mobile With OTP...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        //Signup With Mobile
        case SIGNUP_WITH_MOBILE:
            return { ...state, loading : true, data : '' };

        case SIGNUP_WITH_MOBILE_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNUP_WITH_MOBILE_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Resend OTP to Mobile
        case SIGNUP_MOBILE_RESEND_OTP:
            return { ...state, loading : true, data : '', redirect : false };

        case SIGNUP_MOBILE_RESEND_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNUP_MOBILE_RESEND_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Verify OTP Mobile
        case SIGNUP_MOBILE_VERIFY_OTP:
            return { ...state, loading : true, data : '', redirect : false };

        case SIGNUP_MOBILE_VERIFY_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload, redirect : true  };

        case SIGNUP_MOBILE_VERIFY_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}