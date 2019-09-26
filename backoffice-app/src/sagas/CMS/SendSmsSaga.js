// SendSmsSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { sendSmsDataSuccess, sendSmsDataFailure } from '../../actions/CMS/SendSmsAction';
import { SEND_SMS_DATA } from '../../actions/ActionTypes';

export default function* SendSmsSaga() {
    // To register Send SMS Data method
    yield takeEvery(SEND_SMS_DATA, sendEmailDataApi);
}

// Generator for Send SMS Data
function* sendEmailDataApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Send SMS Data Api
        const data = yield call(swaggerPostAPI, Method.PushSMS, payload, headers);

        // To set Send SMS Data success response to reducer
        yield put(sendSmsDataSuccess(data));
    } catch (error) {
        // To set Send SMS Data failure response to reducer
        yield put(sendSmsDataFailure());
    }
}