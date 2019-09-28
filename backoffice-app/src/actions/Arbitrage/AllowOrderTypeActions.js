import {
    // Get Arbitrage Allow Order Type List
    GET_ARBI_ALLOW_ORDER_TYPE_LIST,
    GET_ARBI_ALLOW_ORDER_TYPE_LIST_SUCCESS,
    GET_ARBI_ALLOW_ORDER_TYPE_LIST_FAILURE,

    // Clear Arbitrage Order Type Data
    CLEAR_ARBI_ALLOW_ORDER_TYPE_DATA,

    // Update Order Type Data
    ALLOW_ORDER_TYPE_DATA,
    ALLOW_ORDER_TYPE_DATA_SUCCESS,
    ALLOW_ORDER_TYPE_DATA_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Arbitrage Allow Order Type List
export function getArbiAllowOrderTypeList(payload = {}) {
    return action(GET_ARBI_ALLOW_ORDER_TYPE_LIST, { payload })
}

// Redux action for Get Arbitrage Allow Order Type List Success
export function getArbiAllowOrderTypeListSuccess(data) {
    return action(GET_ARBI_ALLOW_ORDER_TYPE_LIST_SUCCESS, { data })
}

// Redux action for Get Arbitrage Allow Order Type List Failure
export function getArbiAllowOrderTypeListFailure() {
    return action(GET_ARBI_ALLOW_ORDER_TYPE_LIST_FAILURE)
}

// Redux action for Update Order Type Data
export function allowOrderTypeData(payload = {}) {
    return action(ALLOW_ORDER_TYPE_DATA, { payload })
}

// Redux action for Update Order Type Data Success
export function allowOrderTypeDataSuccess(data) {
    return action(ALLOW_ORDER_TYPE_DATA_SUCCESS, { data })
}

// Redux action for Update Order Type Data Failure
export function allowOrderTypeDataFailure() {
    return action(ALLOW_ORDER_TYPE_DATA_FAILURE)
}

// Redux action for Clear Arbitrage Allow Order Type
export function clearArbiAllowOrderTypeData() {
    return action(CLEAR_ARBI_ALLOW_ORDER_TYPE_DATA)
}