/* 
    Developer : Parth Andhariya
    File Comment : Wallet Ledger Report reducer constants
    Date : 01-03-2019
*/
import {
    GET_USER_MARGIN_WALLETS,
    GET_USER_MARGIN_WALLETS_SUCCESS,
    GET_USER_MARGIN_WALLETS_FAILURE,
    MARGIN_WALLET_LEDGER,
    MARGIN_WALLET_LEDGER_SUCCESS,
    MARGIN_WALLET_LEDGER_FAILURE
} from 'Actions/types';

// initial state
const INITIAL_STATE = {
    loading: false,
    userMarginWallets: [],
    TotalCount: 0,
    errors: {},
    marginWalletLedgers: [],
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get a list of User Margin Wallet 
        case GET_USER_MARGIN_WALLETS:
            return { ...state, loading: true, userMarginWallets: [] };
        case GET_USER_MARGIN_WALLETS_SUCCESS:
            return {
                ...state,
                loading: false,
                userMarginWallets: action.payload.Data,
                errors: {},
            };
        case GET_USER_MARGIN_WALLETS_FAILURE:
            return { ...state, loading: false, errors: action.payload, userMarginWallets: [] };

        //get a list Margin Wallet Ledger
        case MARGIN_WALLET_LEDGER:
            return { ...state, loading: true, marginWalletLedgers: [] };
        case MARGIN_WALLET_LEDGER_SUCCESS:
            return {
                ...state,
                loading: false,
                marginWalletLedgers: action.payload.WalletLedgers,
                errors: {},
                TotalCount: action.payload.TotalCount
            };
        case MARGIN_WALLET_LEDGER_FAILURE:
            return { ...state, loading: false, errors: action.payload, marginWalletLedgers: [], TotalCount: 0 };
        default:
            return { ...state };
    }
};
