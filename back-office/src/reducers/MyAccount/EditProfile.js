/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * User Profile Details Reducers
 */

import {
    //Edit Profile
    EDIT_PROFILE,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,

    //Get Profile By ID
    GET_PROFILE_BY_ID,
    GET_PROFILE_BY_ID_SUCCESS,
    GET_PROFILE_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * initial Device Management
 */
const INITIAL_STATE = {
    data: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //Edit Profile
        case EDIT_PROFILE:
        case GET_PROFILE_BY_ID:
            return { ...state, loading: true, data: '' };

        case EDIT_PROFILE_SUCCESS:
        case EDIT_PROFILE_FAILURE:
        //Get Profile By ID
        case GET_PROFILE_BY_ID_SUCCESS:
        case GET_PROFILE_BY_ID_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}
