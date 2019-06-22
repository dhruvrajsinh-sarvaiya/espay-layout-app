// Action types for Fund View
import {
    // get all balances
    GET_ALL_BALANCE,
    GET_ALL_BALANCE_SUCCESS,
    GET_ALL_BALANCE_FAILURE,
    
    // get seprated balance
    GET_WALLETBALANCE,
    GET_WALLETBALANCE_SUCCESS,
    GET_WALLETBALANCE_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Fund View Clear
    FUNDS_VIEW_CLEAR,
} from "../actions/ActionTypes";

//Initial State For Funds Data
const INTIAL_STATE = {

    // get all balances
    AllBalanceFetchData: true,
    AllBalanceIsFetching: false,
    AllBalanceData: '',

    // get seprated balance
    WalletBalanceFetchData: true,
    WalletBalanceIsFetching: false,
    WalletBalanceData: '',
}

const FundViewReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        //To Clear All Reducer
        case FUNDS_VIEW_CLEAR: {
            return INTIAL_STATE;
        }

        // Handle All Balance method data
        case GET_ALL_BALANCE:
            return { AllBalanceIsFetching: true, AllBalanceData: '', AllBalanceFetchData: true, WalletBalanceFetchData: true };
        // Set All Balance success data
        case GET_ALL_BALANCE_SUCCESS:
            return { AllBalanceIsFetching: false, AllBalanceData: action.payload, AllBalanceFetchData: false, WalletBalanceFetchData: true };
        // Set All Balance failure data
        case GET_ALL_BALANCE_FAILURE:
            return { AllBalanceIsFetching: false, AllBalanceData: action.payload, AllBalanceFetchData: false, WalletBalanceFetchData: true };

        // Handle Wallet Balance method data
        case GET_WALLETBALANCE:
            return { WalletBalanceIsFetching: true, WalletBalanceData: '', WalletBalanceFetchData: true, AllBalanceFetchData: true };
        // Set Wallet Balance success data
        case GET_WALLETBALANCE_SUCCESS:
            return { WalletBalanceIsFetching: false, WalletBalanceData: action.payload, WalletBalanceFetchData: false, AllBalanceFetchData: true };
        // Set Wallet Balance failure data
        case GET_WALLETBALANCE_FAILURE:
            return { WalletBalanceIsFetching: false, WalletBalanceData: action.payload, WalletBalanceFetchData: false, AllBalanceFetchData: true };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default FundViewReducer;



