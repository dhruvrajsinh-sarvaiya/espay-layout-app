import { action } from '../GlobalActions';
import { GET_TOP_GAINERS_LOSERS_DATA, GET_TOP_GAINERS_LOSERS_DATA_SUCCESS, GET_TOP_GAINERS_LOSERS_DATA_FAILURE, CLEAR_TOP_GAINERS_LOSERS_DATA } from '../ActionTypes';

//Top Gainers & Losers
export function getTopGainersLosersData(payload) { return action(GET_TOP_GAINERS_LOSERS_DATA, {payload}) }

//Top Gainers & Losers Success Result
export function getTopGainersLosersSuccess(payload) { return action(GET_TOP_GAINERS_LOSERS_DATA_SUCCESS, { payload }) }

//Top Gainer & Losers Failure Result
export function getTopGainersLosersFailure(payload) { return action(GET_TOP_GAINERS_LOSERS_DATA_FAILURE, { payload }) }

// To clear Top Gainer Loser Data
export function clearTopGainersLosersData() { return action(CLEAR_TOP_GAINERS_LOSERS_DATA) }