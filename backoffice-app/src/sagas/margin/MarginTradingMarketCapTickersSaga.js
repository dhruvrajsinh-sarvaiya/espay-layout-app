import { put, call, takeEvery, select } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { GET_MARGIN_MARKET_CAP_TIKER, UPDATE_MARGIN_MARKET_CAP_TIKER } from '../../actions/ActionTypes';
import { getMarginMarketCapTickersSuccess, getMarginMarketCapTickersFailure, updateMarginCapMarketTickersSuccess, updateMarginCapMarketTickersFailure } from '../../actions/Margin/MarginTradingMarketCapTickersActions';
import { userAccessToken } from '../../selector';

export default function* MarginTradingMarketCapTickersSaga() {

    //For get market tickers
    yield takeEvery(GET_MARGIN_MARKET_CAP_TIKER, getMarketTickers);

    //For update market tickers
    yield takeEvery(UPDATE_MARGIN_MARKET_CAP_TIKER, updateMarketTickers);
}

function* getMarketTickers({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetMarketTickerPairData

        // Add IsMargin params in request url if IsMargin payload is 1
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call Get Margin Market Cap Ticker Data Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set Get Margin Market Cap Ticker success response to reducer
        yield put(getMarginMarketCapTickersSuccess(response))
    } catch (e) {
        // To set Get Margin Market Cap Ticker failure response to reducer
        yield put(getMarginMarketCapTickersFailure())
    }
}

function* updateMarketTickers({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken)
        var headers = { 'Authorization': token }

        // To call Update Margin Market Cap Ticker Data Api
        const response = yield call(swaggerPostAPI, Method.UpdateMarketTickerPairData, payload, headers);

        // To set Update Margin Market Cap Ticker success response to reducer
        yield put(updateMarginCapMarketTickersSuccess(response))
    } catch (e) {
        // To set Update Margin Market Cap Ticker failure response to reducer
        yield put(updateMarginCapMarketTickersFailure())
    }
}