import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI, swaggerGetAPI, queryBuilder } from "../../api/helper";
import { GET_MESSAGE_QUE_LIST, GET_RESEND_MESSAGE } from "../../actions/ActionTypes";
import {
    getMessageQueSuccess, getMessageQueFailure,
    getResendMessageSuccess, getResendMessageFailure
} from "../../actions/CMS/MessageQueActions";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";

//call Apis
export default function* MessageQueSaga() {
    yield takeEvery(GET_MESSAGE_QUE_LIST, getMessageQueApi);
    yield takeEvery(GET_RESEND_MESSAGE, getResendMessageApi);
}

function* getMessageQueApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        let url = Method.GetMessagingQueue + payload.FromDate + '/' + payload.ToDate + '/' + payload.Page;

        delete payload.FromDate
        delete payload.ToDate
        delete payload.Page

        url = url + queryBuilder(payload)

        // To call Message Que list Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set Message Que list success response to reducer
        yield put(getMessageQueSuccess(response));
    } catch (error) {

        // To set Message Que list failure response to reducer
        yield put(getMessageQueFailure(error));
    }
}

function* getResendMessageApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        let url = Method.ResendSMS + payload.MessageID

        // To call resendsms Api
        const response = yield call(swaggerPostAPI, url, payload, headers);

        // To set resendsms success response to reducer
        yield put(getResendMessageSuccess(response));
    } catch (error) {

        // To set resendsms failure response to reducer
        yield put(getResendMessageFailure(error));
    }
}


