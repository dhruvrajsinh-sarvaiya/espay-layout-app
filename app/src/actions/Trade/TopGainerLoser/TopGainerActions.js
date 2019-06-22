import { action } from '../../GlobalActions';
import {
    // Get Top Gainer Data
    GET_TOP_GAINERS_DATA,
    GET_TOP_GAINERS_DATA_SUCCESS,
    GET_TOP_GAINERS_DATA_FAILURE
} from '../../ActionTypes';

// Redux action to Get Top Gainer Data
export function getTopGainersData(payload) { return action(GET_TOP_GAINERS_DATA, { payload }) }

// Redux action to Get Top Gainer Success
export function getTopGainersSuccess(payload) { return action(GET_TOP_GAINERS_DATA_SUCCESS, { payload }) }

// Redux action to Get Top Gainer Failure
export function getTopGainersFailure(payload) { return action(GET_TOP_GAINERS_DATA_FAILURE, { payload }) }