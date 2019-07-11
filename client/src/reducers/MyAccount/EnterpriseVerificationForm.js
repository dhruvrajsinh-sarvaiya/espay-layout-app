/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Enterprise Verification Form Reducers
 */
import {
    ENTERPRISE_VERIFICATION,
    ENTERPRISE_VERIFICATION_SUCCESS,
    ENTERPRISE_VERIFICATION_FAILURE
} from 'Actions/types';

/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    data: []
}

//Check Action for Enterprise Verification Form...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {

        case ENTERPRISE_VERIFICATION:
            return { ...state, loading: true, data: '' };

        case ENTERPRISE_VERIFICATION_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ENTERPRISE_VERIFICATION_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}