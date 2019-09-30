// ArbitrageApiResponseActions
import {
    // for get list of Arbitrage Api Response
    GET_ARBITRAGE_API_RESPONSE_LIST,
    GET_ARBITRAGE_API_RESPONSE_LIST_SUCCESS,
    GET_ARBITRAGE_API_RESPONSE_LIST_FAILURE,

    // for Add Arbitrage Api Response
    ADD_ARBITRAGE_API_RESPONSE_LIST,
    ADD_ARBITRAGE_API_RESPONSE_LIST_SUCCESS,
    ADD_ARBITRAGE_API_RESPONSE_LIST_FAILURE,

    // for Update Arbitrage Api Response
    UPDATE_ARBITRAGE_API_RESPONSE_LIST,
    UPDATE_ARBITRAGE_API_RESPONSE_LIST_SUCCESS,
    UPDATE_ARBITRAGE_API_RESPONSE_LIST_FAILURE,

    // clear Arbitrage Api Response Data
    CLEAR_ARBITRAGE_API_RESPONSE_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Arbitrage Api Response
export function getArbitrageApiResponse(payload = {}) {
    return action(GET_ARBITRAGE_API_RESPONSE_LIST, { payload })
}

// Redux action for Get Arbitrage Api Response Success
export function getArbitrageApiResponseSuccess(data) {
    return action(GET_ARBITRAGE_API_RESPONSE_LIST_SUCCESS, { data })
}

// Redux action for GetArbitrage Api Response Failure
export function getArbitrageApiResponseFailure() {
    return action(GET_ARBITRAGE_API_RESPONSE_LIST_FAILURE)
}

// Redux action for Add Arbitrage Api Response
export function addArbitrageApiResponse(payload = {}) {
    return action(ADD_ARBITRAGE_API_RESPONSE_LIST, { payload })
}

// Redux action for Add Arbitrage Api Response Success
export function addArbitrageApiResponseSuccess(data) {
    return action(ADD_ARBITRAGE_API_RESPONSE_LIST_SUCCESS, { data })
}

// Redux action for Add Arbitrage Api Response Failure
export function addArbitrageApiResponseFailure() {
    return action(ADD_ARBITRAGE_API_RESPONSE_LIST_FAILURE)
}

// Redux action for Update Arbitrage Api Response
export function updateArbitrageApiResponse(payload = {}) {
    return action(UPDATE_ARBITRAGE_API_RESPONSE_LIST, { payload })
}

// Redux action for Update Arbitrage Api Response Success
export function updateArbitrageApiResponseSuccess(data) {
    return action(UPDATE_ARBITRAGE_API_RESPONSE_LIST_SUCCESS, { data })
}

// Redux action for Update Arbitrage Api Response Failure
export function updateArbitrageApiResponseFailure() {
    return action(UPDATE_ARBITRAGE_API_RESPONSE_LIST_FAILURE)
}

// Redux action for Clear Arbitrage Api Response
export function clearArbitrageApiResponseData() {
    return action(CLEAR_ARBITRAGE_API_RESPONSE_DATA)
}