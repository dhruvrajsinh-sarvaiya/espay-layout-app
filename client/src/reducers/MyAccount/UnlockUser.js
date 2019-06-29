/**
 * Auther : Salim Deraiya
 * Created : 01/11/2018
 * Unlock User Reducers
 */
import {
    UNLOCK_USER,
    UNLOCK_USER_SUCCESS,
    UNLOCK_USER_FAILURE
} from 'Actions/types';

/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    data: []
}

//Check Action for Social Login...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {

        case UNLOCK_USER:
            return { ...state, loading: true, data: '' };

        case UNLOCK_USER_SUCCESS:
            return { ...state, loading: true, data: action.payload };

        case UNLOCK_USER_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}