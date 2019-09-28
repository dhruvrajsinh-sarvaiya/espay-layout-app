import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { sendEmailDataSuccess, sendEmailDataFailure } from '../../actions/CMS/SendEmailActions';
import { SEND_EMAIL_DATA } from '../../actions/ActionTypes';

export default function* SendEmailSaga() {
    // To register Send Email Data method
    yield takeEvery(SEND_EMAIL_DATA, sendEmailDataApi);
}

// Generator for Send Email Data
function* sendEmailDataApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Send Email Data Data Api
        const data = yield call(swaggerPostAPI, Method.PushEmail, payload, headers);

        // To set Send Email Data success response to reducer
        yield put(sendEmailDataSuccess(data));
    } catch (error) {
        // To set Send Email Data failure response to reducer
        yield put(sendEmailDataFailure());
    }
}