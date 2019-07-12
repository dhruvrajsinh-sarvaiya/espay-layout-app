import {
    FETCH_SELLER_BOOK_LIST,
} from '../../actions/ActionTypes'

import { put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { swaggerGetAPI } from '../../api/helper';
import { fetchSellerBookListSuccess, fetchSellerBookListFailure } from '../../actions/Trade/SellerBookActions';

export default function* sellerBookSaga() {

    // For Seller Order Book 
    yield takeLatest(FETCH_SELLER_BOOK_LIST, fetchSellerBook);
}

// function for call socket and handle socket response
function* fetchSellerBook({ payload }) {
    try {
        let url = Method.GetSellerBook + '/' + payload.Pair;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(fetchSellerBookListSuccess(response));
    } catch (e) {
        yield put(fetchSellerBookListFailure(e))
    }
}