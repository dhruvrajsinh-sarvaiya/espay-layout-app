/**
 * Auther : Tejas Gauswami
 * Created : 03/06/2019
 * Arbitrage Reports Reducers
 */
import {
    //Trade History Report
    ARBITRAGE_TRADE_HISTORY_REPORT,
    ARBITRAGE_TRADE_HISTORY_REPORT_SUCCESS,
    ARBITRAGE_TRADE_HISTORY_REPORT_FAILURE,

    //Open Order Report
    ARBITRAGE_OPEN_ORDER_REPORT,
    ARBITRAGE_OPEN_ORDER_REPORT_SUCCESS,
    ARBITRAGE_OPEN_ORDER_REPORT_FAILURE,

    //Active Order Report
    ARBITRAGE_ACTIVE_ORDER_REPORT,
    ARBITRAGE_ACTIVE_ORDER_REPORT_SUCCESS,
    ARBITRAGE_ACTIVE_ORDER_REPORT_FAILURE,

    //Recent Order Report
    ARBITRAGE_RECENT_ORDER_REPORT,
    ARBITRAGE_RECENT_ORDER_REPORT_SUCCESS,
    ARBITRAGE_RECENT_ORDER_REPORT_FAILURE,

    //Get Chart Data
    ARBITRAGE_CHART_DATA,
    ARBITRAGE_CHART_DATA_SUCCESS,
    ARBITRAGE_CHART_DATA_FAILURE,

    // used for cancel order
    DO_CANCEL_ORDER_ARBITRAGE,
    DO_CANCEL_ORDER_ARBITRAGE_SUCCESS,
    DO_CANCEL_ORDER_ARBITRAGE_FAILURE,

    //MArket Trade History By Tejas 12/6/2019    
    ARBITRAGE_MARKET_TRADE_HISTORY,
    ARBITRAGE_MARKET_TRADE_HISTORY_SUCCESS,
    ARBITRAGE_MARKET_TRADE_HISTORY_FAILURE

} from 'Actions/types';

/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    tradeHistoryList: [],

    openOrderList: [],
    openOrderListLoading: false,
    openOrderListError: [],

    activeOrderList: [],
    recentOrderList: [],

    arbitrageChartData: [],
    arbitrageChartLoading: false,
    arbitrageChartError: [],

    cancelOrder: [],
    cancelOrderLoader: false,
    cancelOrderError: [],

    marketTradeHistoryList: [],
    marketTradeHistoryLoading: false,
    marketTradeHistoryError: []
}

//Check Action for Trade History List...
export default (state = INIT_STATE, action) => {

    switch (action.type) {
        //Trade History Report
        case ARBITRAGE_TRADE_HISTORY_REPORT:
            return { ...state, loading: true, tradeHistoryList: [] };

        case ARBITRAGE_TRADE_HISTORY_REPORT_SUCCESS:
            return { ...state, loading: false, tradeHistoryList: action.payload };

        case ARBITRAGE_TRADE_HISTORY_REPORT_FAILURE:
            return { ...state, loading: false, tradeHistoryList: action.payload };

        //Open Order Report
        case ARBITRAGE_OPEN_ORDER_REPORT:
            return { ...state, openOrderListLoading: true, openOrderList: [], openOrderListError: [] };

        case ARBITRAGE_OPEN_ORDER_REPORT_SUCCESS:
            return { ...state, openOrderListLoading: false, openOrderList: action.payload.response, openOrderListError: [] };

        case ARBITRAGE_OPEN_ORDER_REPORT_FAILURE:
            return { ...state, openOrderListLoading: false, openOrderList: [], openOrderListError: action.payload };

        //Active Order Report
        case ARBITRAGE_ACTIVE_ORDER_REPORT:
            return { ...state, loading: true, activeOrderList: [] };

        case ARBITRAGE_ACTIVE_ORDER_REPORT_SUCCESS:
            return { ...state, loading: false, activeOrderList: action.payload };

        case ARBITRAGE_ACTIVE_ORDER_REPORT_FAILURE:
            return { ...state, loading: false, activeOrderList: action.payload };

        //Recent Order Report
        case ARBITRAGE_RECENT_ORDER_REPORT:
            return { ...state, loading: true, recentOrderList: [] };

        case ARBITRAGE_RECENT_ORDER_REPORT_SUCCESS:
            return { ...state, loading: false, recentOrderList: action.payload };

        case ARBITRAGE_RECENT_ORDER_REPORT_FAILURE:
            return { ...state, loading: false, recentOrderList: action.payload };


        //Get Chart Data
        case ARBITRAGE_CHART_DATA:
            return { ...state, arbitrageChartLoading: true, arbitrageChartData: [], arbitrageChartError: [] };

        case ARBITRAGE_CHART_DATA_SUCCESS:
            return { ...state, arbitrageChartLoading: false, arbitrageChartData: action.payload.response, arbitrageChartError: [] };

        case ARBITRAGE_CHART_DATA_FAILURE:
            return { ...state, arbitrageChartLoading: false, arbitrageChartData: [], arbitrageChartError: action.payload };

        // Cancel order by Jayshreeba gohil Merge by Tejas ***/
        // do cancel Open Order 
        case DO_CANCEL_ORDER_ARBITRAGE:
            return { ...state, cancelOrderLoader: true, cancelOrder: [], cancelOrderError: [] };

        // set response Of  cancel Open Order 
        case DO_CANCEL_ORDER_ARBITRAGE_SUCCESS:

            return { ...state, cancelOrderLoader: false, cancelOrder: action.payload, cancelOrderError: [] };

        // Display Error for cancel Open Order  failure
        case DO_CANCEL_ORDER_ARBITRAGE_FAILURE:
            return { ...state, cancelOrderLoader: false, cancelOrder: [], cancelOrderError: action.payload };

        // Added by Tejas for MArket trade history Start 12/6/2019

        //Trade History Report
        case ARBITRAGE_MARKET_TRADE_HISTORY:
            return { ...state, marketTradeHistoryLoading: true, marketTradeHistoryList: [], marketTradeHistoryError: [] };

        case ARBITRAGE_MARKET_TRADE_HISTORY_SUCCESS:
            return { ...state, marketTradeHistoryLoading: false, marketTradeHistoryList: action.payload.response, marketTradeHistoryError: [] };

        case ARBITRAGE_MARKET_TRADE_HISTORY_FAILURE:
            return { ...state, marketTradeHistoryLoading: false, marketTradeHistoryError: action.payload, marketTradeHistoryList: [] };

        //end
        default:
            return { ...state };
    }
}