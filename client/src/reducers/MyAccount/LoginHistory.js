/**
 * Login History Reducers (code added by Parth Jani 14-9-2018)
 */
import {
    LOGIN_HISTORY_LIST,
    LOGIN_HISTORY_LIST_SUCCESS,
    LOGIN_HISTORY_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial Login History
 */
const INIT_STATE = {
    data: [],
    loading: true
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {

        case LOGIN_HISTORY_LIST:
            return { ...state, loading: true, data: '' };

        case LOGIN_HISTORY_LIST_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case LOGIN_HISTORY_LIST_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}
