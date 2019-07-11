/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Normal Registration Reducers
 */
import {
    //Normal Registration
    NORMAL_REGISTER,
    NORMAL_REGISTER_SUCCESS,
    NORMAL_REGISTER_FAILURE,

    //Confirmation Link
    RESEND_CONFIRMATION_LINK,
    RESEND_CONFIRMATION_LINK_SUCCESS,
    RESEND_CONFIRMATION_LINK_FAILURE,
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    confirm_link : false
}

//Check Action for Normal Registration...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    
    switch(action.type) 
    {
        case NORMAL_REGISTER:
            return { ...state, loading : true, data : '' };

        case NORMAL_REGISTER_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case NORMAL_REGISTER_FAILURE:
            return { ...state, loading : false, data : action.payload };

        case RESEND_CONFIRMATION_LINK:
            return { ...state, loading : true, data : '', confirm_link : false };

        case RESEND_CONFIRMATION_LINK_SUCCESS:
            return { ...state, loading : false, data : action.payload, confirm_link : true };

        case RESEND_CONFIRMATION_LINK_FAILURE:
            return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}