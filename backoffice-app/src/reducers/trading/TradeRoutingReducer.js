import {
    //trading summary LP wise
    GET_TRADING_SUMMARY_LPWISE_LIST,
    GET_TRADING_SUMMARY_LPWISE_LIST_SUCCESS,
    GET_TRADING_SUMMARY_LPWISE_LIST_FAILURE,

    //clear data
    CLEAR_TRADING_SUMMARY_LPWISE_LIST,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {
    //Trading Summary List
    tradeSummaryLPWiseData: null,
    isFetchingTradeSummaryLPWise: false,
    errorTradeSummaryLPWise: false,
}

export default function TradeRoutingReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case CLEAR_TRADING_SUMMARY_LPWISE_LIST:
            return initialState

        // Handle Data Of Trade Summary LPWise Data List
        case GET_TRADING_SUMMARY_LPWISE_LIST:
            return Object.assign({}, state, {
                tradeSummaryLPWiseData: null,
                isFetchingTradeSummaryLPWise: true,
                errorTradeSummaryLPWise: false,
            });

        // set Data Of Trade Summary LPWise Data List
        case GET_TRADING_SUMMARY_LPWISE_LIST_SUCCESS:
            return Object.assign({}, state, {
                tradeSummaryLPWiseData: action.payload,
                isFetchingTradeSummaryLPWise: false,
                errorTradeSummaryLPWise: false
            });

        // Display Error for Trade Summary List failure
        case GET_TRADING_SUMMARY_LPWISE_LIST_FAILURE:
            return Object.assign({}, state, {
                tradeSummaryLPWiseData: null,
                isFetchingTradeSummaryLPWise: false,
                errorTradeSummaryLPWise: true,
            });

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}