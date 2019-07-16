import { action } from '../../GlobalActions';
import {
    // Get Top Gainer Loser Data
    GET_TOP_GAINERS_LOSERS_DATA,
    GET_TOP_GAINERS_LOSERS_DATA_SUCCESS,
    GET_TOP_GAINERS_LOSERS_DATA_FAILURE,

    // Clear Top Gainer Loser Data
    CLEAR_TOP_GAINERS_LOSERS_DATA
} from '../../ActionTypes';

// Redux action to Get Top Gainers & Losers
export function getTopGainersLosersData() { return action(GET_TOP_GAINERS_LOSERS_DATA, {}) }

// Redux action to Get Top Gainers & Losers Success
export function getTopGainersLosersSuccess(payload) { return action(GET_TOP_GAINERS_LOSERS_DATA_SUCCESS, { payload }) }

// Redux action to Get Top Gainer & Losers Failure Result
export function getTopGainersLosersFailure(payload) { return action(GET_TOP_GAINERS_LOSERS_DATA_FAILURE, { payload }) }

// Redux action to Clear Top Gainer Loser Data
export function clearTopGainersLosersData() { return action(CLEAR_TOP_GAINERS_LOSERS_DATA) }