// import neccessary action types
import {

    //user trade count
    GET_USER_TRADE_COUNT,
    GET_USER_TRADE_COUNT_SUCCESS,
    GET_USER_TRADE_COUNT_FAILURE,

    //user trade market type
    GET_TRADE_USER_MARKET_TYPE_COUNT,
    GET_TRADE_USER_MARKET_TYPE_COUNT_SUCCESS,
    GET_TRADE_USER_MARKET_TYPE_COUNT_FAILURE,

    //configuration count
    GET_CONFIGURATION_COUNT,
    GET_CONFIGURATION_COUNT_SUCCESS,
    GET_CONFIGURATION_COUNT_FAILURE,

    //trade summary count
    GET_TRADE_SUMMARY_COUNT,
    GET_TRADE_SUMMARY_COUNT_SUCCESS,
    GET_TRADE_SUMMARY_COUNT_FAILURE,

    //ledger count
    GET_LEDGER_COUNT,
    GET_LEDGER_COUNT_SUCCESS,
    GET_LEDGER_COUNT_FAILURE,

    //report dashboard count
    GET_REPORT_DASHBOARD_COUNT,
    GET_REPORT_DASHBOARD_COUNT_SUCCESS,
    GET_REPORT_DASHBOARD_COUNT_FAILURE,
    CLEAR_TRADE_USER_MARKET_TYPE_COUNT,
} from "../ActionTypes";

import { action } from '../GlobalActions';

//Redux action getUserTradeCount
export function getUserTradeCount(payload) { return action(GET_USER_TRADE_COUNT, { payload }); }
//Redux action getUserTradeCount success
export function getUserTradeCountSuccess(payload) { return action(GET_USER_TRADE_COUNT_SUCCESS, { payload }); }
//Redux action getUserTradeCount failure
export function getUserTradeCountFailure(error) { return action(GET_USER_TRADE_COUNT_FAILURE, { error }); }

//Redux action get trade user market summary count
export function getTradeUserMarketTypeCount(payload) { return action(GET_TRADE_USER_MARKET_TYPE_COUNT, { payload }); }
//Redux action get trade user market summary count success
export function getTradeUserMarketTypeCountSuccess(payload) { return action(GET_TRADE_USER_MARKET_TYPE_COUNT_SUCCESS, { payload }); }
//Redux action get trade user market summary count failure
export function getTradeUserMarketTypeCountFailure(error) { return action(GET_TRADE_USER_MARKET_TYPE_COUNT_FAILURE, { error }); }

//Redux action get configuration count
export function getConfigurationCount(payload) { return action(GET_CONFIGURATION_COUNT, { payload }); }
//Redux action get configuration count success
export function getConfigurationCountSuccess(payload) { return action(GET_CONFIGURATION_COUNT_SUCCESS, { payload }); }
//Redux action get configuration count failure
export function getConfigurationCountFailure(error) { return action(GET_CONFIGURATION_COUNT_FAILURE, { error }); }

//Redux action get trade summary count
export function getTradeSummaryCount(payload) { return action(GET_TRADE_SUMMARY_COUNT, { payload }); }
//Redux action get trade summary count success
export function getTradeSummaryCountSuccess(payload) { return action(GET_TRADE_SUMMARY_COUNT_SUCCESS, { payload }); }
//Redux action get trade summary count failure
export function getTradeSummaryCountFailure(error) { return action(GET_TRADE_SUMMARY_COUNT_FAILURE, { error }); }

//Redux action get ledger count
export function getLedgerCount() { return action(GET_LEDGER_COUNT); }
//Redux action get ledger count success
export function getLedgerCountSuccess(payload) { return action(GET_LEDGER_COUNT_SUCCESS, { payload }); }
//Redux action get ledger count failure
export function getLedgerCountFailure(error) { return action(GET_LEDGER_COUNT_FAILURE, { error }); }

//Redux action get report count
export function getReportCount() { return action(GET_REPORT_DASHBOARD_COUNT); }
//Redux action get report count success
export function getReportCountSuccess(payload) { return action(GET_REPORT_DASHBOARD_COUNT_SUCCESS, { payload }); }
//Redux action get report count failure
export function getReportCountFailure(error) { return action(GET_REPORT_DASHBOARD_COUNT_FAILURE, { error }); }

//Redux action for Clear Market User Count
export function clearTradeMarketCount() { return action(CLEAR_TRADE_USER_MARKET_TYPE_COUNT); }