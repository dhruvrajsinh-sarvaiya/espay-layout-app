import {
    // Get Margin Profit Loss
    GET_MARGIN_PROFIT_LOSS_DATA,
    GET_MARGIN_PROFIT_LOSS_DATA_SUCCESS,
    GET_MARGIN_PROFIT_LOSS_DATA_FAILURE,
} from '../ActionTypes'

import { action } from '../GlobalActions';

// Redux action to Get Margin Profit Loss Data
export function getMarginProfitLossData(payload) {
    return action(GET_MARGIN_PROFIT_LOSS_DATA, { payload })
}
// Redux action to Get Margin Profit Loss Data Success
export function getMarginProfitLossDataSuccess(data) {
    return action(GET_MARGIN_PROFIT_LOSS_DATA_SUCCESS, { data })
}
// Redux action to Get Margin Profit Loss Data Failure
export function getMarginProfitLossDataFailure() {
    return action(GET_MARGIN_PROFIT_LOSS_DATA_FAILURE)
}
