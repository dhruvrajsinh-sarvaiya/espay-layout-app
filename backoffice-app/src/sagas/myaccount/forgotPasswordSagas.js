import { call, put, takeLatest } from 'redux-saga/effects';
import { FORGOT_PASSWORD } from '../../actions/ActionTypes';

//Action methods..
import {
    forgotPasswordSuccess,
    forgotPasswordFailure
} from '../../actions/Login/ForgotPasswordAction';
import { Method } from '../../controllers/Methods';

import { swaggerPostAPI, slowInternetStaticResponse } from '../../api/helper';
import { getIPAddress } from '../../controllers/CommonUtils';

//Function for Forgot Password API
function* forgotPasswordAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(forgotPasswordSuccess(slowInternetStaticResponse()));
        } else {
            // To set Forgot Password success response to reducer
            const response = yield call(swaggerPostAPI, Method.ForgotPassword, payload);
            yield put(forgotPasswordSuccess(response));
        }
    } catch (error) {
        // To set Forgot Password failure response to reducer
        yield put(forgotPasswordFailure(error));
    }
}


/* Create Sagas method for Forgot Password */
function* forgotPasswordSagas() {
    yield takeLatest(FORGOT_PASSWORD, forgotPasswordAPI);

}

export default forgotPasswordSagas