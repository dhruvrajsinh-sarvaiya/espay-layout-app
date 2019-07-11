/**
 * Author : Saloni Rathod
 * Created : 12/03/2019
 * User Confirmation Reducers
 */

import {
    USER_CONFIRMATION,
    USER_CONFIRMATION_SUCCESS,
    USER_CONFIRMATION_FAILURE
} from 'Actions/types';

/**
 * initial USER Confirmation
 */
const INIT_STATE = {
    data: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {
        case USER_CONFIRMATION:
            return { ...state, loading: true, data: '' };

        case USER_CONFIRMATION_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case USER_CONFIRMATION_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}