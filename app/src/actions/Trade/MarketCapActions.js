import {
    FETCH_MARKET_CAP,
    FETCH_MARKET_CAP_SUCCESS,
    FETCH_MARKET_CAP_FAILURE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

// Redux Actions for Currency Pair Detail
export function fetchMarketCap(payload) {
    return action(FETCH_MARKET_CAP, { payload })
}

// Redux Actions for Currency Pair Detail Success
export function marketCapSuccess(data) {
    return action(FETCH_MARKET_CAP_SUCCESS, { data })
}

// Redux Actions for Currency Pair Detail Failure
export function marketCapFailure() {
    return action(FETCH_MARKET_CAP_FAILURE)
}