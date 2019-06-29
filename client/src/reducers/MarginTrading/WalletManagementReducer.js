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
    CREATE_MARGIN_WALLETS,
    CREATE_MARGIN_WALLETS_SUCCESS,
    CREATE_MARGIN_WALLETS_FAILURE,

    //add leverage
    ADD_LEVERAGE,
    ADD_LEVERAGE_SUCCESS,
    ADD_LEVERAGE_FAILURE,

    //confirm leverage request
    ADD_LEVERAGE_CONFIRMATION,
    ADD_LEVERAGE_CONFIRMATION_SUCCESS,
    ADD_LEVERAGE_CONFIRMATION_FAILURE,

    //added by parth andhariya
    //for Margin currancy List
    GET_LEVERAGE_BASE_CURRENCY,
    GET_LEVERAGE_BASE_CURRENCY_SUCCESS,
    GET_LEVERAGE_BASE_CURRENCY_FAILURE,

    //added by vishva
    DELEVERAGE_PRECONFIRM,
    DELEVERAGE_PRECONFIRM_SUCCESS,
    DELEVERAGE_PRECONFIRM_FAILURE,

    DELEVERAGE_CONFIRM,
    DELEVERAGE_CONFIRM_SUCCESS,
    DELEVERAGE_CONFIRM_FAILURE,

} from 'Actions/types';

const INITIAL_STATE = {
    loader: false,
    walletList: [],
    createWalletResponse: {},
    addLeverageResponse: {},
    confirmResponse: {},
    marginCurrancy: [],
    preConfirmationDetails: {},
    confirmDetail: {}
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {
        case LIST_MARGIN_WALLETS:
            return { ...state, loading: true, walletList: [], createWalletResponse: {}, addLeverageResponse: {}, confirmResponse: {} }
        case LIST_MARGIN_WALLETS_SUCCESS:
            return { ...state, loading: false, walletList: action.payload }
        case LIST_MARGIN_WALLETS_FAILURE:
            return { ...state, loading: false, walletList: [] }

        case CREATE_MARGIN_WALLETS:
            return { ...state, loading: true, createWalletResponse: {} }
        case CREATE_MARGIN_WALLETS_SUCCESS:
            return { ...state, loading: false, createWalletResponse: action.payload }
        case CREATE_MARGIN_WALLETS_FAILURE:
            return { ...state, loading: false, createWalletResponse: action.payload }

        case ADD_LEVERAGE:
            return { ...state, loading: true, addLeverageResponse: {}, confirmResponse: {} }
        case ADD_LEVERAGE_SUCCESS:
            return { ...state, loading: false, addLeverageResponse: action.payload, confirmResponse: {} }
        case ADD_LEVERAGE_FAILURE:
            return { ...state, loading: false, addLeverageResponse: action.payload, confirmResponse: {} }

        case ADD_LEVERAGE_CONFIRMATION:
            return { ...state, loading: true, confirmResponse: {} }
        case ADD_LEVERAGE_CONFIRMATION_SUCCESS:
            return { ...state, loading: false, addLeverageResponse: {}, confirmResponse: action.payload }
        case ADD_LEVERAGE_CONFIRMATION_FAILURE:
            return { ...state, loading: false, addLeverageResponse: {}, confirmResponse: action.payload }

        //added by partH andhariya
        // margin currency 
        case GET_LEVERAGE_BASE_CURRENCY:
            return { ...state, loading: true, marginCurrancy: [], addLeverageResponse: {}, confirmResponse: {} }
        case GET_LEVERAGE_BASE_CURRENCY_SUCCESS:
            return { ...state, loading: false, marginCurrancy: action.payload.Data }
        case GET_LEVERAGE_BASE_CURRENCY_FAILURE:
            return { ...state, loading: false, marginCurrancy: action.payload }

        //added by vishva
        case DELEVERAGE_PRECONFIRM:
            return { ...state, loading: true, preConfirmationDetails: {}, addLeverageResponse: {}, confirmResponse: {} };
        case DELEVERAGE_PRECONFIRM_SUCCESS:
            return { ...state, loading: false, preConfirmationDetails: action.payload };
        case DELEVERAGE_PRECONFIRM_FAILURE:
            return { ...state, loading: false, preConfirmationDetails: action.payload };

        //deleverage confirmation
        case DELEVERAGE_CONFIRM:
            return { ...state, loading: true, confirmDetail: {}, addLeverageResponse: {}, confirmResponse: {} }
        case DELEVERAGE_CONFIRM_SUCCESS:
            return { ...state, loading: false, confirmDetail: action.payload }
        case DELEVERAGE_CONFIRM_FAILURE:
            return { ...state, loading: false, confirmDetail: action.payload }

        default:
            return { ...state };
    }
}