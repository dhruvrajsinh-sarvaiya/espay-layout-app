/**
 *   Developer : Parth Andhariya
 *   Date : 22-03-2019
 *   Component: Deposition Interval Action
 */
import {
    GET_DEPOSIT_INTERVAL,
    GET_DEPOSIT_INTERVAL_SUCCESS,
    GET_DEPOSIT_INTERVAL_FAILURE,
    ADD_UPDATE_DEPOSIT_INTERVAL,
    ADD_UPDATE_DEPOSIT_INTERVAL_SUCCESS,
    ADD_UPDATE_DEPOSIT_INTERVAL_FAILURE,

} from "../types";

//List ChargeConfiguration Action
export const ListDepositionInterval = request => ({
    type: GET_DEPOSIT_INTERVAL,
    request: request
});
export const ListDepositionIntervalSuccess = response => ({
    type: GET_DEPOSIT_INTERVAL_SUCCESS,
    payload: response
});
export const ListDepositionIntervalFailure = error => ({
    type: GET_DEPOSIT_INTERVAL_FAILURE,
    payload: error
});
//Add ChargeConfiguration Action
export const AddUpdateDepositionInterval = request => ({
    type: ADD_UPDATE_DEPOSIT_INTERVAL,
    payload: request
});
export const AddUpdateDepositionIntervalSuccess = response => ({
    type: ADD_UPDATE_DEPOSIT_INTERVAL_SUCCESS,
    payload: response
});
export const AddUpdateDepositionIntervalFailure = error => ({
    type: ADD_UPDATE_DEPOSIT_INTERVAL_FAILURE,
    payload: error
});