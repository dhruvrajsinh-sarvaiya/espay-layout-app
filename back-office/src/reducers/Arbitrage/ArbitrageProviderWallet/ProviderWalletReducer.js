/* 
    Developer : Vishva shah
    FIle Comment : arbitrage provider wallet reducer 
    Date : 17-06-2019
*/

import {
    // get provider wallet list
    GET_ARBITRAGE_WALLET_LIST,
    GET_ARBITRAGE_WALLET_LIST_SUCCESS,
    GET_ARBITRAGE_WALLET_LIST_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    errors: {},
    arbitrageWalletList: [],
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // list arbitrage provider wallet list
        case GET_ARBITRAGE_WALLET_LIST:
            return { ...state, loading: true, errors: {}}
        case GET_ARBITRAGE_WALLET_LIST_SUCCESS:
            return { ...state, loading: false, arbitrageWalletList: action.payload.Data}
        case GET_ARBITRAGE_WALLET_LIST_FAILURE:
            return { ...state, loading: false, arbitrageWalletList:[]}
        default:
            return { ...state };
    }
};
