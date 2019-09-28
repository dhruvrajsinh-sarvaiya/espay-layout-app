import {
    // Get Deposit Route List
    GET_DEPOSIT_ROUTE_LIST,
    GET_DEPOSIT_ROUTE_LIST_SUCCESS,
    GET_DEPOSIT_ROUTE_LIST_FAILURE,

    // Delete Deposit Route Data
    DELETE_DEPOSIT_ROUTE_DATA,
    DELETE_DEPOSIT_ROUTE_DATA_SUCCESS,
    DELETE_DEPOSIT_ROUTE_DATA_FAILURE,

    // Clear Deposit Route Data
    CLEAR_DEPOSIT_ROUTE_DATA,

    // Add Deposit Route
    ADD_DEPOSIT_ROUTE,
    ADD_DEPOSIT_ROUTE_SUCCESS,
    ADD_DEPOSIT_ROUTE_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Deposit Route List
export function getDepositRouteList(payload = {}) {
    return action(GET_DEPOSIT_ROUTE_LIST, { payload })
}

// Redux action for Get Deposit Route List Success
export function getDepositRouteListSuccess(data) {
    return action(GET_DEPOSIT_ROUTE_LIST_SUCCESS, { data })
}

// Redux action for Get Deposit Route List Failure
export function getDepositRouteListFailure() {
    return action(GET_DEPOSIT_ROUTE_LIST_FAILURE)
}

// Redux action for Delete Deposit Route List
export function deleteDepositRouteData(payload = {}) {
    return action(DELETE_DEPOSIT_ROUTE_DATA, { payload })
}

// Redux action for Delete Deposit Route List Success
export function deleteDepositRouteDataSuccess(data) {
    return action(DELETE_DEPOSIT_ROUTE_DATA_SUCCESS, { data })
}

// Redux action for Delete Deposit Route List Failure
export function deleteDepositRouteDataFailure() {
    return action(DELETE_DEPOSIT_ROUTE_DATA_FAILURE)
}

// Redux action for Add Deposit Route List
export function addDepositRoute(payload = {}) {
    return action(ADD_DEPOSIT_ROUTE, { payload })
}

// Redux action for Add Deposit Route List Success
export function addDepositRouteSuccess(data) {
    return action(ADD_DEPOSIT_ROUTE_SUCCESS, { data })
}

// Redux action for Add Deposit Route List Failure
export function addDepositRouteFailure() {
    return action(ADD_DEPOSIT_ROUTE_FAILURE)
}

// Redux action for Clear Deposit Route Data
export function clearDepositRouteData() {
    return action(CLEAR_DEPOSIT_ROUTE_DATA)
}