import {
    //user wallets list 
    ARBI_LIST_WALLET_MASTER,
    ARBI_LIST_WALLET_MASTER_SUCCESS,
    ARBI_LIST_WALLET_MASTER_FAILURE,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //currency list 
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

    //clear data on logout
    ACTION_LOGOUT,

    // Clear reducer Data
    CLEAR_ARBI_LIST_WALLET_MASTER,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    //user wallets list 
    userWalletsListData: null,
    userWalletsListFetching: false,

    //for User list
    userData: null,

    //currency list
    currencyList: null,
}

export default function ArbitrageUserWalletsReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_ARBI_LIST_WALLET_MASTER:
            return INITIAL_STATE

        //user wallets list 
        case ARBI_LIST_WALLET_MASTER:
            return { ...state, userWalletsListFetching: true, userWalletsListData: null };
        //user wallets list  success
        case ARBI_LIST_WALLET_MASTER_SUCCESS:
            return { ...state, userWalletsListFetching: false, userWalletsListData: action.payload };
        //user wallets list  failure
        case ARBI_LIST_WALLET_MASTER_FAILURE:
            return { ...state, userWalletsListFetching: false, userWalletsListData: action.payload };

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return { ...state, userData: null };
        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return { ...state, userData: action.payload };
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return { ...state, userData: action.payload };

        // Handle Get currency list method data
        case GET_ARBITRAGE_CURRENCY_LIST:
            return { ...state, currencyList: null }
        // Set currency list success data
        case GET_ARBITRAGE_CURRENCY_LIST_SUCCESS:
            return { ...state, currencyList: action.payload }
        // Set currency list Failure data
        case GET_ARBITRAGE_CURRENCY_LIST_FAILURE:
            return { ...state, currencyList: action.payload }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}