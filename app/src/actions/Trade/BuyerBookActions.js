import {
    // Fetch Buyer Book List
    FETCH_BUYER_BOOK_LIST,
    FETCH_BUYER_BOOK_LIST_SUCCESS,
    FETCH_BUYER_BOOK_LIST_FAILURE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

// Redux action to Fetch Buyer Book List
export function fetchBuyerBookList(payload) {
    return action(FETCH_BUYER_BOOK_LIST, { payload })
}

// Redux action to Fetch Buyer Book List Success
export function fetchBuyerBookListSuccess(data) {
    return action(FETCH_BUYER_BOOK_LIST_SUCCESS, { data })
}

// Redux action to Fetch Buyer Book List Failure
export function fetchBuyerBookListFailure(error) {
    return action(FETCH_BUYER_BOOK_LIST_FAILURE, { error })
}