/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : Organization Information Reducers
*/
import {
    GET_ORGANIZATION_INFO,
    GET_ORGANIZATION_INFO_SUCCESS,
    GET_ORGANIZATION_INFO_FAILURE,
    ADD_ORGANIZATION_INFO,
    ADD_ORGANIZATION_INFO_SUCCESS,
    ADD_ORGANIZATION_INFO_FAILURE,
    EDIT_ORGANIZATION_INFO,
    EDIT_ORGANIZATION_INFO_SUCCESS,
    EDIT_ORGANIZATION_INFO_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    orgInfoData: [],
    addEditOrgData: [],
    loading: false,
    ext_flag: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_INFO:
            return { ...state, loading: true, ext_flag: false, orgInfoData: '' };

        case GET_ORGANIZATION_INFO_SUCCESS:
            return { ...state, loading: false, orgInfoData: action.payload };

        case GET_ORGANIZATION_INFO_FAILURE:
            return { ...state, loading: false, orgInfoData: action.payload };

        case ADD_ORGANIZATION_INFO:
            return { ...state, loading: true, addEditOrgData: '' };

        case ADD_ORGANIZATION_INFO_SUCCESS:
            return { ...state, loading: false, addEditOrgData: action.payload, ext_flag: true };

        case ADD_ORGANIZATION_INFO_FAILURE:
            return { ...state, loading: false, addEditOrgData: action.payload };

        case EDIT_ORGANIZATION_INFO:
            return { ...state, loading: true, addEditOrgData: '' };

        case EDIT_ORGANIZATION_INFO_SUCCESS:
            return { ...state, loading: false, addEditOrgData: action.payload, ext_flag: true };

        case EDIT_ORGANIZATION_INFO_FAILURE:
            return { ...state, loading: false, addEditOrgData: action.payload };

        default:
            return { ...state };
    }
};