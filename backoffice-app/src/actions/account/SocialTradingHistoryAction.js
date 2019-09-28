import {
    // Social Trading History list
    SOCIAL_TRADING_HISTORY_LIST,
    SOCIAL_TRADING_HISTORY_LIST_SUCCESS,
    SOCIAL_TRADING_HISTORY_LIST_FAILURE,

    //clear data
    CLEAR_SOCIAL_TRADING_HISTORY
} from "../ActionTypes";

import { action } from "../GlobalActions";

//Actions For socialTradingHistory List
export function socialTradingHistoryList(payload) { return action(SOCIAL_TRADING_HISTORY_LIST, { payload }); }

//Actions For socialTradingHistory List Success
export function socialTradingHistoryListSuccess(payload) { return action(SOCIAL_TRADING_HISTORY_LIST_SUCCESS, { payload }); }

//Actions For socialTradingHistory List Failure
export function socialTradingHistoryListFailure() { return action(SOCIAL_TRADING_HISTORY_LIST_FAILURE); }

//clear data
export function clearSocialTradingHistory() { return action(CLEAR_SOCIAL_TRADING_HISTORY); }




