import {
    //Zipcode list 
    LIST_ZIP_CODE,
    LIST_ZIP_CODE_SUCCESS,
    LIST_ZIP_CODE_FAILURE,

    //Zipcode add
    ADD_ZIP_CODE,
    ADD_ZIP_CODE_SUCCESS,
    ADD_ZIP_CODE_FAILURE,

    //Zipcode Edit
    EDIT_ZIP_CODE,
    EDIT_ZIP_CODE_SUCCESS,
    EDIT_ZIP_CODE_FAILURE,

    //city by state id list
    GET_CITY_BY_STATE_ID,
    GET_CITY_BY_STATE_ID_SUCCESS,
    GET_CITY_BY_STATE_ID_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_LIST_COUNTRY_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //zipCode list 
    zipCodeListData: null,
    zipCodeListFetching: false,

    //zipCode add 
    zipCodeAddData: null,
    zipCodeAddFetching: false,

    //zipCode edit 
    zipCodeEditData: null,
    zipCodeEditFetching: false,

    //city by state id list 
    cityByStateIdData: null,
    cityByStateIdFetching: false,
}

export default function ZipCodesReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_LIST_COUNTRY_DATA:
            return INITIAL_STATE

        //zipCode list 
        case LIST_ZIP_CODE:
            return { ...state, zipCodeListFetching: true, zipCodeListData: null };
        //zipCode list  success
        case LIST_ZIP_CODE_SUCCESS:
        //zipCode list  failure
        case LIST_ZIP_CODE_FAILURE:
            return { ...state, zipCodeListFetching: false, zipCodeListData: action.payload };

        //zipCode add 
        case ADD_ZIP_CODE:
            return { ...state, zipCodeAddFetching: true, zipCodeAddData: null };
        //zipCode add  success
        case ADD_ZIP_CODE_SUCCESS:
        //zipCode add  failure
        case ADD_ZIP_CODE_FAILURE:
            return { ...state, zipCodeAddFetching: false, zipCodeAddData: action.payload };

        //zipCode edit 
        case EDIT_ZIP_CODE:
            return { ...state, zipCodeEditFetching: true, zipCodeEditData: null };
        //zipCode edit  success
        case EDIT_ZIP_CODE_SUCCESS:
        //zipCode edit  failure
        case EDIT_ZIP_CODE_FAILURE:
            return { ...state, zipCodeEditFetching: false, zipCodeEditData: action.payload };

        //state by country id list 
        case GET_CITY_BY_STATE_ID:
            return { ...state, cityByStateIdFetching: true, cityByStateIdData: null };
        //state by country id list  success
        case GET_CITY_BY_STATE_ID_SUCCESS:
        //state by country id list  failure
        case GET_CITY_BY_STATE_ID_FAILURE:
            return { ...state, cityByStateIdFetching: false, cityByStateIdData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}