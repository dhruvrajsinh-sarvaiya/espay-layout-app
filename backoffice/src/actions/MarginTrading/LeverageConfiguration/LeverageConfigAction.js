/* 
    Developer : Vishva shah
    Date : 18-02-2019
    File Comment : Leverage Config Actions
*/
import {
    // list...
    LISTLEVERAGE,
    LISTLEVERAGE_SUCCESS,
    LISTLEVERAGE_FAILURE,
    // remove...
    REMOVELEVERAGE,
    REMOVELEVERAGE_SUCCESS,
    REMOVELEVERAGE_FAILURE,
    // insert update...
    INSERTUPDATELEVERAGE,
    INSERTUPDATELEVERAGE_SUCCESS,
    INSERTUPDATELEVERAGE_FAILURE,
} from "../../types";

/* List methods.. */
export const getListLeverage = (request) => ({
    type: LISTLEVERAGE,
    request: request
});
export const getListLeverageSuccess = (response) => ({
    type: LISTLEVERAGE_SUCCESS,
    payload: response
});
export const getListLeverageFailure = (error) => ({
    type: LISTLEVERAGE_FAILURE,
    payload: error
});

/* remove Leverage Configuration... */
export const removeLeverage = (Id) => ({
    type: REMOVELEVERAGE,
    Id: Id
})
export const removeLeverageSuccess = (response) => ({
    type: REMOVELEVERAGE_SUCCESS,
    payload: response
})
export const removeLeverageFailure = (error) => ({
    type: REMOVELEVERAGE,
    payload: error
})

/* Insert & Update deposit route... */
export const insertUpdateLeverage = (request) => ({
    type: INSERTUPDATELEVERAGE,
    request: request
});
export const insertUpdateLeverageSuccess = (response) => ({
    type: INSERTUPDATELEVERAGE_SUCCESS,
    payload: response
});
export const insertUpdateLeverageFailure = (error) => ({
    type: INSERTUPDATELEVERAGE_FAILURE,
    payload: error
});


