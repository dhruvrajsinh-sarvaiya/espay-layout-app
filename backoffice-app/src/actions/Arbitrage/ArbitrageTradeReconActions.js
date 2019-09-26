import {
    //trade recon list 
    ARBITRAGE_TRADE_RECON_LIST,
    ARBITRAGE_TRADE_RECON_LIST_SUCCESS,
    ARBITRAGE_TRADE_RECON_LIST_FAILURE,

    //trade recon set
    ARBITRAGE_TRADE_RECON_SET,
    ARBITRAGE_TRADE_RECON_SET_SUCCESS,
    ARBITRAGE_TRADE_RECON_SET_FAILURE,

    //clear data
    CLEAR_ARBITRAGE_TRADE_RECON_DATA
} from "../ActionTypes";

//Redux action get trade recon list 
export const getArbiTradeReconList = (request) => ({
    type: ARBITRAGE_TRADE_RECON_LIST,
    payload: request
});
//Redux action get trade recon list success
export const getArbiTradeReconListSuccess = (response) => ({
    type: ARBITRAGE_TRADE_RECON_LIST_SUCCESS,
    payload: response
});
//Redux action get trade recon list Faillure
export const getArbiTradeReconListFailure = (error) => ({
    type: ARBITRAGE_TRADE_RECON_LIST_FAILURE,
    payload: error
});

//Redux action get set trade recon
export const setArbiTradeRecon = (request) => ({
    type: ARBITRAGE_TRADE_RECON_SET,
    payload: request
});
//Redux action get set trade recon Success
export const setArbiTradeReconSuccess = (response) => ({
    type: ARBITRAGE_TRADE_RECON_SET_SUCCESS,
    payload: response
});
//Redux action get set trade recon Failure
export const setArbiTradeReconFailure = (error) => ({
    type: ARBITRAGE_TRADE_RECON_SET_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearArbiTradeReconData = () => ({
    type: CLEAR_ARBITRAGE_TRADE_RECON_DATA,
});

