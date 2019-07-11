/* 
    Developer : Kevin Ladani
    Date : 20-12-2018
    File Comment : MyAccount Dashboard Actions
*/
import {
    // For Get Personal Information
    GET_PERSONAL_INFO,
    GET_PERSONAL_INFO_SUCCESS,
    GET_PERSONAL_INFO_FAILURE,

    // For Update Personal Information
    EDIT_PERSONAL_INFO,
    EDIT_PERSONAL_INFO_SUCCESS,
    EDIT_PERSONAL_INFO_FAILURE,

} from "Actions/types";

/**
 * initial data
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
        case GET_PERSONAL_INFO:
            return { ...state, loading: true, data: '' };

        case GET_PERSONAL_INFO_SUCCESS:
        case GET_PERSONAL_INFO_FAILURE:
        case EDIT_PERSONAL_INFO_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        //Edit Personal Information Data
        case EDIT_PERSONAL_INFO:
            return { ...state, loading: true ,data:'' };

        case EDIT_PERSONAL_INFO_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return { ...state };
    }
};