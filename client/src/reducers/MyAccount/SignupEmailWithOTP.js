/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup Email With OTP Reducers
 */
import {
    
    //Signup With Email
    SIGNUP_WITH_EMAIL,
    SIGNUP_WITH_EMAIL_SUCCESS,
    SIGNUP_WITH_EMAIL_FAILURE,

    //Resend OTP to Email
    SIGNUP_EMAIL_RESEND_OTP,
    SIGNUP_EMAIL_RESEND_OTP_SUCCESS,
    SIGNUP_EMAIL_RESEND_OTP_FAILURE,

    //Verify OTP Email
    SIGNUP_EMAIL_VERIFY_OTP,
    SIGNUP_EMAIL_VERIFY_OTP_SUCCESS,
    SIGNUP_EMAIL_VERIFY_OTP_FAILURE,

 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    redirect : false
}

//Check Action for Signup Email With OTP...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        //Signup With Email
        case SIGNUP_WITH_EMAIL:
            return { ...state, loading : true, data : '' };

        case SIGNUP_WITH_EMAIL_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNUP_WITH_EMAIL_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Resend OTP to Email
        case SIGNUP_EMAIL_RESEND_OTP:
            return { ...state, loading : true, data : '', redirect : false };

        case SIGNUP_EMAIL_RESEND_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNUP_EMAIL_RESEND_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Verify OTP Email
        case SIGNUP_EMAIL_VERIFY_OTP:
            return { ...state, loading : true, data : '', redirect : false };

        case SIGNUP_EMAIL_VERIFY_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload, redirect:true };

        case SIGNUP_EMAIL_VERIFY_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}