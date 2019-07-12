import { put, call, takeEvery } from 'redux-saga/effects';
import { GET_MARKET_DEPTH_DATA } from '../../actions/ActionTypes';
import { getMarketDepthDataSuccess, getMarketDepthDataFailure } from '../../actions/Trade/MarketDepthActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';

export default function* marketDepthSaga() {

    //For get market depth chart data
    yield takeEvery(GET_MARKET_DEPTH_DATA, getMarketDepthChart);
}

function* getMarketDepthChart({ payload }) {
    try {
        let url = Method.GetMarketDepthChart + '/' + payload.Pair;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(getMarketDepthDataSuccess(response))
    } catch (e) {
        yield put(getMarketDepthDataFailure(e.message))
    }
}