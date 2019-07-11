/**
 * Create By : Sanjay 
 * Created Date: 31/01/2019
 * Forgot Pass Reducers
 */
import {
    FORGOT_PASSWORD_SCREEN,
    FORGOT_PASSWORD_SCREEN_SUCCESS,
    FORGOT_PASSWORD_SCREEN_FAILURE
 } from 'Actions/types';

const INIT_STATE = {
    loading : false,
    data : [],
    error : ''
}

//Check Action for Forgot Password...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }

    switch(action.type) 
    {
        case FORGOT_PASSWORD_SCREEN:
            return { ...state, loading : true, error : '', data : '' };

        case FORGOT_PASSWORD_SCREEN_SUCCESS:
        case FORGOT_PASSWORD_SCREEN_FAILURE:
            return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}