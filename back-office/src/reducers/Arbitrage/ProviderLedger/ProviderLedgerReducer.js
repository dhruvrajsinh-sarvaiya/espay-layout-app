/* 
    Developer : Parth Andhariya
    Date : 17-06-2019
    File Comment : Provider ledger reducer
*/

import {
    //Wallets...
    GET_PROVIDER_WALLETS,
    GET_PROVIDER_WALLETS_SUCCESS,
    GET_PROVIDER_WALLETS_FAILURE,
    //ledger...
    GET_PROVIDER_LEDGER,
    GET_PROVIDER_LEDGER_SUCCESS,
    GET_PROVIDER_LEDGER_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    loading: false,
    ProviderLedgerList: [],
    totalCount: 0,
    ledgerResponse: {},
    ProviderWallets:[]
}

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
               //wallets...
            case GET_PROVIDER_WALLETS:
                return { ...state, loading: true, ProviderWallets: [], ProviderLedgerList: [], ledgerResponse: {} }
            case GET_PROVIDER_WALLETS_SUCCESS:
                return { ...state, loading: false, ProviderWallets: action.payload }
            case GET_PROVIDER_WALLETS_FAILURE:
            return { ...state, loading: false, ProviderWallets: [] }
        
        //ledger...
        case GET_PROVIDER_LEDGER:
            return { ...state, loading: true, ProviderLedgerList: [], ledgerResponse: {} }
        case GET_PROVIDER_LEDGER_SUCCESS:
            return { ...state, loading: false, ProviderLedgerList: action.payload.ProviderWalletLedgers, totalCount: action.payload.TotalCount, ledgerResponse: action.payload }
        case GET_PROVIDER_LEDGER_FAILURE:
            return { ...state, loading: false, ProviderLedgerList: [], totalCount: 0, ledgerResponse: action.payload }

        default:
            return { ...state };
    }
}
