/**
 * Auther : Salim Deraiya
 * Created : 29/12/2018
 * Activity History List Reducers
 */
import {
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    GET_MODULE_TYPE,
    GET_MODULE_TYPE_SUCCESS,
    GET_MODULE_TYPE_FAILURE,

    ACTIVITY_HISTORY_LIST,
    ACTIVITY_HISTORY_LIST_SUCCESS,
    ACTIVITY_HISTORY_LIST_FAILURE
} from 'Actions/types';


/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    list: [],
    getModule: [],
    getUser: [],
}

//Check Action for Activity History List...
export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case ACTIVITY_HISTORY_LIST:
            return { ...state, loading: true, list: '' };

        case ACTIVITY_HISTORY_LIST_SUCCESS:
            return { ...state, loading: false, list: action.payload };

        case ACTIVITY_HISTORY_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_MODULE_TYPE:
            return { ...state, loading: true, getModule: '' };

        case GET_MODULE_TYPE_SUCCESS:
            return { ...state, loading: false, getModule: action.payload };

        case GET_MODULE_TYPE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_USER_DATA:
            return { ...state, loading: true, getUser: '' };

        case GET_USER_DATA_SUCCESS:
            return { ...state, loading: false, getUser: action.payload };

        case GET_USER_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return { ...state };
    }
}