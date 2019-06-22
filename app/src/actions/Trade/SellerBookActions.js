import {
    // Fetch Seller Book List
    FETCH_SELLER_BOOK_LIST,
    FETCH_SELLER_BOOK_LIST_SUCCESS,
    FETCH_SELLER_BOOK_LIST_FAILURE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

// Redux action to Fetch Selller Book List
export function fetchSellerBookList(payload) {
    return action(FETCH_SELLER_BOOK_LIST, { payload })
}

// Redux action to Fetch Selller Book List Success
export function fetchSellerBookListSuccess(data) {
    return action(FETCH_SELLER_BOOK_LIST_SUCCESS, { data })
}

// Redux action to Fetch Selller Book List Failure
export function fetchSellerBookListFailure() {
    return action(FETCH_SELLER_BOOK_LIST_FAILURE)
}