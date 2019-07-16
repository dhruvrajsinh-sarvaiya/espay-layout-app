import {
    FETCH_MARKET_TRADE_LIST,
   } from '../../actions/ActionTypes'
import { put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { swaggerGetAPI } from '../../api/helper';
import { fetchMarketTradeListSuccess, fetchMarketTradeListFailure } from '../../actions/Trade/GlobalMarketTradeAction';

export default function* GlobalMarketTradeSaga() {
    // For Maarket Trading History
    yield takeLatest(FETCH_MARKET_TRADE_LIST, fetchMarketTrading);
}

// Function for set response to data and Call Function for Api Call
function* fetchMarketTrading({ payload }) {
    try {

        let url = Method.GetOrderhistory + '?Pair=' + payload.Pair;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '&IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(fetchMarketTradeListSuccess(response));
    } catch (error) {
        yield put(fetchMarketTradeListFailure())
    }
}

