/**
 * Created By Saloni Rathod
 * Creatde Date 24th May 2019
 * Reducer For Referral Scheme Type Mapping 
 */
import {

    LIST_REFERRAL_SCHEME_TYPE_MAPPING,
    LIST_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,

    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING,
    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,

    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING,
    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,

    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID,
    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_SUCCESS,
    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_FAILURE

} from "Actions/types";

const INIT_STATE = {
    list: [],
    addEditData: [],
    changeStatus: [],
    getDataById: [],
    loading: false,
    edit_loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case LIST_REFERRAL_SCHEME_TYPE_MAPPING:
            return { ...state, loading: true, list: [],addEditData:[]};

        case LIST_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, loading: false, list: action.payload };

        case LIST_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, loading: false, list: action.payload };

        case ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING:
            return { ...state, loading: true, addEditData:[]};

        case ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, loading: false, addEditData: action.payload };

        case ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, loading: false, addEditData: action.payload };

        case CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING:
            return { ...state, loading: true, changeStatus:[] };

        case CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, loading: false, changeStatus: action.payload };

        case CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, loading: false, changeStatus: action.payload };

        case GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID:
            return { ...state, edit_loading: true, getDataById: []};

        case GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_SUCCESS:
            return { ...state, edit_loading: false, getDataById: action.payload };

        case GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_FAILURE:
            return { ...state, edit_loading: false, getDataById: action.payload };

        default:
            return { ...state };
    }
};