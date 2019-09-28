import {
    //trade recon list 
    ARBITRAGE_TRADE_RECON_LIST,
    ARBITRAGE_TRADE_RECON_LIST_SUCCESS,
    ARBITRAGE_TRADE_RECON_LIST_FAILURE,

    //trade recon set
    ARBITRAGE_TRADE_RECON_SET,
    ARBITRAGE_TRADE_RECON_SET_SUCCESS,
    ARBITRAGE_TRADE_RECON_SET_FAILURE,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //pair list 
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,

    //clear data
    ACTION_LOGOUT,

    // Clear Arbitrage Trade Recon Data
    CLEAR_ARBITRAGE_TRADE_RECON_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //trade recon list 
    tradeReconListData: null,
    tradeReconListFetching: false,

    //trade recon set
    tradeReconSetdata: null,
    tradeReconSetFetching: false,

    //for User list
    userData: null,

    //pair list
    pairList: null,
}

export default function ArbitrageTradeReconReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_ARBITRAGE_TRADE_RECON_DATA:
            return INITIAL_STATE

        //trade recon list 
        case ARBITRAGE_TRADE_RECON_LIST:
            return { ...state, tradeReconListFetching: true, tradeReconListData: null };
        //trade recon list  success
        case ARBITRAGE_TRADE_RECON_LIST_SUCCESS:
            return { ...state, tradeReconListFetching: false, tradeReconListData: action.payload };
        //trade recon list  failure
        case ARBITRAGE_TRADE_RECON_LIST_FAILURE:
            return { ...state, tradeReconListFetching: false, tradeReconListData: action.payload };

        //set trade recon 
        case ARBITRAGE_TRADE_RECON_SET:
            return { ...state, tradeReconSetFetching: true, tradeReconSetdata: null };
        //set trade recon success
        case ARBITRAGE_TRADE_RECON_SET_SUCCESS:
            return { ...state, tradeReconSetFetching: false, tradeReconSetdata: action.payload };
        //set trade recon failure
        case ARBITRAGE_TRADE_RECON_SET_FAILURE:
            return { ...state, tradeReconSetFetching: false, tradeReconSetdata: action.payload };

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return { ...state, userData: null };
        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return { ...state, userData: action.payload };
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return { ...state, userData: action.payload };

        // Handle Get Pair list method data
        case GET_PAIR_LIST:
            return { ...state, pairList: null }
        // Set Pair list success data
        case GET_PAIR_LIST_SUCCESS:
            return { ...state, pairList: action.payload }
        // Set Pair list Failure data
        case GET_PAIR_LIST_FAILURE:
            return { ...state, pairList: action.payload }


        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}