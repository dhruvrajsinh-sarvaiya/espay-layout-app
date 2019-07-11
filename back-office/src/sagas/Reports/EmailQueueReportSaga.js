import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    GET_EMAIL_QUEUE_REQUEST,
    RESEND_EMAIL_QUEUE_REQUEST
} from "Actions/types";

import {
    displayEmailQueueListSuccess,
    displayEmailQueueListFail,
    resentEmailRequestSuccess,
    resentEmailRequestFail
} from "Actions/Reports";
import { swaggerGetAPI, swaggerPostAPI } from "Helpers/helpers";

function* displayEmailQueueList() {
    yield takeEvery(GET_EMAIL_QUEUE_REQUEST, displayEmailListReportSaga);
}

function* displayEmailListReportSaga({ payload }) {

    try {

        const data = payload.makeLedgerRequest;
        let queryParams = '';
        const requestparam = {};
        const createQueryParams = params =>
            Object.keys(params)
                .map(k => `${k}=${encodeURI(params[k])}`)
                .join('&');

        if (data.Status !== undefined && data.Status !== '') {
            requestparam.Status = parseInt(data.Status);
        }
        if (data.PageSize !== undefined && data.PageSize !== '') {
            requestparam.PageSize = data.PageSize;
        }

        if (Object.keys(requestparam).length > 0) {
            queryParams = createQueryParams(requestparam);
        }
        const response = yield call(swaggerGetAPI, 'api/MasterConfiguration/GetEmailQueue/' + data.FromDate + '/' + data.ToDate + '/' + data.Page + (queryParams !== "" ? '?' + queryParams : ''), {});

        if (response != null && response.ReturnCode === 0) {
            yield put(displayEmailQueueListSuccess(response));
        } else {
            yield put(displayEmailQueueListFail(response));
        }
    } catch (error) {
        yield put(displayEmailQueueListFail(error));
    }
}

function* resendEmailQueue() {
    yield takeEvery(RESEND_EMAIL_QUEUE_REQUEST, resentEmailQueueSaga);
}

function* resentEmailQueueSaga({ payload }) {

    const response = yield call(swaggerPostAPI, 'api/GlobalNotification/ResendEmail/' + payload.EmailID, payload, 1);

    try {
        if (response.ReturnCode === 0) {
            yield put(resentEmailRequestSuccess(response));
        } else {
            yield put(resentEmailRequestFail(response));
        }
    } catch (error) {
        yield put(resentEmailRequestFail(error));
    }
}

export default function* rootSaga() {
    yield all([
        fork(displayEmailQueueList),
        fork(resendEmailQueue),
    ]);
}