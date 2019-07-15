import {
    // Get Currency Balance
    GET_CURRENCY_BALANCE,
    GET_CURRENCY_BALANCE_SUCCESS,
    GET_CURRENCY_BALANCE_FAILURE
} from '../ActionTypes';

import { action } from '../GlobalActions';

// Redux action to Get Currency Balance
export function getCurrencyBalance() { return action(GET_CURRENCY_BALANCE); }

// Redux action to Get Currency Balance Succsee
export function getCurrencyBalanceSuccess(data) { return action(GET_CURRENCY_BALANCE_SUCCESS, { data }); }

// Redux action to Get Currency Balance Failure
export function getCurrencyBalanceFailure(error) { return action(GET_CURRENCY_BALANCE_FAILURE, { error }); }