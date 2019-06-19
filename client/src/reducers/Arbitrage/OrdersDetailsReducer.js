/*
Name: Tejas Gauswami
Use : Reducer for  for Buyer Book
Date  : 3/6/2019
*/

import {

    // types for buyer book
    ARBITRAGE_BUYER_BOOK_LIST,
    ARBITRAGE_BUYER_BOOK_LIST_SUCCESS,
    ARBITRAGE_BUYER_BOOK_LIST_FAILURE,

    // types for Seller book
    ARBITRAGE_SELLER_BOOK_LIST,
    ARBITRAGE_SELLER_BOOK_LIST_SUCCESS,
    ARBITRAGE_SELLER_BOOK_LIST_FAILURE,

    // types for Pair list
    ARBITRAGE_PAIR_LIST,
    ARBITRAGE_PAIR_LIST_SUCCESS,
    ARBITRAGE_PAIR_LIST_FAILURE

}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    buyerOrderLoading: false,
    arbitrageBuyerOrder: [],
    arbitrageBuyerOrderBit: 0,

    sellerOrderLoading: false,
    arbitrageSellerOrder: [],
    arbitrageSellerOrderBit: 0,

    pairListDataLoading: false,
    arbitragePairList: [],
    arbiTragePairListError: [],
    arbitragePairListBit: 0
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        // get Buyer Order list
        case ARBITRAGE_BUYER_BOOK_LIST:
            return { ...state, buyerOrderLoading: true };

        // set Data Of  Buyer Order list
        case ARBITRAGE_BUYER_BOOK_LIST_SUCCESS:

            return { ...state, arbitrageBuyerOrder: action.payload.Response, buyerOrderLoading: false, arbitrageBuyerOrderBit: ++state.arbitrageBuyerOrderBit };

        // Display Error for Buyer Order list failure
        case ARBITRAGE_BUYER_BOOK_LIST_FAILURE:

            return { ...state, buyerOrderLoading: false, arbitrageBuyerOrder: [], arbitrageBuyerOrderBit: ++state.arbitrageBuyerOrderBit };

        // get Seller Order list
        case ARBITRAGE_SELLER_BOOK_LIST:
            return { ...state, sellerOrderLoading: true };

        // set Data Of  Seller Order list
        case ARBITRAGE_SELLER_BOOK_LIST_SUCCESS:

            return { ...state, arbitrageSellerOrder: action.payload.Response, sellerOrderLoading: false, arbitrageSellerOrderBit: ++state.arbitrageSellerOrderBit };

        // Display Error for Seller Order list failure
        case ARBITRAGE_SELLER_BOOK_LIST_FAILURE:

            return { ...state, sellerOrderLoading: false, arbitrageSellerOrder: [], arbitrageSellerOrderBit: ++state.arbitrageSellerOrderBit };

        // get Pair list
        case ARBITRAGE_PAIR_LIST:
            return { ...state, pairListDataLoading: true };

        // set Data Of  Pair list
        case ARBITRAGE_PAIR_LIST_SUCCESS:

            return { ...state, arbitragePairList: action.payload.response, pairListDataLoading: false, arbitragePairListBit: ++state.arbitragePairListBit, arbiTragePairListError: [] };

        // Display Error for Pair list failure
        case ARBITRAGE_PAIR_LIST_FAILURE:

            return { ...state, pairListDataLoading: false, arbitragePairList: [], arbitragePairListBit: ++state.arbitragePairListBit, arbiTragePairListError: action.payload };


        default: return { ...state };
    }
}