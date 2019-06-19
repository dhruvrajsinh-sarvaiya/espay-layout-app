// Actions For Subscribe API Plan By Tejas 28/2/2019

// import types
import {
    SUBSCRIBE_API_PLAN,
    SUBSCRIBE_API_PLAN_SUCCESS,
    SUBSCRIBE_API_PLAN_FAILURE,
} from "Actions/types";

//action for Get Subscribe API Plan and set type for reducers
export const subScribeApiPlan = Data => ({
    type: SUBSCRIBE_API_PLAN,
    payload: { Data }
});

//action for set Success and Get Subscribe API Plan and set type for reducers
export const subScribeApiPlanSuccess = response => ({
    type: SUBSCRIBE_API_PLAN_SUCCESS,
    payload: response
});

//action for set failure and error to Get Subscribe API Plan and set type for reducers
export const subScribeApiPlanFailure = error => ({
    type: SUBSCRIBE_API_PLAN_FAILURE,
    payload: error
});