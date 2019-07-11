/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : Margin Trading Wallet Management reducer constants
*/

import {
    //list
    LIST_MARGIN_WALLETS,
    LIST_MARGIN_WALLETS_SUCCESS,
    LIST_MARGIN_WALLETS_FAILURE,
} from 'Actions/types';

const INITIAL_STATE = {
    loader: false,
    walletList: [],
    createWalletResponse: {},
    addLeverageResponse: {},
    confirmResponse: {},
    TotalCount: 0,
    errors: {},
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        case LIST_MARGIN_WALLETS:
            return { ...state, loading: true, walletList: [] }
        case LIST_MARGIN_WALLETS_SUCCESS:
            return { ...state, loading: false, walletList: action.payload.Data, TotalCount: action.payload.TotalCount }
        case LIST_MARGIN_WALLETS_FAILURE:
            return { ...state, loading: false, walletList: [], TotalCount: 0, }

        default:
            return { ...state };
    }
}