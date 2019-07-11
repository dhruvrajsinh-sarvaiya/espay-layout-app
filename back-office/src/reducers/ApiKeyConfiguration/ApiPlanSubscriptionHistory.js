// Reducer For Handle Api Plan Subscription History  By Tejas 5/3/2019
// import types
import {
    GET_API_SUBSCRIPTION_HISTORY,
    GET_API_SUBSCRIPTION_HISTORY_SUCCESS,
    GET_API_SUBSCRIPTION_HISTORY_FAILURE,
    GET_API_PLAN_USER_COUNTS,
    GET_API_PLAN_USER_COUNTS_SUCCESS,
    GET_API_PLAN_USER_COUNTS_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    subscriptionHistory: [],
    loading: false,
    error: [],
    userPlanCounts: [],
    userPlanCountsLoading: false,
    userPlanCountsError: [],
    TotalCount: 0,
    TotalPages: 0,
    ErrorCode: 0
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {

        // Get Subscription Plan History
        case GET_API_SUBSCRIPTION_HISTORY:
            return { ...state, loading: true, error: [], subscriptionHistory: [], ErrorCode: 0 };

        // set Data Of Get Subscription Plan History
        case GET_API_SUBSCRIPTION_HISTORY_SUCCESS:
            return {
                ...state,
                TotalCount: action.payload.TotalCount,
                subscriptionHistory: action.payload.Response,
                TotalPages: action.payload.PageCount,
                loading: false, error: [],
                ErrorCode: action.payload.ErrorCode
            };

        // Display Error for Get Subscription Plan History failure
        case GET_API_SUBSCRIPTION_HISTORY_FAILURE:
            return {
                ...state, loading: false, TotalCount: 0,
                TotalPages: action.payload.PageCount,
                subscriptionHistory: [], error: action.payload,
                ErrorCode: 0,
            };

        // Get User APi plan Counts
        case GET_API_PLAN_USER_COUNTS:
            return { ...state, userPlanCountsLoading: true };

        // set Data Of Get User APi plan Counts
        case GET_API_PLAN_USER_COUNTS_SUCCESS:
            return { ...state, userPlanCounts: action.payload.Response, userPlanCountsLoading: false, userPlanCountsError: [] };

        // Display Error for Get User APi plan Counts failure
        case GET_API_PLAN_USER_COUNTS_FAILURE:
            return { ...state, userPlanCountsLoading: false, userPlanCounts: [], userPlanCountsError: action.payload };


        default:
            return { ...state };
    }
};
