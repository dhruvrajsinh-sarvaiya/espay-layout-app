// ArbitrageCoinConfigurationActions
import {
    // for arbitrage coin configuration List
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST,
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST_SUCCESS,
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST_FAILURE,

    // for Add Arbitrage coin configuration
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA,
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS,
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE,

    // for Update Arbitrage Coin Configuration
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA,
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS,
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE,

    // for clear coin configuration data
    CLEAR_ARBITRAGE_COIN_CONFIGURATION_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions'

// Redux action for Get arbitrage coin configuration List
export function getArbiCoinConfigurationList(payload = {}) {
    return action(GET_ARBITRAGE_COIN_CONFIGURATION_LIST, { payload })
}

// Redux action for Get arbitrage coin configuration List Success
export function getArbiCoinConfigurationListSuccess(data) {
    return action(GET_ARBITRAGE_COIN_CONFIGURATION_LIST_SUCCESS, { data })
}

// Redux action for Get arbitrage coin configuration List Failure
export function getArbiCoinConfigurationListFailure() {
    return action(GET_ARBITRAGE_COIN_CONFIGURATION_LIST_FAILURE)
}

// Redux action for Add arbitrage coin configuration List
export function addArbiCoinConfigurationListData(payload = {}) {
    return action(ADD_ARBITRAGE_COIN_CONFIGURATION_DATA, { payload })
}

// Redux action for Add arbitrage coin configuration List Success
export function addArbiCoinConfigurationListDataSuccess(data) {
    return action(ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS, { data })
}

// Redux action for Add arbitrage coin configuration List Failure
export function addArbiCoinConfigurationListDataFailure() {
    return action(ADD_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE)
}

// Redux action for update arbitrage coin configuration List
export function updateArbiCoinConfigurationListData(payload = {}) {
    return action(UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA, { payload })
}

// Redux action for update arbitrage coin configuration List Success
export function updateArbiCoinConfigurationListDataSuccess(data) {
    return action(UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_SUCCESS, { data })
}

// Redux action for Add arbitrage coin configuration List Failure
export function updateArbiCoinConfigurationListDataFailure() {
    return action(UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA_FAILURE)
}

// Redux action for Clear arbitrage coin configuration
export function clearArbiCoinConfigurationData() {
    return action(CLEAR_ARBITRAGE_COIN_CONFIGURATION_DATA)
}