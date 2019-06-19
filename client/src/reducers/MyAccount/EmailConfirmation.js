/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Email Confirmation Reducers
 */

import {
    EMAIL_CONFIRMATION,
    EMAIL_CONFIRMATION_SUCCESS,
    EMAIL_CONFIRMATION_FAILURE
} from 'Actions/types';

/**
 * initial Email Confirmation
 */
const INIT_STATE = {
    data: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) 
    {
        case EMAIL_CONFIRMATION:
            return { ...state, loading: true, data: '' };

        case EMAIL_CONFIRMATION_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EMAIL_CONFIRMATION_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}