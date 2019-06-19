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
export default (state = INIT_STATE, action) => {

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