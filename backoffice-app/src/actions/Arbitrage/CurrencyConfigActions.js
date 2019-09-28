import {
    // Get Arbitrage Currency Config List
    GET_ARBI_CURRENCY_CONFIG_LIST,
    GET_ARBI_CURRENCY_CONFIG_LIST_SUCCESS,
    GET_ARBI_CURRENCY_CONFIG_LIST_FAILURE,

    // Clear Arbitrage Currency Config Data
    CLEAR_ARBI_CURRENCY_CONFIG_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Currency Config
export function getCurrencyConfigList(payload = {}) {
    return action(GET_ARBI_CURRENCY_CONFIG_LIST, { payload })
}

// Redux action for Get Currency Config Success
export function getCurrencyConfigListSuccess(data) {
    return action(GET_ARBI_CURRENCY_CONFIG_LIST_SUCCESS, { data })
}

// Redux action for Get Currency Config Failure
export function getCurrencyConfigListFailure() {
    return action(GET_ARBI_CURRENCY_CONFIG_LIST_FAILURE)
}

// Redux action for Clear Currency Config Data
export function clearCurrencyConfigListData() {
    return action(CLEAR_ARBI_CURRENCY_CONFIG_DATA)
}