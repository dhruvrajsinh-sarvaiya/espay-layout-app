/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * SignIn Mobile With OTP Reducers
 */
import {
    
    //SignIn With Mobile
    SIGNIN_WITH_MOBILE,
    SIGNIN_WITH_MOBILE_SUCCESS,
    SIGNIN_WITH_MOBILE_FAILURE,

    //Resend OTP to Mobile
    SIGNIN_MOBILE_RESEND_OTP,
    SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
    SIGNIN_MOBILE_RESEND_OTP_FAILURE,

    //Verify OTP Mobile
    SIGNIN_MOBILE_VERIFY_OTP,
    SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
    SIGNIN_MOBILE_VERIFY_OTP_FAILURE,

 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    redirect : false,
    generate_token : false
}

//Check Action for SignIn Mobile With OTP...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch(action.type) 
    {
        //SignIn With Mobile
        case SIGNIN_WITH_MOBILE:
            return { ...state, loading : true, data : '', generate_token : false };

        case SIGNIN_WITH_MOBILE_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNIN_WITH_MOBILE_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Resend OTP to Mobile
        case SIGNIN_MOBILE_RESEND_OTP:
            return { ...state, loading : true, data : '', generate_token : false };

        case SIGNIN_MOBILE_RESEND_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNIN_MOBILE_RESEND_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Verify OTP Mobile
        case SIGNIN_MOBILE_VERIFY_OTP:
            return { ...state, loading : true, data : '', generate_token : false };

        case SIGNIN_MOBILE_VERIFY_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload, generate_token:true };

        case SIGNIN_MOBILE_VERIFY_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}