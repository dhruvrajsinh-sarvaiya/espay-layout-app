import {
    //User Trade Count
    GET_USER_TRADE_COUNT,
    GET_USER_TRADE_COUNT_SUCCESS,
    GET_USER_TRADE_COUNT_FAILURE,

    //Trade User Market Type Count
    GET_TRADE_USER_MARKET_TYPE_COUNT,
    GET_TRADE_USER_MARKET_TYPE_COUNT_SUCCESS,
    GET_TRADE_USER_MARKET_TYPE_COUNT_FAILURE,

    //Configuration Count
    GET_CONFIGURATION_COUNT,
    GET_CONFIGURATION_COUNT_SUCCESS,
    GET_CONFIGURATION_COUNT_FAILURE,

    //Trade Summary Count
    GET_TRADE_SUMMARY_COUNT,
    GET_TRADE_SUMMARY_COUNT_SUCCESS,
    GET_TRADE_SUMMARY_COUNT_FAILURE,

    //Ledger Count
    GET_LEDGER_COUNT,
    GET_LEDGER_COUNT_SUCCESS,
    GET_LEDGER_COUNT_FAILURE,

    //clear data
    ACTION_LOGOUT,

    //Report Count
    GET_REPORT_DASHBOARD_COUNT,
    GET_REPORT_DASHBOARD_COUNT_SUCCESS,
    GET_REPORT_DASHBOARD_COUNT_FAILURE,

    // Clear Trade Market Count
    CLEAR_TRADE_USER_MARKET_TYPE_COUNT
} from '../../actions/ActionTypes';

const initialState = {

    //User Trade Count
    userTradeCount: null,
    isUserTradeCountLoading: false,
    userTradeCountError: false,

    //Trade User Market Type Count
    tradeUserMarketTypeCount: null,
    isLoadingTradeUserMarketType: false,
    tradeUserMarketTypeCountError: false,

    //Configuration Count
    configurationCount: null,
    isConfigurationCountLoading: false,
    configurationCountError: false,

    //Trade Summary Count
    tradeSummaryCount: null,
    isTradeSummaryLoading: false,
    tradeSummaryCountError: false,

    //Ledger Count
    ledgerCount: null,
    isLedgerCountLoading: false,
    ledgerCountError: false,

    //Report Count
    reportCount: null,
    isReportCountLoading: false,
    reportCountError: false,
}

export default function TradingDashboardReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        //handle User Trade Counts
        case GET_USER_TRADE_COUNT: {
            return Object.assign({}, state, {
                userTradeCount: null,
                isUserTradeCountLoading: true,
                userTradeCountError: false,
            })
        }
        //Set User Trade Counts success
        case GET_USER_TRADE_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                userTradeCount: action.payload,
                isUserTradeCountLoading: false,
                userTradeCountError: false
            })
        }
        //Set User Trade Counts failure
        case GET_USER_TRADE_COUNT_FAILURE: {
            return Object.assign({}, state, {
                userTradeCount: null,
                isUserTradeCountLoading: false,
                userTradeCountError: true
            })
        }

        //Handle Trade User Market Type Count
        case GET_TRADE_USER_MARKET_TYPE_COUNT: {
            return Object.assign({}, state, {
                tradeUserMarketTypeCount: null,
                isLoadingTradeUserMarketType: true,
                tradeUserMarketTypeCountError: false,
            })
        }
        //Set Trade User Market Type Count Success
        case GET_TRADE_USER_MARKET_TYPE_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                tradeUserMarketTypeCount: action.payload,
                isLoadingTradeUserMarketType: false,
                tradeUserMarketTypeCountError: false
            })
        }
        //Set Trade User Market Type Count Failure
        case GET_TRADE_USER_MARKET_TYPE_COUNT_FAILURE: {
            return Object.assign({}, state, {
                tradeUserMarketTypeCount: null,
                isLoadingTradeUserMarketType: false,
                tradeUserMarketTypeCountError: true
            })
        }

        //Handle Configuration Counts
        case GET_CONFIGURATION_COUNT: {
            return Object.assign({}, state, {
                configurationCount: null,
                isConfigurationCountLoading: true,
                configurationCountError: false,
            })
        }
        //Set Configuration Counts success
        case GET_CONFIGURATION_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                configurationCount: action.payload,
                isConfigurationCountLoading: false,
                configurationCountError: false
            })
        }
        //Set Configuration Counts failure
        case GET_CONFIGURATION_COUNT_FAILURE: {
            return Object.assign({}, state, {
                configurationCount: null,
                isConfigurationCountLoading: false,
                configurationCountError: true
            })
        }

        //Handle Trade Summary Count
        case GET_TRADE_SUMMARY_COUNT: {
            return Object.assign({}, state, {
                tradeSummaryCount: null,
                isTradeSummaryLoading: true,
                tradeSummaryCountError: false,
            })
        }
        //Set Trade Summary Count success
        case GET_TRADE_SUMMARY_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                tradeSummaryCount: action.payload,
                isTradeSummaryLoading: false,
                tradeSummaryCountError: false
            })
        }
        //Set Trade Summary Count failure
        case GET_TRADE_SUMMARY_COUNT_FAILURE: {
            return Object.assign({}, state, {
                tradeSummaryCount: null,
                isTradeSummaryLoading: false,
                tradeSummaryCountError: true
            })
        }

        //Handel Ledger Count
        case GET_LEDGER_COUNT: {
            return Object.assign({}, state, {
                ledgerCount: null,
                isLedgerCountLoading: true,
                ledgerCountError: false,
            })
        }
        //Set Ledger Count succeess
        case GET_LEDGER_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                ledgerCount: action.payload,
                isLedgerCountLoading: false,
                ledgerCountError: false
            })
        }
        //Set Ledger Count failure
        case GET_LEDGER_COUNT_FAILURE: {
            return Object.assign({}, state, {
                ledgerCount: null,
                isLedgerCountLoading: false,
                ledgerCountError: true
            })
        }

        //Handle Report Count
        case GET_REPORT_DASHBOARD_COUNT: {
            return Object.assign({}, state, {
                reportCount: null,
                isReportCountLoading: true,
                reportCountError: false,
            })
        }
        //Set Report Count success
        case GET_REPORT_DASHBOARD_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                reportCount: action.payload,
                isReportCountLoading: false,
                reportCountError: false
            })
        }
        //Set Report Count failure
        case GET_REPORT_DASHBOARD_COUNT_FAILURE: {
            return Object.assign({}, state, {
                reportCount: null,
                isReportCountLoading: false,
                reportCountError: true
            })
        }

        // Clear Trade Market Count
        case CLEAR_TRADE_USER_MARKET_TYPE_COUNT: {
            return Object.assign({}, state, {
                tradeUserMarketTypeCount: null
            })
        }
        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}