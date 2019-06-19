/**
 * Create By : Sanjay 
 * Created Date: 31/01/2019
 * Forgot Confirmation Reducers
 */
import {
    FORGOT_CONFIRMATION,
    FORGOT_CONFIRMATION_SUCCESS,
    FORGOT_CONFIRMATION_FAILURE,

    SET_NEW_PASSWORD,
    SET_NEW_PASSWORD_SUCCESS,
    SET_NEW_PASSWORD_FAILURE
} from 'Actions/types';

const INIT_STATE = {
    loading: false,
    data: [],
    setPassData: {}
}

//Check Action for Forgot Confirmation...
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FORGOT_CONFIRMATION:
            return { ...state, loading: true, data: '' };

        case FORGOT_CONFIRMATION_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case FORGOT_CONFIRMATION_FAILURE:
            return { ...state, loading: false, data: action.payload };

        case SET_NEW_PASSWORD:
            return { ...state, loading: true, setPassData: {} };

        case SET_NEW_PASSWORD_SUCCESS:
            return { ...state, loading: false, setPassData: action.payload };

        case SET_NEW_PASSWORD_FAILURE:
            return { ...state, loading: false, setPassData: action.payload };

        default:
            return { ...state };
    }
}