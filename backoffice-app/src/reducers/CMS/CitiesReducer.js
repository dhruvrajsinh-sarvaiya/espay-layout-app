import {
    //city list 
    LIST_CITY,
    LIST_CITY_SUCCESS,
    LIST_CITY_FAILURE,

    //city add
    ADD_CITY,
    ADD_CITY_SUCCESS,
    ADD_CITY_FAILURE,

    //city Edit
    EDIT_CITY,
    EDIT_CITY_SUCCESS,
    EDIT_CITY_FAILURE,

    //state by country id list
    GET_STATE_BY_COUNTRY_ID,
    GET_STATE_BY_COUNTRY_ID_SUCCESS,
    GET_STATE_BY_COUNTRY_ID_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_LIST_COUNTRY_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //city list 
    cityListData: null,
    cityListFetching: false,

    //city add 
    cityAddData: null,
    cityAddFetching: false,

    //city edit 
    cityEditData: null,
    cityEditFetching: false,

    //state by country id list 
    stateByCountryIdData: null,
    stateByCountryIdFetching: false,
}

export default function CitiesReducer(state, action) {

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

        //city list 
        case LIST_CITY:
            return { ...state, cityListFetching: true, cityListData: null };
        //city list  success
        case LIST_CITY_SUCCESS:
        //city list  failure
        case LIST_CITY_FAILURE:
            return { ...state, cityListFetching: false, cityListData: action.payload };

        //city add 
        case ADD_CITY:
            return { ...state, cityAddFetching: true, cityAddData: null };
        //city add  success
        case ADD_CITY_SUCCESS:
        //city add  failure
        case ADD_CITY_FAILURE:
            return { ...state, cityAddFetching: false, cityAddData: action.payload };

        //city edit 
        case EDIT_CITY:
            return { ...state, cityEditFetching: true, cityEditData: null };
        //city edit  success
        case EDIT_CITY_SUCCESS:
        //city edit  failure
        case EDIT_CITY_FAILURE:
            return { ...state, cityEditFetching: false, cityEditData: action.payload };

        //state by country id list 
        case GET_STATE_BY_COUNTRY_ID:
            return { ...state, stateByCountryIdFetching: true, stateByCountryIdData: null };
        //state by country id list  success
        case GET_STATE_BY_COUNTRY_ID_SUCCESS:
        //state by country id list  failure
        case GET_STATE_BY_COUNTRY_ID_FAILURE:
            return { ...state, stateByCountryIdFetching: false, stateByCountryIdData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}