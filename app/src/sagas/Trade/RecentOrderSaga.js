import {
    FETCH_RECENT_ORDER,
} from '../../actions/ActionTypes'
import { put, call, select, takeLatest } from 'redux-saga/effects';
import {
    recentOrderSuccess, recentOrderFailure,
} from '../../actions/Trade/RecentOrderAction';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';
import {  swaggerPostAPI } from '../../api/helper';

export default function* recentOrderSaga() {
    // For Recent(My Order) Order
    yield takeLatest(FETCH_RECENT_ORDER, getRecentOrder);
}

function* getRecentOrder({ payload }) {
    
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        if (payload.IsMargin !== undefined && payload.IsMargin == 0) {
            delete payload['IsMargin'];
        }
        const response = yield call(swaggerPostAPI, Method.GetRecentOrder, payload, headers);
        yield put(recentOrderSuccess(response))
    } catch (error) {
        yield put(recentOrderFailure());
    }
}