import {
    //For trade summary list
    GET_TRADE_SUMMARY_LIST,
    GET_TRADE_SUMMARY_LIST_SUCCESS,
    GET_TRADE_SUMMARY_LIST_FAILURE,

    //For trade settled list
    GET_TRADE_SETTLED_LIST,
    GET_TRADE_SETTLED_LIST_SUCCESS,
    GET_TRADE_SETTLED_LIST_FAILURE,

    //clear data
    CLEAR_ALL_TRADE_LIST,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {
    //Trading Summary List
    tradeSummaryData: null,
    isFetchingTradeSummary: false,
    errorTradeSummary: false,

    //Trade Settled List
    tradeSettledData: null,
    isLoadingTradeSettled: false,
    errorTradeSettled: false,
}

export default function tradingSummaryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case CLEAR_ALL_TRADE_LIST:
            return initialState;

        // Handle Data Of Trade Summary List
        case GET_TRADE_SUMMARY_LIST:
            return Object.assign({}, state, {
                tradeSummaryData: null,
                isFetchingTradeSummary: true
            });

        // set Data Of Trade Summary List
        case GET_TRADE_SUMMARY_LIST_SUCCESS:
            return Object.assign({}, state, {
                tradeSummaryData: action.payload,
                isFetchingTradeSummary: false
            });

        // Display Error for Trade Summary List failure
        case GET_TRADE_SUMMARY_LIST_FAILURE:
            return Object.assign({}, state, {
                tradeSummaryData: null,
                isFetchingTradeSummary: false,
                errorTradeSummary: false,
            });

        //Handle Trade Settled
        case GET_TRADE_SETTLED_LIST:
            return Object.assign({}, state, {
                tradeSettledData: null,
                isLoadingTradeSettled: true,
                errorTradeSettled: false
            });
        //Set Trade Settled success
        case GET_TRADE_SETTLED_LIST_SUCCESS:
            return Object.assign({}, state, {
                tradeSettledData: action.payload,
                isLoadingTradeSettled: false,
                errorTradeSettled: false
            });
        //Set Trade Settled failure
        case GET_TRADE_SETTLED_LIST_FAILURE:
            return Object.assign({}, state, {
                tradeSettledData: null,
                isLoadingTradeSettled: false,
                errorTradeSettled: true
            });

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}