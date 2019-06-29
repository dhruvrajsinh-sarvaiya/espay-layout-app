// sagas For Active Open Order By Tejas Date : 14/9/2018

// for call api call or API Call
import api from 'Api';
// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import AppConfig from 'Constants/AppConfig';
import { redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

// types for set actions and reducers
import { GET_ACTIVE_OPEN_ORDER_LIST, DO_CANCEL_ORDER } from 'Actions/types';

// action sfor set data or response
import {
    getActiveOpenOrderListSuccess, getActiveOpenOrderListFailure,
    doCancelOrderSuccess, doCancelOrderFailure
} from 'Actions/Trade';
const socketUrl = AppConfig.socketAPIUrl;
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get Open Order list data by :Tejas Date : 14/9/2018
function* getActiveOpenOrderList() {
    yield takeEvery(GET_ACTIVE_OPEN_ORDER_LIST, getActiveOpenOrderListData)
}

//WebSocket Call...
const watchMessages = (socket, request) => eventChannel((emit) => {
    socket.onopen = () => {
        socket.send(JSON.stringify(request)) // Send data to server
    };
    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        emit(msg);
    };
    return () => {
        socket.close();
    };
});

// Function for Open Oders
function* getActiveOpenOrderListData({ payload }) {
    let request = {
        m: 6,
        i: 0,
        n: 'GetRecentOrder',
        t: 1,
        r: 5,
        h: { tokenID: localStorage.getItem('tokenID') },
        o: payload.Pair
    }

    const socket = new WebSocket(socketUrl);
    const socketChannel = yield call(watchMessages, socket, request);
    try {
        const response = yield take(socketChannel);
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            const staticRes = staticResponse(response.statusCode);
            yield put(getActiveOpenOrderListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(getActiveOpenOrderListSuccess(response));
        } else {
            yield put(getActiveOpenOrderListFailure(response));
        }
    } catch (error) {
        yield put(getActiveOpenOrderListFailure(error));
    }
}

// Sagas Function for do Bulk Order list data by :Tejas Date : 20/9/2018
function* doCancelOrder() {
    yield takeEvery(DO_CANCEL_ORDER, doCancelOrderData)
}

// Function for set do Bulk Order data and Call Function for Api Call
function* doCancelOrderData({ payload }) {
    const { Order } = payload
    try {
        const response = yield call(doCancelOrderRequest, Order)
        // set response if its available else set error message
        if (response && response != null && response !== undefined) {
            yield put(doCancelOrderSuccess(response))
        } else {
            yield put(doCancelOrderFailure("error"))
        }
    } catch (error) {
        yield put(doCancelOrderFailure(error))
    }
}

// function for Call api and set response 
const doCancelOrderRequest = async (Order) =>
    await api.get('cancelOrder.js')
        .then(response => response)
        .catch(error => error)

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getActiveOpenOrderList),
        fork(doCancelOrder)
    ]);
}