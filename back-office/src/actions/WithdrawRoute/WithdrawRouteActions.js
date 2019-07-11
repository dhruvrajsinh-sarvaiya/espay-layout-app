import {
    // LIST CURRENCY
    LISTCURRENCY,
    LISTCURRENCY_SUCCESS,
    LISTCURRENCY_FAIL,
    // list
    GET_WITHDRAWROUTELIST,
    GET_WITHDRAWROUTELIST_SUCCESS,
    GET_WITHDRAWROUTELIST_FAILURE,
    // delete
    DELETE_WITHDRAWROUTE,
    DELETE_WITHDRAWROUTE_SUCCESS,
    DELETE_WITHDRAWROUTE_FAILURE,
    // get info
    GET_WITHDRAWROUTEINFO,
    GET_WITHDRAWROUTEINFO_SUCCESS,
    GET_WITHDRAWROUTEINFO_FAILURE,
    // post info
    POST_WITHDRAWROUTEINFO,
    POST_WITHDRAWROUTEINFO_SUCCESS,
    POST_WITHDRAWROUTEINFO_FAILURE,
    //get route by id
    GETROUTEBYID,
    GETROUTEBYID_SUCCESS,
    GETROUTEBYID_FAILURE,
} from "../types";

/* LIST CURRENCY */
export const getCurrencyList = () => ({
    type: LISTCURRENCY
});
export const getCurrencyListSuccess = response => ({
    type: LISTCURRENCY_SUCCESS,
    payload: response
});
export const getCurrencyListFailure = error => ({
    type: LISTCURRENCY_FAIL,
    payload: error
});

// list methods
export const getWithdrawRouteList = (request) => ({
    type: GET_WITHDRAWROUTELIST,
    payload: request
});
export const getWithdrawRouteListSuccess = response => ({
    type: GET_WITHDRAWROUTELIST_SUCCESS,
    payload: response
});
export const getWithdrawRouteListFailure = error => ({
    type: GET_WITHDRAWROUTELIST_FAILURE,
    payload: error
});

// detelet methods
export const deleteWithdrawRoute = withdrawRouteId => ({
    type: DELETE_WITHDRAWROUTE,
    withdrawRouteId: withdrawRouteId
});
export const deleteWithdrawRouteSuccess = response => ({
    type: DELETE_WITHDRAWROUTE_SUCCESS,
    payload: response
});
export const deleteWithdrawRouteFailure = error => ({
    type: DELETE_WITHDRAWROUTE_FAILURE,
    payload: error
});

//POST INFO METHODS
export const postWithdrawRouteInfo = payload => ({
    type: POST_WITHDRAWROUTEINFO,
    payload: payload
});
export const postWithdrawRouteInfoSuccess = payload => ({
    type: POST_WITHDRAWROUTEINFO_SUCCESS,
    payload: payload
});
export const postWithdrawRouteInfoFailure = error => ({
    type: POST_WITHDRAWROUTEINFO_FAILURE,
    payload: error
});

//GET INFO METHODS
export const getWithdrawRouteInfo = () => ({
    type: GET_WITHDRAWROUTEINFO
});
export const getWithdrawRouteInfoSuccess = payload => ({
    type: GET_WITHDRAWROUTEINFO_SUCCESS,
    payload: payload
});
export const getWithdrawRouteInfoFailure = error => ({
    type: GET_WITHDRAWROUTEINFO_FAILURE,
    payload: error
});

//GET ROUTE BY ID
export const getRouteInfoById = (routeId) => ({
    type: GETROUTEBYID,
    routeId: routeId
});
export const getRouteInfoByIdSuccess = response => ({
    type: GETROUTEBYID_SUCCESS,
    payload: response
});
export const getRouteInfoByIdFailure = error => ({
    type: GETROUTEBYID_FAILURE,
    payload: error
});
