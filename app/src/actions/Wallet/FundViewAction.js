import {
    // get all balances
    GET_ALL_BALANCE,
    GET_ALL_BALANCE_SUCCESS,
    GET_ALL_BALANCE_FAILURE,
    // get seprated balance
    GET_WALLETBALANCE,
    GET_WALLETBALANCE_SUCCESS,
    GET_WALLETBALANCE_FAILURE,
    //To Clear Reducer
    FUNDS_VIEW_CLEAR
} from '../ActionTypes';

//To Clear Reducer
export const clearReducer = () => ({
    type: FUNDS_VIEW_CLEAR
});

// Redux action to get all balance
export const getAllBalance = () => ({
    type: GET_ALL_BALANCE
});

// Redux action to get all balance success
export const getAllBalanceSuccess = (response) => ({
    type: GET_ALL_BALANCE_SUCCESS,
    payload: response
})

// Redux action to get all balance failure
export const getAllBalanceFailure = (error) => ({
    type: GET_ALL_BALANCE_FAILURE,
    payload: error
})

// Redux action to get wallet balance
export const getWalletsBalance = (walletBalanceRequest, WalletType) => ({
    type: GET_WALLETBALANCE,
    walletBalanceRequest: walletBalanceRequest,
    WalletType: WalletType
});

// Redux action to get wallet balance success
export const getWalletsBalanceSuccess = (response) => ({
    type: GET_WALLETBALANCE_SUCCESS,
    payload: response
})

// Redux action to get wallet balance failure
export const getWalletsBalanceFailure = (error) => ({
    type: GET_WALLETBALANCE_FAILURE,
    payload: error
})