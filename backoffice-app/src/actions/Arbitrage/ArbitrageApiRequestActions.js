// ArbitrageApiRequestActions
import {
    // for get list of Arbitrage Api Request
    GET_ARBITRAGE_API_REQUEST_LIST,
    GET_ARBITRAGE_API_REQUEST_LIST_SUCCESS,
    GET_ARBITRAGE_API_REQUEST_LIST_FAILURE,

    // for Add  Arbitrage Api Request
    ADD_ARBITRAGE_API_REQUEST_LIST,
    ADD_ARBITRAGE_API_REQUEST_LIST_SUCCESS,
    ADD_ARBITRAGE_API_REQUEST_LIST_FAILURE,

    // for Update Arbitrage Api Request
    UPDATE_ARBITRAGE_API_REQUEST_LIST,
    UPDATE_ARBITRAGE_API_REQUEST_LIST_SUCCESS,
    UPDATE_ARBITRAGE_API_REQUEST_LIST_FAILURE,

    // clear Arbitrage Api Request Data
    CLEAR_ARBITRAGE_API_REQUEST_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Arbitrage Api Request
export function getArbitrageApiRequest(payload = {}) {
    return action(GET_ARBITRAGE_API_REQUEST_LIST, { payload })
}

// Redux action for Get Arbitrage Api Request Success
export function getArbitrageApiRequestSuccess(data) {
    return action(GET_ARBITRAGE_API_REQUEST_LIST_SUCCESS, { data })
}

// Redux action for GetArbitrage Api Request Failure
export function getArbitrageApiRequestFailure() {
    return action(GET_ARBITRAGE_API_REQUEST_LIST_FAILURE)
}

// Redux action for Add Arbitrage Api Request
export function addArbitrageApiRequest(payload = {}) {
    return action(ADD_ARBITRAGE_API_REQUEST_LIST, { payload })
}

// Redux action for Add Arbitrage Api Request Success
export function addArbitrageApiRequestSuccess(data) {
    return action(ADD_ARBITRAGE_API_REQUEST_LIST_SUCCESS, { data })
}

// Redux action for Add Arbitrage Api Request Failure
export function addArbitrageApiRequestFailure() {
    return action(ADD_ARBITRAGE_API_REQUEST_LIST_FAILURE)
}

// Redux action for Update Arbitrage Api Request
export function updateArbitrageApiRequest(payload = {}) {
    return action(UPDATE_ARBITRAGE_API_REQUEST_LIST, { payload })
}

// Redux action for Update Arbitrage Api Request Success
export function updateArbitrageApiRequestSuccess(data) {
    return action(UPDATE_ARBITRAGE_API_REQUEST_LIST_SUCCESS, { data })
}

// Redux action for Update Arbitrage Api Request Failure
export function updateArbitrageApiRequestFailure() {
    return action(UPDATE_ARBITRAGE_API_REQUEST_LIST_FAILURE)
}

// Redux action for Clear Arbitrage Api Request
export function clearArbitrageApiRequestData() {
    return action(CLEAR_ARBITRAGE_API_REQUEST_DATA)
}