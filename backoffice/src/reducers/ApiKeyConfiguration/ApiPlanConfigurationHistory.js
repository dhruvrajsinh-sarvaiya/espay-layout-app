// Reducer For Handle Api Plan Configuration History  By devang parekh 11/3/2019
// import types
import {
    GET_API_PLAN_CONFIGURATION_HISTORY,
    GET_API_PLAN_CONFIGURATION_HISTORY_SUCCESS,
    GET_API_PLAN_CONFIGURATION_HISTORY_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    apiPlanConfigurationHistory: [],
    loading: false,
    error: [],
    userPlanCountsLoading: false,
    TotalCount: 0,
    TotalPages: 0,
    ErrorCode:0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // Get Configuration Plan History
        case GET_API_PLAN_CONFIGURATION_HISTORY:
            return { ...state, loading: true, error: [], apiPlanConfigurationHistory: [],ErrorCode:0 };

        // set Data Of Get Configuration Plan History
        case GET_API_PLAN_CONFIGURATION_HISTORY_SUCCESS:
            return {
                ...state,
                TotalCount: action.payload.TotalCount,
                apiPlanConfigurationHistory: action.payload.Response,
                TotalPages: action.payload.PageCount,
                loading: false, error: [],
                ErrorCode:action.payload.ErrorCode
            };

        // Display Error for Get Configuration Plan History failure
        case GET_API_PLAN_CONFIGURATION_HISTORY_FAILURE:
            return {
                ...state, loading: false, TotalCount: 0,
                TotalPages: action.payload.PageCount,
                apiPlanConfigurationHistory: [], error: action.payload,
                ErrorCode:0,
            };
            
        default:
            return { ...state };
    }
};
