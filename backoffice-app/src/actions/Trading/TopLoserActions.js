import { action } from '../GlobalActions';
import { GET_TOP_LOSERS_DATA, GET_TOP_LOSERS_DATA_SUCCESS, GET_TOP_LOSERS_DATA_FAILURE, CLEAR_TOP_LOSER_DATA } from '../ActionTypes';

// Reduxe action for Top Gainers
export function getTopLosersData(payload) { return action(GET_TOP_LOSERS_DATA, { payload }) }

// Reduxe action for Top Losers Success Result
export function getTopLosersSuccess(payload) { return action(GET_TOP_LOSERS_DATA_SUCCESS, { payload }) }

//Reduxe action for Top Losers Failure Result
export function getTopLosersFailure(payload) { return action(GET_TOP_LOSERS_DATA_FAILURE, { payload }) }

//Reduxe action for Clear Top Losers 
export function clearTopLoserData() { return action(CLEAR_TOP_LOSER_DATA) }