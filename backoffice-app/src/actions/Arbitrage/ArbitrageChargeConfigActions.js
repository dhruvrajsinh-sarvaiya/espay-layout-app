import {
    // Get Arbitrage Charge Config List
    GET_ARBI_CHARGE_CONFIG_LIST,
    GET_ARBI_CHARGE_CONFIG_LIST_SUCCESS,
    GET_ARBI_CHARGE_CONFIG_LIST_FAILURE,

    // Clear Arbitrage Charge Config Data
    CLEAR_ARBI_CHARGE_CONFIG_DATA,

    // Add Arbitrage Charge Config Data
    ADD_ARBI_CHARGE_CONFIG_DATA,
    ADD_ARBI_CHARGE_CONFIG_DATA_SUCCESS,
    ADD_ARBI_CHARGE_CONFIG_DATA_FAILURE,

    // Get Arbitrage Charge Config Detail List
    GET_ARBI_CHARGE_CONFIG_DETAIL_LIST,
    GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_SUCCESS,
    GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_FAILURE,

    // Update Arbitrage Charge Config Detail
    UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA,
    UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS,
    UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE,

    // Update Arbitrage Charge Config Detail
    ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA,
    ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS,
    ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Arbitrage Charge Config List
export function getArbitrageChargeConfigList(payload = {}) {
    return action(GET_ARBI_CHARGE_CONFIG_LIST, { payload })
}

// Redux action for Get Arbitrage Charge Config List Success
export function getArbitrageChargeConfigListSuccess(data) {
    return action(GET_ARBI_CHARGE_CONFIG_LIST_SUCCESS, { data })
}

// Redux action for Get Arbitrage Charge Config List Failure
export function getArbitrageChargeConfigListFailure() {
    return action(GET_ARBI_CHARGE_CONFIG_LIST_FAILURE)
}

// Redux action for Clear Arbitrage Charge Config Data
export function clearArbitrageChargeConfigData() {
    return action(CLEAR_ARBI_CHARGE_CONFIG_DATA)
}

// Redux action for Add Arbitrage Charge Config
export function addArbitrageChargeConfigData(payload = {}) {
    return action(ADD_ARBI_CHARGE_CONFIG_DATA, { payload })
}

// Redux action for Add Arbitrage Charge Config Success
export function addArbitrageChargeConfigDataSuccess(data) {
    return action(ADD_ARBI_CHARGE_CONFIG_DATA_SUCCESS, { data })
}

// Redux action for Add Arbitrage Charge Config Failure
export function addArbitrageChargeConfigDataFailure() {
    return action(ADD_ARBI_CHARGE_CONFIG_DATA_FAILURE)
}

// Redux action for Get Arbitrage Charge Config Detail List
export function getArbiChargeConfigDetailList(payload = {}) {
    return action(GET_ARBI_CHARGE_CONFIG_DETAIL_LIST, { payload })
}

// Redux action for Get Arbitrage Charge Config Detail List Success
export function getArbiChargeConfigDetailListSuccess(data) {
    return action(GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_SUCCESS, { data })
}

// Redux action for Get Arbitrage Charge Config Detail List Failure
export function getArbiChargeConfigDetailListFailure() {
    return action(GET_ARBI_CHARGE_CONFIG_DETAIL_LIST_FAILURE)
}

// Redux action for Update Arbitrage Charge Config Detail Data
export function updateArbiChargeConfigDetail(payload = {}) {
    return action(UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA, { payload })
}

// Redux action for Update Arbitrage Charge Config Detail Data Success
export function updateArbiChargeConfigDetailSuccess(data) {
    return action(UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS, { data })
}

// Redux action for Update Arbitrage Charge Config Detail Data Failure
export function updateArbiChargeConfigDetailFailure() {
    return action(UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE)
}

// Redux action for Add Arbitrage Charge Config Detail Data
export function addArbiChargeConfigDetail(payload = {}) {
    return action(ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA, { payload })
}

// Redux action for Add Arbitrage Charge Config Detail Data Success
export function addArbiChargeConfigDetailSuccess(data) {
    return action(ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_SUCCESS, { data })
}

// Redux action for Add Arbitrage Charge Config Detail Data Failure
export function addArbiChargeConfigDetailFailure() {
    return action(ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA_FAILURE)
}