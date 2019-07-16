import {
    // Get Trade Settled Data
    GET_TRADE_SETTLED_DATA,
    GET_TRADE_SETTLED_DATA_SUCCESS,
    GET_TRADE_SETTLED_DATA_FAILURE,

    // Clear Trade Settled Data
    CLEAR_TRADE_SETTLED_DATA
} from '../ActionTypes';

import { action } from '../GlobalActions';

//Redux action To get Trade Settled history
export function getTradeSettledData(payload) { return action(GET_TRADE_SETTLED_DATA, { payload }); }

//Redux action To get Trade Settled history Success
export function getTradeSettledSuccess(payload) { return action(GET_TRADE_SETTLED_DATA_SUCCESS, { payload }); }

//Redux action To get Trade Settled history Failure
export function getTradeSettledFailure(error) { return action(GET_TRADE_SETTLED_DATA_FAILURE, { error }); }

// Redux action to clear Trade Settled
export function clearTradeSettled() { return action(CLEAR_TRADE_SETTLED_DATA); }