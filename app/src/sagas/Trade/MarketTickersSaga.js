import { put, call, takeLatest } from 'redux-saga/effects';
import { swaggerGetAPI } from '../../api/helper';
import { GET_MARKET_TICKER, } from '../../actions/ActionTypes'
import { getMarketTickerListSuccess, getMarketTickerListFailure } from '../../actions/Trade/MarketTickerActions';
import { Method } from '../../controllers/Constants';

export default function* marketTickersSaga() {

    // For getting market tickers list
    yield takeLatest(GET_MARKET_TICKER, getMarketTickers);
}

//To get Market Ticker list
function* getMarketTickers() {
    try {
        const response = yield call(swaggerGetAPI, Method.GetMarketTicker, {});
        yield put(getMarketTickerListSuccess(response))
    } catch (error) {
        yield put(getMarketTickerListFailure());
    }
}