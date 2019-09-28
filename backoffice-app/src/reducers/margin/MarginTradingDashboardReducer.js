import {
    // Get User Trade Count
    GET_USER_TRADE_COUNT,
    GET_USER_TRADE_COUNT_SUCCESS,
    GET_USER_TRADE_COUNT_FAILURE,

    // Get Configuration Count
    GET_CONFIGURATION_COUNT,
    GET_CONFIGURATION_COUNT_SUCCESS,
    GET_CONFIGURATION_COUNT_FAILURE,

    // Get Trade Summary Count
    GET_TRADE_SUMMARY_COUNT,
    GET_TRADE_SUMMARY_COUNT_SUCCESS,
    GET_TRADE_SUMMARY_COUNT_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const INITIAL_STATE = {

    //User Trade Count
    userTradeCount: null,
    isUserTradeCountLoading: false,
    userTradeCountError: false,

    //Configuration Count
    configurationCount: null,
    isConfigurationCountLoading: false,
    configurationCountError: false,

    //Trade Summary Count
    tradeSummaryCount: null,
    isTradeSummaryLoading: false,
    tradeSummaryCountError: false,
}

export default function MarginTradingDashboardReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle User Trade Count method data
        case GET_USER_TRADE_COUNT: {
            return Object.assign({}, state, {
                userTradeCount: null,
                isUserTradeCountLoading: true,
                userTradeCountError: false,
            })
        }
        // Set User Trade Count success data
        case GET_USER_TRADE_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                userTradeCount: action.payload,
                isUserTradeCountLoading: false,
                userTradeCountError: false
            })
        }
        // Set User Trade Count failure data
        case GET_USER_TRADE_COUNT_FAILURE: {
            return Object.assign({}, state, {
                userTradeCount: null,
                isUserTradeCountLoading: false,
                userTradeCountError: true
            })
        }

        // Handle Configuration Counts method data
        case GET_CONFIGURATION_COUNT: {
            return Object.assign({}, state, {
                configurationCount: null,
                isConfigurationCountLoading: true,
                configurationCountError: false,
            })
        }
        // Set Configuration Counts success data
        case GET_CONFIGURATION_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                configurationCount: action.payload,
                isConfigurationCountLoading: false,
                configurationCountError: false
            })
        }
        // Set Configuration Counts failure data
        case GET_CONFIGURATION_COUNT_FAILURE: {
            return Object.assign({}, state, {
                configurationCount: null,
                isConfigurationCountLoading: false,
                configurationCountError: true
            })
        }

        // Handle Trade Summary Count method data
        case GET_TRADE_SUMMARY_COUNT: {
            return Object.assign({}, state, {
                tradeSummaryCount: null,
                isTradeSummaryLoading: true,
                tradeSummaryCountError: false,
            })
        }
        // Get Trade Summary Count success data
        case GET_TRADE_SUMMARY_COUNT_SUCCESS: {
            return Object.assign({}, state, {
                tradeSummaryCount: action.payload,
                isTradeSummaryLoading: false,
                tradeSummaryCountError: false
            })
        }
        // Get Trade Summary Count failure data
        case GET_TRADE_SUMMARY_COUNT_FAILURE: {
            return Object.assign({}, state, {
                tradeSummaryCount: null,
                isTradeSummaryLoading: false,
                tradeSummaryCountError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}