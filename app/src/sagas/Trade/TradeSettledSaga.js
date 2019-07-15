import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TRADE_SETTLED_DATA } from '../../actions/ActionTypes';
import { getTradeSettledSuccess, getTradeSettledFailure } from '../../actions/Trade/TradeSettledActions';
import { swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';

export default function* tradeSettledSaga() {

    //For get trade settled data
    yield takeEvery(GET_TRADE_SETTLED_DATA, getTradeSettledData);
}

function* getTradeSettledData({ payload }) {
    try {
        let token = yield select(userAccessToken);
        let headers = { "Authorization": token };

        if (payload.IsMargin !== undefined && payload.IsMargin == 0) {
            delete payload['IsMargin'];
        }
        const response = yield call(swaggerPostAPI, Method.TradeSettledHistory, payload, headers);
        yield put(getTradeSettledSuccess(response))
    } catch (e) {
        yield put(getTradeSettledFailure(e.message))
    }
}