import { action } from "../GlobalActions";
import {
    // Get Market Depth Data
    GET_MARKET_DEPTH_DATA,
    GET_MARKET_DEPTH_DATA_SUCCESS,
    GET_MARKET_DEPTH_DATA_FAILURE,

    // Clear Market Depth Data
    CLEAR_MARKET_DEPTH_DATA
} from "../ActionTypes";

// Redux action To get Market Depth chart list
export function getMarketDepthData(payload) {
    return action(GET_MARKET_DEPTH_DATA, { payload });
}

// Redux action To get Market Depth chart list Success
export function getMarketDepthDataSuccess(payload) {
    return action(GET_MARKET_DEPTH_DATA_SUCCESS, { payload });
}

// Redux action To get Market Depth chart list Failure
export function getMarketDepthDataFailure() {
    return action(GET_MARKET_DEPTH_DATA_FAILURE);
}

// Redux action to clear Market Depth Data
export function clearMarketDepthData() {
    return action(CLEAR_MARKET_DEPTH_DATA);
}