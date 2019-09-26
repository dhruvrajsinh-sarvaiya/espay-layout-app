import { action } from '../GlobalActions';
import { GET_TOP_GAINERS_DATA, GET_TOP_GAINERS_DATA_SUCCESS, GET_TOP_GAINERS_DATA_FAILURE, CLEAR_TOP_GAINER_DATA } from '../ActionTypes';

//Top Gainers
export function getTopGainersData(payload) { return action(GET_TOP_GAINERS_DATA, { payload }) }

//Top Gainer Success Result
export function getTopGainersSuccess(payload) { return action(GET_TOP_GAINERS_DATA_SUCCESS, { payload }) }

//Top Gainer Failure Result
export function getTopGainersFailure(payload) { return action(GET_TOP_GAINERS_DATA_FAILURE, { payload }) }

//Reduxe action for Clear Top Gainer 
export function clearTopGainerData() { return action(CLEAR_TOP_GAINER_DATA) }