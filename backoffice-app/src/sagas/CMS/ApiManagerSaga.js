import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import { getEmailApiManagerListSuccess, getEmailApiManagerListFailure, addEmailApiManagerSuccess, addEmailApiManagerFailure, editEmailApiManagerSuccess, editEmailApiManagerFailure, getAllRequestFormatSuccess, getAllRequestFormatFailure } from "../../actions/CMS/ApiManagerActions";
import { GET_EMAIL_API_MANAGER_LIST, ADD_EMAIL_API_MANAGER, EDIT_EMAIL_API_MANAGER, GET_REQUEST_FORMAT } from "../../actions/ActionTypes";

//call Apis
export default function* ApiManagerSaga() {
    yield takeEvery(GET_EMAIL_API_MANAGER_LIST, getEmailApiManagerApi);
    yield takeEvery(ADD_EMAIL_API_MANAGER, addEmailApiManagerApi);
    yield takeEvery(EDIT_EMAIL_API_MANAGER, editEmailApiManagerApi);
    yield takeEvery(GET_REQUEST_FORMAT, getAllRequestFormatApi);
}

function* getEmailApiManagerApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Email Que list Api
        const response = yield call(swaggerGetAPI, Method.GetCommunicationServiceConfig + payload.type, {}, headers);

        // To set Email Que list success response to reducer
        yield put(getEmailApiManagerListSuccess(response));
    } catch (error) {

        // To set Email Que list failure response to reducer
        yield put(getEmailApiManagerListFailure(error));
    }
}

function* addEmailApiManagerApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add email Api
        const response = yield call(swaggerPostAPI, Method.AddCommunicationServiceConfig, payload, headers);

        // To set add email success response to reducer
        yield put(addEmailApiManagerSuccess(response));
    } catch (error) {

        // To set add email failure response to reducer
        yield put(addEmailApiManagerFailure(error));
    }
}

function* editEmailApiManagerApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call edit email Api
        const response = yield call(swaggerPostAPI, Method.UpdateCommunicationServiceConfig, payload, headers);

        // To set edit email success response to reducer
        yield put(editEmailApiManagerSuccess(response));
    } catch (error) {

        // To set edit email failure response to reducer
        yield put(editEmailApiManagerFailure(error));
    }
}

function* getAllRequestFormatApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call all request format Api
        const response = yield call(swaggerGetAPI, Method.GetAllRequestFormat, {}, headers);

        // To set all request format success response to reducer
        yield put(getAllRequestFormatSuccess(response));
    } catch (error) {

        // To set all request format failure response to reducer
        yield put(getAllRequestFormatFailure(error));
    }
}





