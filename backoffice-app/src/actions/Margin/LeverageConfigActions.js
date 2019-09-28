import {
    // Get Leverage Configuration List
    GET_LEVERAGE_CONFIG_LIST,
    GET_LEVERAGE_CONFIG_LIST_SUCCESS,
    GET_LEVERAGE_CONFIG_LIST_FAILURE,

    // Delete Leverage Config Data
    DELETE_LEVERAGE_CONFIG_DATA,
    DELETE_LEVERAGE_CONFIG_DATA_SUCCESS,
    DELETE_LEVERAGE_CONFIG_DATA_FAILURE,

    // Clear Leverage Config Data
    CLEAR_LEVERAGE_CONFIG_DATA,

    // Add/Edit Leverage Config Data
    ADD_LEVERAGE_CONFIG_DATA,
    ADD_LEVERAGE_CONFIG_DATA_SUCCESS,
    ADD_LEVERAGE_CONFIG_DATA_FAILURE
} from "../ActionTypes";
import { action } from '../GlobalActions';

// Redux action for Get Leverage Configuration List
export function getLeverageConfigList(payload = {}) {
    return action(GET_LEVERAGE_CONFIG_LIST, { payload })
}

// Redux action for Get Leverage Configuration List Success
export function getLeverageConfigListSuccess(data) {
    return action(GET_LEVERAGE_CONFIG_LIST_SUCCESS, { data })
}

// Redux action for Get Leverage Configuration List Success
export function getLeverageConfigListFailure() {
    return action(GET_LEVERAGE_CONFIG_LIST_FAILURE)
}

// Redux action for Delete Leverage Configuration Data
export function deleteLeverageConfigData(payload) {
    return action(DELETE_LEVERAGE_CONFIG_DATA, { payload })
}

// Redux action for Delete Leverage Configuration Data Success
export function deleteLeverageConfigDataSuccess(data) {
    return action(DELETE_LEVERAGE_CONFIG_DATA_SUCCESS, { data })
}

// Redux action for Delete Leverage Configuration Data Success
export function deleteLeverageConfigDataFailure() {
    return action(DELETE_LEVERAGE_CONFIG_DATA_FAILURE)
}

// Redux action for Clear Leverage Configuration Data
export function clearLeverageConfigData() {
    return action(CLEAR_LEVERAGE_CONFIG_DATA)
}

// Redux action for Add/Edit Leverage Configuration List
export function addLeverageConfigData(payload = {}) {
    return action(ADD_LEVERAGE_CONFIG_DATA, { payload })
}

// Redux action for Add/Edit Leverage Configuration List Success
export function addLeverageConfigDataSuccess(data) {
    return action(ADD_LEVERAGE_CONFIG_DATA_SUCCESS, { data })
}

// Redux action for Add/Edit Leverage Configuration List Success
export function addLeverageConfigDataFailure() {
    return action(ADD_LEVERAGE_CONFIG_DATA_FAILURE)
}