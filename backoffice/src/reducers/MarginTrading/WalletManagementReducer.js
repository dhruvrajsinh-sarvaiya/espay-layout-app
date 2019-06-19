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
    //create
    // CREATE_MARGIN_WALLETS,
    // CREATE_MARGIN_WALLETS_SUCCESS,
    // CREATE_MARGIN_WALLETS_FAILURE,
    // //add leverage
    // ADD_LEVERAGE,
    // ADD_LEVERAGE_SUCCESS,
    // ADD_LEVERAGE_FAILURE,
    // //confirm leverage request
    // ADD_LEVERAGE_CONFIRMATION,
    // ADD_LEVERAGE_CONFIRMATION_SUCCESS,
    // ADD_LEVERAGE_CONFIRMATION_FAILURE
} from 'Actions/types';

const INITIAL_STATE = {
    loader: false,
    walletList: [],
    createWalletResponse: {},
    addLeverageResponse: {},
    confirmResponse: {},
    TotalCount:0,
    errors: {},
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LIST_MARGIN_WALLETS:
            return { ...state, loading: true, walletList: []}
                //  createWalletResponse: {}, addLeverageResponse: {}, confirmResponse: {}
        case LIST_MARGIN_WALLETS_SUCCESS:
            return { ...state, loading: false, walletList: action.payload.Data,TotalCount:action.payload.TotalCount }
        case LIST_MARGIN_WALLETS_FAILURE:
            return { ...state, loading: false, walletList: [] , TotalCount:0,}

        // case CREATE_MARGIN_WALLETS:
        //     return { ...state, loading: true, createWalletResponse: {} }
        // case CREATE_MARGIN_WALLETS_SUCCESS:
        //     return { ...state, loading: false, createWalletResponse: action.payload }
        // case CREATE_MARGIN_WALLETS_FAILURE:
        //     return { ...state, loading: false, createWalletResponse: action.payload }

        // case ADD_LEVERAGE:
        //     return { ...state, loading: true, addLeverageResponse: {}, confirmResponse: {} }
        // case ADD_LEVERAGE_SUCCESS:
        //     return { ...state, loading: false, addLeverageResponse: action.payload, confirmResponse: {} }
        // case ADD_LEVERAGE_FAILURE:
        //     return { ...state, loading: false, addLeverageResponse: action.payload, confirmResponse: {} }

        // case ADD_LEVERAGE_CONFIRMATION:
        //     return { ...state, loading: true, confirmResponse: {} }
        // case ADD_LEVERAGE_CONFIRMATION_SUCCESS:
        //     return { ...state, loading: false, addLeverageResponse: {}, confirmResponse: action.payload }
        // case ADD_LEVERAGE_CONFIRMATION_FAILURE:
        //     return { ...state, loading: false, addLeverageResponse: {}, confirmResponse: action.payload }

        default:
            return { ...state };
    }
}