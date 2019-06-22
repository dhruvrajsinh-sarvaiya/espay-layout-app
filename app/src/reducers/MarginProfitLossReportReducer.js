// Action types for Margin Profit Loss Report
import {
    // Margin Profite Loss
    GET_MARGIN_PROFIT_LOSS_DATA,
    GET_MARGIN_PROFIT_LOSS_DATA_SUCCESS,
    GET_MARGIN_PROFIT_LOSS_DATA_FAILURE,

    // Get Pair List
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,

    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from "../actions/ActionTypes";

// Initial state for Margin Profit Loss Report
const INTIAL_STATE = {

    //Pair List
    pairList: null,
    pairListDataFetch: true,

    // for currency
    BalanceFetchData: true,
    Balancedata: null,

    // for ProfitlossData
    loading: false,
    profitLossData: null,
    profitLossDataFetch: true,

}

export default function MarginProfitLossReportReducer(state = INTIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Get Pair List method data
        case GET_PAIR_LIST: {
            return Object.assign({}, state, {
                pairList: null,
                pairListDataFetch: true,
                BalanceFetchData: true,
                profitLossDataFetch: true,
            })
        }
        // Set Get Pair List success data
        case GET_PAIR_LIST_SUCCESS: {
            return Object.assign({}, state, {
                pairList: action.payload,
                pairListDataFetch: false,
                BalanceFetchData: true,
                profitLossDataFetch: true,
            })
        }
        // Set Get Pair List failure data
        case GET_PAIR_LIST_FAILURE: {
            return Object.assign({}, state, {
                pairList: null,
                pairListDataFetch: false,
                BalanceFetchData: true,
                profitLossDataFetch: true,
            })
        }

        // Handle Fetch Balance method data
        case FETCH_BALANCE:
            return Object.assign({}, state, {
                BalanceFetchData: true,
                Balancedata: null,
                pairListDataFetch: true,
                profitLossDataFetch: true,
            });
        // Set Fetch Balance success data
        case FETCH_BALANCE_SUCCESS:
            return Object.assign({}, state, {
                BalanceFetchData: false,
                Balancedata: action.data,
                pairListDataFetch: true,
                profitLossDataFetch: true,
            });
        // Set Fetch Balance failure data
        case FETCH_BALANCE_FAILURE:
            return Object.assign({}, state, {
                BalanceFetchData: false,
                Balancedata: null,
                pairListDataFetch: true,
                profitLossDataFetch: true,
            });

        // Handle Margin Profit Loss method data
        case GET_MARGIN_PROFIT_LOSS_DATA:
            return Object.assign({}, state, {
                loading: true,
                profitLossData: null,
                profitLossDataFetch: true,
                BalanceFetchData: true,
                pairListDataFetch: true,
            });
        // Set Margin Profit Loss success data
        case GET_MARGIN_PROFIT_LOSS_DATA_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                profitLossData: action.data,
                profitLossDataFetch: false,
                BalanceFetchData: true,
                pairListDataFetch: true,
            });
        // Set Margin Profit Loss failure data
        case GET_MARGIN_PROFIT_LOSS_DATA_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                profitLossData: null,
                profitLossDataFetch: false,
                BalanceFetchData: true,
                pairListDataFetch: true,
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}