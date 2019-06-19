/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Forgot Password Reducers
 */
import {
    FORGOT_PASSWORD, 
    FORGOT_PASSWORD_SUCCESS, 
    FORGOT_PASSWORD_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    error : ''
}

//Check Action for Forgot Password...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case FORGOT_PASSWORD:
            return { ...state, loading : true, error : '', data : '' };

        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case FORGOT_PASSWORD_FAILURE:
        return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}