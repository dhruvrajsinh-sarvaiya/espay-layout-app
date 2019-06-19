// Actions For Api PLan Subscription history By Tejas 5/3/2019

// import types
import {
  GET_API_SUBSCRIPTION_HISTORY,
  GET_API_SUBSCRIPTION_HISTORY_SUCCESS,
  GET_API_SUBSCRIPTION_HISTORY_FAILURE,
  GET_API_PLAN_USER_COUNTS,
  GET_API_PLAN_USER_COUNTS_SUCCESS,
  GET_API_PLAN_USER_COUNTS_FAILURE,
} from "Actions/types";

//action for api plan subscription historyn and set type for reducers
export const getApiSubscriptionHistory = Data => ({
  type: GET_API_SUBSCRIPTION_HISTORY,
  payload: { Data }
});

//action for set Success and api plan subscription historyn and set type for reducers
export const getApiSubscriptionHistorySuccess = response => ({
  type: GET_API_SUBSCRIPTION_HISTORY_SUCCESS,
  payload: response
});

//action for set failure and error to api plan subscription historyn and set type for reducers
export const getApiSubscriptionHistoryFailure = error => ({
  type: GET_API_SUBSCRIPTION_HISTORY_FAILURE,
  payload: error
});


//action for api plan user counts and set type for reducers
export const getApiPlanUserCounts = Data => ({
  type: GET_API_PLAN_USER_COUNTS,
  payload: { Data }
});

//action for set Success and api plan user counts and set type for reducers
export const getApiPlanUserCountsSuccess = response => ({
  type: GET_API_PLAN_USER_COUNTS_SUCCESS,
  payload: response
});

//action for set failure and error to api plan user counts and set type for reducers
export const getApiPlanUserCountsFailure = error => ({
  type: GET_API_PLAN_USER_COUNTS_FAILURE,
  payload: error
});
