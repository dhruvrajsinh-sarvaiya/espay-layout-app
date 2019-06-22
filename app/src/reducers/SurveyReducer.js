// Action types for Survey
import {
    // Get Survey
    GET_SURVEY,
    GET_SURVEY_SUCCESS,
    GET_SURVEY_FAILURE,

    // Add Survey Result
    ADD_SURVEYRESULT,
    ADD_SURVEYRESULT_SUCCESS,
    ADD_SURVEYRESULT_FAILURE,

    // Get Survey Result By Id
    GET_SURVEY_RESULTS_BY_ID,
    GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    GET_SURVEY_RESULTS_BY_ID_FAILURE,

    // Get Survey Result By Id Clear
    GET_SURVEY_RESULTS_BY_ID_CLEAR,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// initial state for Survey 
const initialState = {
    surveydata: {},
    data: null,
    loading: false,
    addLoading: false,
    surveyresultsdetail: {},
};

export default SurveyReducer = (state = initialState, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle Survey method data
        case GET_SURVEY:
            return { ...state, loading: true, surveydata: {}, data: null };

        // Set Survey success data
        case GET_SURVEY_SUCCESS:
            return { ...state, loading: true, surveydata: action.payload };

        // Set Survey failure data
        case GET_SURVEY_FAILURE:
            return { ...state, loading: false, surveydata: {}, data: null };

        // Handle Survet Result method data
        case ADD_SURVEYRESULT:
            return { ...state, addLoading: true, data: null };

        // Set Survet Result success data
        case ADD_SURVEYRESULT_SUCCESS:
            return { ...state, addLoading: false, data: action.payload };

        // Set Survet Result failure data
        case ADD_SURVEYRESULT_FAILURE:
            return { ...state, addLoading: false, data: action.payload };

        // Handle Survet Result By Id method data
        case GET_SURVEY_RESULTS_BY_ID:
            return { ...state, loading: true, data: null, surveyresultsdetail: [] };

        // Handle Survet Result By Id method data
        case GET_SURVEY_RESULTS_BY_ID_SUCCESS:
            return { ...state, loading: false, data: null, surveyresultsdetail: action.payload };
        // Set Survet Result By Id success data
        case GET_SURVEY_RESULTS_BY_ID_FAILURE:
            return { ...state, loading: false, data: null, surveyresultsdetail: [] };
        // Set Survet Result By Id failure data
        case GET_SURVEY_RESULTS_BY_ID_CLEAR:
            return { ...state, loading: false, data: null, surveyresultsdetail: [] };

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}
