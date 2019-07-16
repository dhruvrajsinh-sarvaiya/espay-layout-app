import { FETCH_OPEN_ORDER_HISTORY, CANCEL_OPEN_ORDER } from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from "../../api/helper";
import { Method } from "../../controllers/Constants";
import {
    openOrderSuccess,
    openOrderFailure,
    cancelOpenOrderSuccess,
    cancelOpenOrderFailure,
} from "../../actions/Trade/OpenOrderActions";
import { put, call, select, takeLatest } from 'redux-saga/effects';

export default function* openOrderSaga() {
    //For Open Orders
    yield takeLatest(FETCH_OPEN_ORDER_HISTORY, getOpenOrders);

    // For Cancel Open Order
    yield takeLatest(CANCEL_OPEN_ORDER, getCancelOpenOrder)
}

function* getOpenOrders({ payload }) {

    try {
        let params = {}

        //If pair name is not undefined then pass pair name
        if (payload.pairName) {
            params = { ...params, Pair: payload.pairName };
        }

        //If Order Type is not undefined then pass Order Type
        if (payload.orderType) {
            params = { ...params, OrderType: payload.orderType };
        }

        //If IsMargin is not undefined then pass IsMargin
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            params = { ...params, IsMargin: payload.IsMargin };
        }

        //If fromDate and toDate is not undefined then pass range dates.
        if (payload.fromDate && payload.toDate) {
            params = { ...params, FromDate: payload.fromDate, ToDate: payload.toDate };
        }

        //Passing page number, If page is not passed in payload then use 1 page
        params = { ...params };

        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const response = yield call(swaggerPostAPI, Method.GetActiveOrder, params, headers);
        yield put(openOrderSuccess(response))
    } catch (error) {
        yield put(openOrderFailure());
    }
}

function* getCancelOpenOrder({ payload }) {
    try {
        let token = yield select(userAccessToken)
        var headers = { 'Authorization': token }

        if (payload.IsMargin !== undefined && payload.IsMargin == 0) {
            delete payload['IsMargin'];
        }
        const response = yield call(swaggerPostAPI, Method.CancelOrder, payload, headers);
        yield put(cancelOpenOrderSuccess(response))
    } catch (error) {
        yield put(cancelOpenOrderFailure());
    }
}