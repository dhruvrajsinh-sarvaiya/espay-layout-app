/* 
    Developer : Nishant Vadgama
    Date : 31-01-2019
    File Comment : Deposit Routing Actions
*/
import {
    // list...
    DEPOSITROUTELIST,
    DEPOSITROUTELIST_SUCCESS,
    DEPOSITROUTELIST_FAILURE,
    // insert update...
    INSERTUPDATEDEPOSITROUTE,
    INSERTUPDATEDEPOSITROUTE_SUCCESS,
    INSERTUPDATEDEPOSITROUTE_FAILURE,
    // remove...
    REMOVEDEPOSITROUTE,
    REMOVEDEPOSITROUTE_SUCCESS,
    REMOVEDEPOSITROUTE_FAILURE
} from "../types";

/* List methods.. */
export const getDepositRouteList = (request) => ({
    type: DEPOSITROUTELIST,
    request: request
});
export const getDepositRouteListSuccess = (response) => ({
    type: DEPOSITROUTELIST_SUCCESS,
    payload: response
});
export const getDepositRouteListFailure = (error) => ({
    type: DEPOSITROUTELIST_FAILURE,
    payload: error
});

/* Insert & Update deposit route... */
export const insertUpdateDepositRoute = (request) => ({
    type: INSERTUPDATEDEPOSITROUTE,
    request: request
});
export const insertUpdateDepositRouteSuccess = (response) => ({
    type: INSERTUPDATEDEPOSITROUTE_SUCCESS,
    payload: response
});
export const insertUpdateDepositRouteFailure = (error) => ({
    type: INSERTUPDATEDEPOSITROUTE_FAILURE,
    payload: error
});

/* remove deposit route... */
export const removeDepositRoute = (routeId) => ({
    type: REMOVEDEPOSITROUTE,
    routeId: routeId
})
export const removeDepositRouteSuccess = (response) => ({
    type: REMOVEDEPOSITROUTE_SUCCESS,
    payload: response
})
export const removeDepositRouteFailure = (error) => ({
    type:     REMOVEDEPOSITROUTE_FAILURE,
    payload: error
})
