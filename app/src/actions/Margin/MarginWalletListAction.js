import {
    // Get Margin Wallet
    GET_MARGIN_WALLET,
    GET_MARGIN_WALLET_SUCCESS,
    GET_MARGIN_WALLET_FAILURE,

    // Add Leverage
    ADD_LEVERAGE,
    ADD_LEVERAGE_SUCCESS,
    ADD_LEVERAGE_FAILURE,

    // Add Leverage Confirmation
    ADD_LEVERAGE_CONFIRMATION,
    ADD_LEVERAGE_CONFIRMATION_SUCCESS,
    ADD_LEVERAGE_CONFIRMATION_FAILURE,

    // Leverage Base Currency
    LEVERAGE_BASE_CURRENCY,
    LEVERAGE_BASE_CURRENCY_SUCCESS,
    LEVERAGE_BASE_CURRENCY_FAILURE,

    //To Clear Reducer
    CLEAR_MARGIN_WALLET,
} from '../ActionTypes';

// Redux action to Get Wallet List
export const getMarginWallets = (request) => ({
    type: GET_MARGIN_WALLET,
    walletsRequest: request
});

// Redux action to Get Wallet List Success
export const getMarginWalletsSuccess = (response) => ({
    type: GET_MARGIN_WALLET_SUCCESS,
    payload: response
})

// Redux action to Get Wallet List Failure
export const getMarginWalletsFailure = (error) => ({
    type: GET_MARGIN_WALLET_FAILURE,
    payload: error
})

// Redux action to Add Leverage Wallet
export const addLeverageWithWallet = (request) => ({
    type: ADD_LEVERAGE,
    request: request
});

// Redux action to Add Leverage Wallet Success
export const addLeverageWithWalletSuccess = (response) => ({
    type: ADD_LEVERAGE_SUCCESS,
    payload: response
});

// Redux action to Add Leverage Wallet Failure
export const addLeverageWithWalletFailure = (error) => ({
    type: ADD_LEVERAGE_FAILURE,
    payload: error
});

// Redux action to Confirm Leverage
export const confirmAddLeverage = (request) => ({
    type: ADD_LEVERAGE_CONFIRMATION,
    request: request
})

// Redux action to Confirm Leverage Success
export const confirmAddLeverageSuccess = (response) => ({
    type: ADD_LEVERAGE_CONFIRMATION_SUCCESS,
    payload: response
})

// Redux action to Confirm Leverage Failure
export const confirmAddLeverageFailure = (error) => ({
    type: ADD_LEVERAGE_CONFIRMATION_FAILURE,
    payload: error
})

// Redux action to Get Leverage Base Currency
export const getLeverageBaseCurrency = () => ({
    type: LEVERAGE_BASE_CURRENCY,
})

// Redux action to Get Leverage Base Currency Success
export const getLeverageBaseCurrencySuccess = (response) => ({
    type: LEVERAGE_BASE_CURRENCY_SUCCESS,
    payload: response
})

// Redux action to Get Leverage Base Currency Failure
export const getLeverageBaseCurrencyFailure = (error) => ({
    type: LEVERAGE_BASE_CURRENCY_FAILURE,
    payload: error
})

// Clear Margin Wallet Data
export const clearReducer = () => ({
    type: CLEAR_MARGIN_WALLET,
})
