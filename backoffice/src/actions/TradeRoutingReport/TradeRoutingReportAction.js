// Actions for Get Trade Rout Reoprt list By Tejas 25/3/2019

import {
    //list
    GET_TRADE_ROUTING_REPORT_LIST,
    GET_TRADE_ROUTING_REPORT_LIST_SUCCESS,
    GET_TRADE_ROUTING_REPORT_LIST_FAILURE,

} from "../types";

//LIST METHODS
export const getTradeRoutingReport = (Data) => ({
    type: GET_TRADE_ROUTING_REPORT_LIST,
    payload: { Data }
});
export const getTradeRoutingReportSuccess = response => ({
    type: GET_TRADE_ROUTING_REPORT_LIST_SUCCESS,
    payload: response.Response
});
export const getTradeRoutingReportFailure = error => ({
    type: GET_TRADE_ROUTING_REPORT_LIST_FAILURE,
    payload: error
});
