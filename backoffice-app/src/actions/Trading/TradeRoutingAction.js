import { action } from '../GlobalActions';
import {
    //trading summary LP wise
    GET_TRADING_SUMMARY_LPWISE_LIST,
    GET_TRADING_SUMMARY_LPWISE_LIST_SUCCESS,
    GET_TRADING_SUMMARY_LPWISE_LIST_FAILURE,

    //clear data
    CLEAR_TRADING_SUMMARY_LPWISE_LIST,
} from "../ActionTypes";

//Redux action For Trading summary LP wise
export function getTradingSummaryLPWiseList(payload) { return action(GET_TRADING_SUMMARY_LPWISE_LIST, { payload }); }
//Redux action For Trading summary LP wise success
export function getTradingSummaryLPWiseListSuccess(payload) { return action(GET_TRADING_SUMMARY_LPWISE_LIST_SUCCESS, { payload }); }
//Redux action For Trading summary LP wise failure
export function getTradingSummaryLPWiseListFailure() { return action(GET_TRADING_SUMMARY_LPWISE_LIST_FAILURE); }

//clear data
export function clearTradingSummaryLPWiseList() { return action(CLEAR_TRADING_SUMMARY_LPWISE_LIST); }