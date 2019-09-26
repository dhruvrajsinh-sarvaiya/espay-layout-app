// InitialBalanceConfigurationActions
import {
    // for get list of initial balance configuration
    GET_INITIAL_BALANCE_CONFIGURATION_LIST,
    GET_INITIAL_BALANCE_CONFIGURATION_LIST_SUCCESS,
    GET_INITIAL_BALANCE_CONFIGURATION_LIST_FAILURE,

    // for Add Initial Balance
    ADD_INITIAL_BALANCE_CONFIGURATION,
    ADD_INITIAL_BALANCE_CONFIGURATION_SUCCESS,
    ADD_INITIAL_BALANCE_CONFIGURATION_FAILURE,

    // for clear initial balance configuration
    CLEAR_INITIAL_BALANCE_CONFIGURATION_DATA,
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get initial balance configuration
export function getInitialBalanceConfigurationList(payload = {}) {
    return action(GET_INITIAL_BALANCE_CONFIGURATION_LIST, { payload })
}

// Redux action for Get initial balance configuration Success
export function getInitialBalanceConfigurationListSuccess(data) {
    return action(GET_INITIAL_BALANCE_CONFIGURATION_LIST_SUCCESS, { data })
}

// Redux action for Get initial balance configuration Failure
export function getInitialBalanceConfigurationListFailure() {
    return action(GET_INITIAL_BALANCE_CONFIGURATION_LIST_FAILURE)
}

// Redux action for Add initial balance configuration
export function addInitialBalance(payload = {}) {
    return action(ADD_INITIAL_BALANCE_CONFIGURATION, { payload })
}

// Redux action for Add initial balance configuration Success
export function addInitialBalanceSuccess(data) {
    return action(ADD_INITIAL_BALANCE_CONFIGURATION_SUCCESS, { data })
}

// Redux action for Add initial balance configuration Failure
export function addInitialBalanceFailure() {
    return action(ADD_INITIAL_BALANCE_CONFIGURATION_FAILURE)
}

// Redux action for Clear initial balance configuration Data
export function clearInitialBalanceConfigurationData() {
    return action(CLEAR_INITIAL_BALANCE_CONFIGURATION_DATA)
}