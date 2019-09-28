import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_MARKET_TICKERS, UPDATE_MARKET_TICKER } from '../../actions/ActionTypes';
import { getMarketTickersBOSuccess, getMarketTickersBOFailure, updateMarketTickersBOSuccess, updateMarketTickersBOFailure } from '../../actions/Trading/TradingMarketTickersActions';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* tradingMarketTickersBOSaga() {

    //For get market tickers
    yield takeEvery(GET_MARKET_TICKERS, getMarketTickers);

    //For update market tickers
    yield takeEvery(UPDATE_MARKET_TICKER, updateMarketTickers);
}

function* getMarketTickers({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        let url = Method.GetMarketTicker
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call get market ticker api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set get market ticker success response to reducer
        yield put(getMarketTickersBOSuccess(response))
    } catch (e) {

        // To set get market ticker failure response to reducer
        yield put(getMarketTickersBOFailure())
    }
}

function* updateMarketTickers({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update market ticker api
        const response = yield call(swaggerPostAPI, Method.UpdateMarketTickerPairData, payload, headers);

        // To set update market ticker success response to reducer
        yield put(updateMarketTickersBOSuccess(response))
    } catch (e) {

        // To set update market ticker failure response to reducer
        yield put(updateMarketTickersBOFailure())
    }
}