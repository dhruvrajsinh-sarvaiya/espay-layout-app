import { put, call, takeEvery, all, fork } from 'redux-saga/effects';
import { DEVICE_AUTHORIZE } from '../actions/ActionTypes';
import { Method } from '../controllers/Constants';
import { swaggerGetAPI } from '../api/helper';
import {
    deviceAuthorizeSuccess,
    deviceAuthorizeFailure
} from '../actions/Login/DeviceAuthorizationAction';

export default function* DeviceAuthorizationSaga() {
    yield all([
        fork(deviceAuthorizeSagas)
    ]);
}

/* Create Sagas method for Email Confirmation */
export function* deviceAuthorizeSagas() {
    yield takeEvery(DEVICE_AUTHORIZE, deviceAuthorizeAPI);
}

function* deviceAuthorizeAPI({ payload }) {
    const response = yield call(swaggerGetAPI, Method.DeviceAuthorizeV1 + '?authorizecode=' + payload.authorizecode, {}, {}, true);
    try {
        yield put(deviceAuthorizeSuccess(response));
    } catch (error) {
        yield put(deviceAuthorizeFailure(error));
    }
}
