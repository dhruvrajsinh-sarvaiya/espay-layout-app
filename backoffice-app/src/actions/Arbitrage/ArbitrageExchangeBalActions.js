import {
    // Get Arbitrage Exchange Balance List 
    GET_ARBI_EXCHANGE_BAL_LIST, 
    GET_ARBI_EXCHANGE_BAL_LIST_SUCCESS, 
    GET_ARBI_EXCHANGE_BAL_LIST_FAILURE,
    
    // Clear Arbitrage Exchange Balance Data
    CLEAR_ARBI_EXCHANGE_BAL_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Arbitrage Exchange Bal List
export function getArbitrageExchangeBalList(payload = {}) {
    return action(GET_ARBI_EXCHANGE_BAL_LIST, { payload })
}

// Redux action for Get Arbitrage Exchange Bal List Success
export function getArbitrageExchangeBalListSuccess(data) {
    return action(GET_ARBI_EXCHANGE_BAL_LIST_SUCCESS, { data })
}

// Redux action for Get Arbitrage Exchange Bal List Failure
export function getArbitrageExchangeBalListFailure() {
    return action(GET_ARBI_EXCHANGE_BAL_LIST_FAILURE)
}

// Redux action for Clear Arbitrage Exchange Bal Data
export function clearArbitrageExchangeBalData() {
    return action(CLEAR_ARBI_EXCHANGE_BAL_DATA)
}