// HttpErrorCodeSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_HTTP_ERROR_CODE_LIST } from '../../actions/ActionTypes';
import { getHttpErrorCodeListSuccess, getHttpErrorCodeListFailure } from '../../actions/ApiKeyConfiguration/HttpErrorCodeAction';

export default function* HttpErrorCodeSaga() {
    // To register Get Http Error Code Data method
    yield takeEvery(GET_HTTP_ERROR_CODE_LIST, httpErrorCode)
}

// Generator for Get Http Error Code Data
function* httpErrorCode({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Http Error Code Data Api
        const data = yield call(swaggerPostAPI, Method.GetHttpErrorCodeReport, payload, headers)

        // To set Get Http Error Code Data success response to reducer
        yield put(getHttpErrorCodeListSuccess(data))
    } catch (error) {
        // To set Get Http Error Code Data failure response to reducer
        yield put(getHttpErrorCodeListFailure())
    }
}