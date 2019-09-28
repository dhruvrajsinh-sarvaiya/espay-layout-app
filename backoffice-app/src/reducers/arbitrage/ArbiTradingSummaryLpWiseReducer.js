// ArbitrageTradingSummeryLpWiseReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for get arbitrage trading summery lp wise list 
    GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST,
    GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_SUCCESS,
    GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_FAILURE,

    //get pair list 
    LIST_PAIR_ARBITRAGE,
    LIST_PAIR_ARBITRAGE_SUCCESS,
    LIST_PAIR_ARBITRAGE_FAILURE,

    // for clear arbitrage trading summery lp wise
    CLEAR_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST
} from "../../actions/ActionTypes";

// Initial State for Currency Config
const INITIAL_STATE = {
    // arbitrage trading summery lp wise
    ArbitrageLpWiseList: null,
    ArbitrageLpWiseLoading: false,
    ArbitrageLpWiseError: false,

    //arbitrage pair list
    arbitragePairListFetching: false,
    arbitragePairListData: null,
}

export default function ArbiTradingSummaryLpWiseReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle arbitrage trading summery lp wise method data
        case GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST:
            return Object.assign({}, state, {
                ArbitrageLpWiseList: null,
                ArbitrageLpWiseLoading: true
            })
        // Set arbitrage trading summery lp wise success data
        case GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageLpWiseList: action.data,
                ArbitrageLpWiseLoading: false,
            })
        // Set arbitrage trading summery lp wise failure data
        case GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbitrageLpWiseList: null,
                ArbitrageLpWiseLoading: false,
                ArbitrageLpWiseError: true
            })
        //handle get wallet type Method
        case LIST_PAIR_ARBITRAGE:
            return Object.assign({}, state, {
                arbitragePairListFetching: true,
                arbitragePairListData: null
            })
        //handle set wallet type Success,failure Method
        case LIST_PAIR_ARBITRAGE_SUCCESS:
        case LIST_PAIR_ARBITRAGE_FAILURE:
            return Object.assign({}, state, {
                arbitragePairListFetching: false,
                arbitragePairListData: action.payload
            })

        // Clear arbitrage trading summery lp wise method data
        case CLEAR_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}