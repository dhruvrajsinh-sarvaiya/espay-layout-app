import {
    // Get Pair Rates
    GET_PAIR_RATES,
    GET_PAIR_RATES_SUCCESS,
    GET_PAIR_RATES_FAILURE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

//For getting current price of selected currency, Method : GetPairRates
export function getPairRates(payload) { return action(GET_PAIR_RATES, { payload }); }

// Redux action to Get Pair Rates Success
export function getPairRatesSuccess(data) { return action(GET_PAIR_RATES_SUCCESS, { data }); }

// Redux action to Get Pair Rates Failure
export function getPairRatesFailure() { return action(GET_PAIR_RATES_FAILURE); }