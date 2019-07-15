import { FETCH_MARKET_CAP } from "../../actions/ActionTypes";
import { swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Constants";
import { put, call, takeLatest } from 'redux-saga/effects';
import { marketCapSuccess, marketCapFailure } from "../../actions/Trade/MarketCapActions";

export default function* marketCapSaga() {
    //For Market Cap Details > Screen : Trade History Detail
    yield takeLatest(FETCH_MARKET_CAP, fetchMarketCap);
}

function* fetchMarketCap({ payload }) {
    try {
        let url = Method.GetMarketCap + '/' + payload.Pair;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(marketCapSuccess(response))
    } catch (error) {
        yield put(marketCapFailure());
    }
}