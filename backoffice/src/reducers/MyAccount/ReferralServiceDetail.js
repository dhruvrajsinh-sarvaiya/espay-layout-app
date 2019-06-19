/**
 * Created By Bharat Jograna
 * Creatde Date 23 May 2019
 * Reducer For Referral Service Detail
 */
import {

    LIST_REFERRAL_SERVICE_DETAIL,
    LIST_REFERRAL_SERVICE_DETAIL_SUCCESS,
    LIST_REFERRAL_SERVICE_DETAIL_FAILURE,

    ADD_EDIT_REFERRAL_SERVICE_DETAIL,
    ADD_EDIT_REFERRAL_SERVICE_DETAIL_SUCCESS,
    ADD_EDIT_REFERRAL_SERVICE_DETAIL_FAILURE,

    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL,
    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_SUCCESS,
    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_FAILURE,

    GET_REFERRAL_SERVICE_DETAIL_BY_ID,
    GET_REFERRAL_SERVICE_DETAIL_BY_ID_SUCCESS,
    GET_REFERRAL_SERVICE_DETAIL_BY_ID_FAILURE

} from "Actions/types";

const INIT_STATE = {
    list: {},
    addEditData: {},
    changeStatus: {},
    getDataById: {},
    loading: false,
    edit_loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case LIST_REFERRAL_SERVICE_DETAIL:
            return { ...state, loading: true, list: {} };

        case LIST_REFERRAL_SERVICE_DETAIL_SUCCESS:
            return { ...state, loading: false, list: action.payload };

        case LIST_REFERRAL_SERVICE_DETAIL_FAILURE:
            return { ...state, loading: false, list: action.payload };

        case ADD_EDIT_REFERRAL_SERVICE_DETAIL:
            return { ...state, loading: true, addEditData: {} };

        case ADD_EDIT_REFERRAL_SERVICE_DETAIL_SUCCESS:
            return { ...state, loading: false, addEditData: action.payload };

        case ADD_EDIT_REFERRAL_SERVICE_DETAIL_FAILURE:
            return { ...state, loading: false, addEditData: action.payload };

        case CHANGE_STATUS_REFERRAL_SERVICE_DETAIL:
            return { ...state, loading: true, changeStatus: {} };

        case CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_SUCCESS:
            return { ...state, loading: false, changeStatus: action.payload };

        case CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_FAILURE:
            return { ...state, loading: false, changeStatus: action.payload };

        case GET_REFERRAL_SERVICE_DETAIL_BY_ID:
            return { ...state, edit_loading: true, getDataById: {} };

        case GET_REFERRAL_SERVICE_DETAIL_BY_ID_SUCCESS:
            return { ...state, edit_loading: false, getDataById: action.payload };

        case GET_REFERRAL_SERVICE_DETAIL_BY_ID_FAILURE:
            return { ...state, edit_loading: false, getDataById: action.payload };

        default:
            return { ...state };
    }
};