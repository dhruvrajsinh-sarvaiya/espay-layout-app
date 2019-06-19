// Reducer For Handle Api PLan configuration dashbaord count 
// By Devang parekh (9-4-2019)

// import types
import {
    GET_API_KEY_DASHBOARD_COUNT,
    GET_API_KEY_DASHBOARD_COUNT_SUCCESS,
    GET_API_KEY_DASHBOARD_COUNT_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    apiKeyDashboardCountDetail: [],
    loading: false,
    error: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // Get api plan configuration count
        case GET_API_KEY_DASHBOARD_COUNT:
            return { loading: true, error: [], apiKeyDashboardCountDetail: [] };

        // set Data Of Get api plan configuration count
        case GET_API_KEY_DASHBOARD_COUNT_SUCCESS:
            return { loading: false, apiKeyDashboardCountDetail: action.payload.Response, error: [] };

        // Display Error for Get api plan configuration count failure
        case GET_API_KEY_DASHBOARD_COUNT_FAILURE:
            return { loading: false, apiKeyDashboardCountDetail: [], error: action.payload };

        default:
            return { ...state };
    }
};
