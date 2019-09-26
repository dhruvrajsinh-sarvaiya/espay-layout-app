// SiteTokenConversionReportReducer
import {
    // for get token Currency data
    GET_BASE_MARKET_DATA,
    GET_BASE_MARKET_DATA_SUCCESS,
    GET_BASE_MARKET_DATA_FAILURE,

    // for sitetokenReport
    GET_SITETOKEN_REPORT_DATA,
    GET_SITETOKEN_REPORT_DATA_SUCCESS,
    GET_SITETOKEN_REPORT_DATA_FAILURE,

    //clear data
    ACTION_LOGOUT,
    GET_SITETOKEN_REPORT_DATA_CLEAR
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of Token Currency
    isTokenCurrencyfetch: false,
    TokenCurrencyData: null,
    TokenCurrencyDataFetch: true,

    // for SiteTokenReport
    isSiteTokenReportfetch: false,
    SiteTokenReportData: null,
    SiteTokenReportDataFetch: true,
}

export default function SiteTokenConversionReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case GET_SITETOKEN_REPORT_DATA_CLEAR:
            return initialState

        //Handle base market method data
        case GET_BASE_MARKET_DATA:
            return Object.assign({}, state, {
                isTokenCurrencyfetch: true,
                TokenCurrencyData: null,
                TokenCurrencyDataFetch: true,
            })
        //Set base market method success data 
        case GET_BASE_MARKET_DATA_SUCCESS:
            return Object.assign({}, state, {
                isTokenCurrencyfetch: false,
                TokenCurrencyData: action.data,
                TokenCurrencyDataFetch: false,
            })
        //Set base market method failure data
        case GET_BASE_MARKET_DATA_FAILURE:
            return Object.assign({}, state, {
                isTokenCurrencyfetch: false,
                TokenCurrencyData: null,
                TokenCurrencyDataFetch: false,
            })

        //Handle site token report method
        case GET_SITETOKEN_REPORT_DATA:
            return Object.assign({}, state, {
                isSiteTokenReportfetch: true,
                SiteTokenReportData: null,
                SiteTokenReportDataFetch: true,
            })
        //Set site token report method success
        case GET_SITETOKEN_REPORT_DATA_SUCCESS:
            return Object.assign({}, state, {
                isSiteTokenReportfetch: false,
                SiteTokenReportData: action.data,
                SiteTokenReportDataFetch: false,
            })
        //Set site token report method failure
        case GET_SITETOKEN_REPORT_DATA_FAILURE:
            return Object.assign({}, state, {
                isSiteTokenReportfetch: false,
                SiteTokenReportData: null,
                SiteTokenReportDataFetch: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}