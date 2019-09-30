import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI, swaggerGetAPI, queryBuilder } from "../../api/helper";
import { GET_EMAIL_QUE_LIST, GET_RESEND_EMAIL } from "../../actions/ActionTypes";
import {
    getEmailQueSuccess, getEmailQueFailure,
    getResendEmailSuccess, getResendEmailFailure
} from "../../actions/CMS/EmailQueActions";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";

//call Apis
export default function* EmailQueSaga() {
    yield takeEvery(GET_EMAIL_QUE_LIST, getEmailQueApi);
    yield takeEvery(GET_RESEND_EMAIL, getResendEmailApi);
}

function* getEmailQueApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        let url = Method.GetEmailQueue + payload.FromDate + '/' + payload.ToDate + '/' + payload.Page;

        delete payload.FromDate
        delete payload.ToDate
        delete payload.Page

        url = url + queryBuilder(payload)

        // To call Email Que list Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set Email Que list success response to reducer
        yield put(getEmailQueSuccess(response));
    } catch (error) {

        // To set Email Que list failure response to reducer
        yield put(getEmailQueFailure(error));
    }
}

function* getResendEmailApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        let url = Method.ResendEmail + payload.EmailID

        // To call resend email Api
        const response = yield call(swaggerPostAPI, url, payload, headers);

        // To set resend email success response to reducer
        yield put(getResendEmailSuccess(response));
    } catch (error) {

        // To set resend email failure response to reducer
        yield put(getResendEmailFailure(error));
    }
}


