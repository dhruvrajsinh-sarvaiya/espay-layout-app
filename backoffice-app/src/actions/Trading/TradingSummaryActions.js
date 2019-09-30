import { action } from '../GlobalActions';
import {
    //trading summary list
    GET_TRADE_SUMMARY_LIST,
    GET_TRADE_SUMMARY_LIST_SUCCESS,
    GET_TRADE_SUMMARY_LIST_FAILURE,

    //trading settled history
    GET_TRADE_SETTLED_LIST,
    GET_TRADE_SETTLED_LIST_SUCCESS,
    GET_TRADE_SETTLED_LIST_FAILURE,

    //clear data
    CLEAR_ALL_TRADE_LIST,
} from "../ActionTypes";

//Redux action To get trading summary list
export function getTradeSummaryList(payload) { return action(GET_TRADE_SUMMARY_LIST, { payload }); }
//Redux action To get trading summary list success
export function getTradeSummaryListSuccess(payload) { return action(GET_TRADE_SUMMARY_LIST_SUCCESS, { payload }); }
//Redux action To get trading summary list failure
export function getTradeSummaryListFailure() { return action(GET_TRADE_SUMMARY_LIST_FAILURE); }

//Redux action To get trading settled history
export function getTradingSettledList(payload) { return action(GET_TRADE_SETTLED_LIST, { payload }); }
//Redux action To get trading settled history success
export function getTradingSettledListSuccess(payload) { return action(GET_TRADE_SETTLED_LIST_SUCCESS, { payload }); }
//Redux action To get trading settled history failure
export function getTradingSettledListFailure() { return action(GET_TRADE_SETTLED_LIST_FAILURE); }

//clear data
export function clearAllTradeList() { return action(CLEAR_ALL_TRADE_LIST); }