/**
 * Auther : Salim Deraiya
 * Created : 26/09/2018
 * Social Login Reducers
 */
import {
    SOCIAL_LOGIN, 
    SOCIAL_LOGIN_SUCCESS, 
    SOCIAL_LOGIN_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    error : ''
}

//Check Action for Social Login...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case SOCIAL_LOGIN:
            return { ...state, loading : true };

        case SOCIAL_LOGIN_SUCCESS:
            return { ...state, loading : true, data : action.payload };

        case SOCIAL_LOGIN_FAILURE:
            return { ...state, loading : false, error : action.payload };

        default : 
            return { ...state };
    }
}