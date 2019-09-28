import {
    // list
    GET_WITHDRAWROUTELIST,
    GET_WITHDRAWROUTELIST_SUCCESS,
    GET_WITHDRAWROUTELIST_FAILURE,

    // delete
    DELETE_WITHDRAWROUTE,
    DELETE_WITHDRAWROUTE_SUCCESS,
    DELETE_WITHDRAWROUTE_FAILURE,

    //clear reducer data
    CLEAR_WITHDRAWROUTE,

    //for add address Genration Route
    ADD_ADDRESS_GENRATION_ROUTE,
    ADD_ADDRESS_GENRATION_ROUTE_SUCCESS,
    ADD_ADDRESS_GENRATION_ROUTE_FAIL,

    //for Update address Genration Route
    UPDATE_ADDRESS_GENRATION_ROUTE,
    UPDATE_ADDRESS_GENRATION_ROUTE_SUCCESS,
    UPDATE_ADDRESS_GENRATION_ROUTE_FAIL,

    //for available Route
    GET_WITHDRAWROUTEINFO,
    GET_WITHDRAWROUTEINFO_SUCCESS,
    GET_WITHDRAWROUTEINFO_FAILURE,
} from "../ActionTypes";

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
export const deleteWithdrawRoute = data => ({
    type: DELETE_WITHDRAWROUTE,
    payload: data
});
export const deleteWithdrawRouteSuccess = response => ({
    type: DELETE_WITHDRAWROUTE_SUCCESS,
    payload: response
});
export const deleteWithdrawRouteFailure = error => ({
    type: DELETE_WITHDRAWROUTE_FAILURE,
    payload: error
});

//clear address genration data
export const clearAddressGenrationData = () => ({
    type: CLEAR_WITHDRAWROUTE,
});

//Redux action for add address genration Data
export const addAddressGenrationRoute = data => ({
    type: ADD_ADDRESS_GENRATION_ROUTE,
    payload: data
});

// Redux action for add address genrationn Data Success
export const addAddressGenrationRouteSuccess = response => ({
    type: ADD_ADDRESS_GENRATION_ROUTE_SUCCESS,
    payload: response
});

// Redux action for add address genration Data Failure
export const addAddressGenrationRouteFailure = error => ({
    type: ADD_ADDRESS_GENRATION_ROUTE_FAIL,
    payload: error
});

//Redux action for update address genration Data
export const updateAddressGenrationRoute = data => ({
    type: UPDATE_ADDRESS_GENRATION_ROUTE,
    payload: data
});

// Redux action for  update address genration Data Success
export const updateAddressGenrationRouteSuccess = response => ({
    type: UPDATE_ADDRESS_GENRATION_ROUTE_SUCCESS,
    payload: response
});

// Redux action for update address genration Data Failure
export const updateAddressGenrationRouteFailure = error => ({
    type: UPDATE_ADDRESS_GENRATION_ROUTE_FAIL,
    payload: error
});

//Redux action for get route Data
export const getWithdrawRouteInfo = () => ({
    type: GET_WITHDRAWROUTEINFO
});

//Redux action for get route Data Success
export const getWithdrawRouteInfoSuccess = payload => ({
    type: GET_WITHDRAWROUTEINFO_SUCCESS,
    payload: payload
});

//Redux action for get route Data Failure
export const getWithdrawRouteInfoFailure = error => ({
    type: GET_WITHDRAWROUTEINFO_FAILURE,
    payload: error
});
