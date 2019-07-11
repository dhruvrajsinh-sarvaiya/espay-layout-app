/* 
    Developer : Nishant Vadgama
    Date : 06-02-2019
    File Comment : Organization ledger reducer
*/

import {
    //wallets...
    GET_ORG_WALLETS,
    GET_ORG_WALLETS_SUCCESS,
    GET_ORG_WALLETS_FAILURE,
    //ledger...
    GET_ORG_LEDGER,
    GET_ORG_LEDGER_SUCCESS,
    GET_ORG_LEDGER_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    loading: false,
    organizationWallets: [],
    walletLedger: [],
    totalCount: 0,
    ledgerResponse: {}
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //wallets...
        case GET_ORG_WALLETS:
            return { ...state, loading: true, organizationWallets: [], walletLedger: [], ledgerResponse: {} }
        case GET_ORG_WALLETS_SUCCESS:
            return { ...state, loading: false, organizationWallets: action.payload }
        case GET_ORG_WALLETS_FAILURE:
            return { ...state, loading: false, organizationWallets: [] }
        //ledger...
        case GET_ORG_LEDGER:
            return { ...state, loading: true, walletLedger: [], ledgerResponse: {} }
        case GET_ORG_LEDGER_SUCCESS:
            return { ...state, loading: false, walletLedger: action.payload.WalletLedgers, totalCount: action.payload.TotalCount, ledgerResponse: action.payload }
        case GET_ORG_LEDGER_FAILURE:
            return { ...state, loading: false, walletLedger: [], totalCount: 0, ledgerResponse: action.payload }

        default:
            return { ...state };
    }
}