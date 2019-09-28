import {
    //Base market data
    GET_BASE_MARKET_DATA,
    GET_BASE_MARKET_DATA_SUCCESS,
    GET_BASE_MARKET_DATA_FAILURE,

    //Site token report data
    GET_SITETOKEN_REPORT_DATA,
    GET_SITETOKEN_REPORT_DATA_SUCCESS,
    GET_SITETOKEN_REPORT_DATA_FAILURE,

    //clear data
    GET_SITETOKEN_REPORT_DATA_CLEAR,
} from '../ActionTypes';
import { action } from '../GlobalActions';

// --------------- for GET token Currency--------------
//To fetch data
export function getTokenCurrencyData() {
    return action(GET_BASE_MARKET_DATA)
}
//On success result
export function getTokenCurrencyDataSuccess(data) {
    return action(GET_BASE_MARKET_DATA_SUCCESS, { data })
}
//On Failure
export function getTokenCurrencyDataFailure() {
    return action(GET_BASE_MARKET_DATA_FAILURE)
}

// --------------- for GET SITE TOKEN REPORT DATA--------------
//To fetch data
export function getSiteTokenReportData(data) {
    //   console.warn("data in action:-"+ JSON.stringify(data))
    return action(GET_SITETOKEN_REPORT_DATA, { data })
}
//On success result
export function getSiteTokenReportDataSuccess(data) {
    return action(GET_SITETOKEN_REPORT_DATA_SUCCESS, { data })
}
//On Failure
export function getSiteTokenReportDataFailure() {
    return action(GET_SITETOKEN_REPORT_DATA_FAILURE)
}

//On Clear
export function getSiteTokenReportDataClear() {
    return action(GET_SITETOKEN_REPORT_DATA_CLEAR)
}