/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Activity List Reducers
 */
import {
    ACTIVITY_LIST,
    ACTIVITY_LIST_SUCCESS,
    ACTIVITY_LIST_FAILURE
} from 'Actions/types';

/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    list: []
}

//Check Action for Activity List...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {
        case ACTIVITY_LIST:
            return { ...state, loading: true };

        case ACTIVITY_LIST_SUCCESS:
            return { ...state, loading: false, list: action.payload };

        case ACTIVITY_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return { ...state };
    }
}