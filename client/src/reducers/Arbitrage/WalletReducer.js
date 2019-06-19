/* 
    Developer : Vishva shah
    Date : 05-06-2019
    File Comment : wallet reducer
*/

import {
    // list currency
    LIST_ARBITRAGE_CURRENCY,
    LIST_ARBITRAGE_CURRENCY_SUCCESS,
    LIST_ARBITRAGE_CURRENCY_FAILURE,
    //list
    LIST_ARBITRAGE_WALLETS,
    LIST_ARBITRAGE_WALLETS_SUCCESS,
    LIST_ARBITRAGE_WALLETS_FAILURE,
    //create
    CREATE_ARBITRAGE_WALLETS,
    CREATE_ARBITRAGE_WALLETS_SUCCESS,
    CREATE_ARBITRAGE_WALLETS_FAILURE,
    //add leverage preconfirmation
    ADD_LEVERAGE_PRECONFIRMATION,
    ADD_LEVERAGE_PRECONFIRMATION_SUCCESS,
    ADD_LEVERAGE_PRECONFIRMATION_FAILURE,
    //confirm leverage request
    ADD_ARBITRAGE_LEVERAGE,
    ADD_ARBITRAGE_LEVERAG_SUCCESS,
    ADD_ARBITRAGE_LEVERAGE_FAILURE,
    //wallet balance
    ARBITRAGE_ADD_WALLET_BALANCE,
    ARBITRAGE_ADD_WALLET_BALANCE_SUCCESS,
    ARBITRAGE_ADD_WALLET_BALANCE_FAILURE,
} from 'Actions/types';

const INITIAL_STATE = {
    loading: false,
    walletList: [],
    createWalletResponse: {},
    addLeverageResponse: {},
    confirmResponse: {},
    currencyList: [],
    addBalanceConfirmation: {}
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        //list arbitrage currency
        case LIST_ARBITRAGE_CURRENCY:
            return { ...state, loading: true, currencyList: [], }
        case LIST_ARBITRAGE_CURRENCY_SUCCESS:
            return { ...state, loading: false, currencyList: action.payload.ArbitrageWalletTypeMasters }
        case LIST_ARBITRAGE_CURRENCY_FAILURE:
            return { ...state, loading: false, currencyList: [] }
        //list arbitrage wallet
        case LIST_ARBITRAGE_WALLETS:
            return { ...state, loading: true, walletList: [], createWalletResponse: {}, addBalanceConfirmation: {} }
        case LIST_ARBITRAGE_WALLETS_SUCCESS:
            return { ...state, loading: false, walletList: action.payload.Data }
        case LIST_ARBITRAGE_WALLETS_FAILURE:
            return { ...state, loading: false, walletList: [] }
        //create arbitrage wallet
        case CREATE_ARBITRAGE_WALLETS:
            return { ...state, loading: true, createWalletResponse: {} }
        case CREATE_ARBITRAGE_WALLETS_SUCCESS:
            return { ...state, loading: false, createWalletResponse: action.payload }
        case CREATE_ARBITRAGE_WALLETS_FAILURE:
            return { ...state, loading: false, createWalletResponse: action.payload }
        //add leverage preconfirmation
        case ADD_LEVERAGE_PRECONFIRMATION:
            return { ...state, loading: true, addLeverageResponse: {}, confirmResponse: {} }
        case ADD_LEVERAGE_PRECONFIRMATION_SUCCESS:
            return { ...state, loading: false, addLeverageResponse: action.payload, confirmResponse: {} }
        case ADD_LEVERAGE_PRECONFIRMATION_FAILURE:
            return { ...state, loading: false, addLeverageResponse: action.payload, confirmResponse: {} }
        //add leverage confirmation 
        case ADD_ARBITRAGE_LEVERAGE:
            return { ...state, loading: true, confirmResponse: {} }
        case ADD_ARBITRAGE_LEVERAG_SUCCESS:
            return { ...state, loading: false, addLeverageResponse: {}, confirmResponse: action.payload }
        case ADD_ARBITRAGE_LEVERAGE_FAILURE:
            return { ...state, loading: false, addLeverageResponse: {}, confirmResponse: action.payload }
        //wallet balance
        case ARBITRAGE_ADD_WALLET_BALANCE:
            return { ...state, loading: true, addBalanceConfirmation: {} }
        case ARBITRAGE_ADD_WALLET_BALANCE_SUCCESS:
            return { ...state, loading: false, addBalanceConfirmation: action.payload }
        case ARBITRAGE_ADD_WALLET_BALANCE_FAILURE:
            return { ...state, loading: false, addBalanceConfirmation: action.payload }
        default:
            return { ...state };
    }
}