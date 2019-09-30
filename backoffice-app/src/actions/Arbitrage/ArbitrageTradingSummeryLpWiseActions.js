// ArbitrageTradingSummeryLpWiseActions.js
import {
    // for get arbitrage trading summery lp wise list 
    GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST,
    GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_SUCCESS,
    GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_FAILURE,

    // for clear arbitrage trading summery lp wise
    CLEAR_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST
} from '../ActionTypes';
import { action } from '../GlobalActions'

// Redux action for get arbitrage trading summery lp wise list
export function getArbitrageTradingSummeryList(payload = {}) {
    return action(GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST, { payload })
}

// Redux action for Get arbitrage trading summery lp wise list Success
export function getArbitrageTradingSummeryListSuccess(data) {
    return action(GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_SUCCESS, { data })
}

// Redux action for Get arbitrage trading summery lp wise list Failure
export function getArbitrageTradingSummeryListFailure() {
    return action(GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_FAILURE)
}

// Redux action for Clear arbitrage trading summery lp wise Data
export function clearArbitrageTradingSummeryListData() {
    return action(CLEAR_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST)
}