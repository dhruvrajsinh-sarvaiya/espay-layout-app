import {
    //country list 
    LIST_COUNTRY,
    LIST_COUNTRY_SUCCESS,
    LIST_COUNTRY_FAILURE,

    //country add
    ADD_COUNTRY,
    ADD_COUNTRY_SUCCESS,
    ADD_COUNTRY_FAILURE,

    //country Edit
    EDIT_COUNTRY,
    EDIT_COUNTRY_SUCCESS,
    EDIT_COUNTRY_FAILURE,

    //active langauge
    ACTIVE_LANGAUGES,
    ACTIVE_LANGAUGES_SUCCESS,
    ACTIVE_LANGAUGES_FAILURE,

    //STATE list
    LIST_STATE,
    LIST_STATE_SUCCESS,
    LIST_STATE_FAILURE,

    //state add
    ADD_STATE,
    ADD_STATE_SUCCESS,
    ADD_STATE_FAILURE,

    //state Edit
    EDIT_STATE,
    EDIT_STATE_SUCCESS,
    EDIT_STATE_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_LIST_COUNTRY_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //country list 
    countryListData: null,
    countryListFetching: false,

    //country add 
    countryAddData: null,
    countryAddFetching: false,

    //country edit 
    countryEditData: null,
    countryEditFetching: false,

    //active langauge
    activeLanguageData: null,
    activeLanguageFetching: false,

    //state list 
    stateListData: null,
    stateListFetching: false,

    //state add 
    stateAddData: null,
    stateAddFetching: false,

    //state edit 
    stateEditData: null,
    stateEditFetching: false,
}

export default function LocalizationReducer(state, action) {

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

        //country list 
        case LIST_COUNTRY:
            return { ...state, countryListFetching: true, countryListData: null };
        //country list  success
        case LIST_COUNTRY_SUCCESS:
        //country list  failure
        case LIST_COUNTRY_FAILURE:
            return { ...state, countryListFetching: false, countryListData: action.payload };

        //country add 
        case ADD_COUNTRY:
            return { ...state, countryAddFetching: true, countryAddData: null };
        //country add  success
        case ADD_COUNTRY_SUCCESS:
        //country add  failure
        case ADD_COUNTRY_FAILURE:
            return { ...state, countryAddFetching: false, countryAddData: action.payload };

        //country edit 
        case EDIT_COUNTRY:
            return { ...state, countryEditFetching: true, countryEditData: null };
        //country edit  success
        case EDIT_COUNTRY_SUCCESS:
        //country edit  failure
        case EDIT_COUNTRY_FAILURE:
            return { ...state, countryEditFetching: false, countryEditData: action.payload };

        //active langauages
        case ACTIVE_LANGAUGES:
            return { ...state, activeLanguageFetching: true, activeLanguageData: null };
        //active langauages success
        case ACTIVE_LANGAUGES_SUCCESS:
        //active langauages failure
        case ACTIVE_LANGAUGES_FAILURE:
            return { ...state, activeLanguageFetching: false, activeLanguageData: action.payload };

        //state list 
        case LIST_STATE:
            return { ...state, stateListFetching: true, stateListData: null };
        //state list  success
        case LIST_STATE_SUCCESS:
        //state list  failure
        case LIST_STATE_FAILURE:
            return { ...state, stateListFetching: false, stateListData: action.payload };

        //state add 
        case ADD_STATE:
            return { ...state, stateAddFetching: true, stateAddData: null };
        //state add  success
        case ADD_STATE_SUCCESS:
        //state add  failure
        case ADD_STATE_FAILURE:
            return { ...state, stateAddFetching: false, stateAddData: action.payload };

        //state edit 
        case EDIT_STATE:
            return { ...state, stateEditFetching: true, stateEditData: null };
        //state edit  success
        case EDIT_STATE_SUCCESS:
        //state edit  failure
        case EDIT_STATE_FAILURE:
            return { ...state, stateEditFetching: false, stateEditData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}