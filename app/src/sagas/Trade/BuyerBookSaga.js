import {
    FETCH_BUYER_BOOK_LIST,
} from '../../actions/ActionTypes'

import { put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { swaggerGetAPI } from '../../api/helper';
import { fetchBuyerBookListSuccess, fetchBuyerBookListFailure } from '../../actions/Trade/BuyerBookActions';

export default function* buyerBookSaga() {

    // For Buyer/Seller Order Book 
    yield takeLatest(FETCH_BUYER_BOOK_LIST, fetchBuyerBook);
}

// function for call socket and handle socket response
function* fetchBuyerBook({ payload }) {
    try {
        let url = Method.GetBuyerBook + '/' + payload.Pair;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(fetchBuyerBookListSuccess(response));
    } catch (e) {
        yield put(fetchBuyerBookListFailure(e))
    }
}