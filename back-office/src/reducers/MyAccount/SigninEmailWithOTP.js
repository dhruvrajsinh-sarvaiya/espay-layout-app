/**
 * Created By : Sanjay Rathod
 * Created Date : 31/01/2019 
 * SignIn Email With OTP Reducers
 */
import {
    
    //SignIn With Email
    SIGNIN_WITH_EMAIL,
    SIGNIN_WITH_EMAIL_SUCCESS,
    SIGNIN_WITH_EMAIL_FAILURE,

    //Resend OTP to Email
    SIGNIN_EMAIL_RESEND_OTP,
    SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
    SIGNIN_EMAIL_RESEND_OTP_FAILURE,

    //Verify OTP Email
    SIGNIN_EMAIL_VERIFY_OTP,
    SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
    SIGNIN_EMAIL_VERIFY_OTP_FAILURE

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

//Check Action for SignIn Email With OTP...
export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE 
    }
    switch(action.type) 
    {
        //SignIn With Email
        case SIGNIN_WITH_EMAIL:
            return { ...state, loading : true, data : '', generate_token : false };

        case SIGNIN_WITH_EMAIL_SUCCESS:
        case SIGNIN_WITH_EMAIL_FAILURE:
        case SIGNIN_EMAIL_RESEND_OTP_SUCCESS:
        case SIGNIN_EMAIL_RESEND_OTP_FAILURE:
        case SIGNIN_EMAIL_VERIFY_OTP_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Resend OTP to Email
        case SIGNIN_EMAIL_RESEND_OTP:
        case SIGNIN_EMAIL_VERIFY_OTP:
            return { ...state, loading : true, data : '', generate_token : false };

        case SIGNIN_EMAIL_VERIFY_OTP_SUCCESS:
            return { ...state, loading : false, data : action.payload, generate_token:true };


        default : 
            return { ...state };
    }
}