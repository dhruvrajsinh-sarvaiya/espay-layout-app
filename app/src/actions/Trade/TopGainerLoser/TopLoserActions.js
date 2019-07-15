import { action } from '../../GlobalActions';
import {
    // Get Top Losers Data
    GET_TOP_LOSERS_DATA,
    GET_TOP_LOSERS_DATA_SUCCESS,
    GET_TOP_LOSERS_DATA_FAILURE
} from '../../ActionTypes';

// Redux action to Get Top Gainers
export function getTopLosersData(payload) { return action(GET_TOP_LOSERS_DATA, { payload }) }

// Redux action to Get Top Losers Success
export function getTopLosersSuccess(payload) { return action(GET_TOP_LOSERS_DATA_SUCCESS, { payload }) }

// Redux action to Get Top Losers Failure
export function getTopLosersFailure(payload) { return action(GET_TOP_LOSERS_DATA_FAILURE, { payload }) }