import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import { addRequestFormatSuccess, addRequestFormatFailure, editRequestFormatSuccess, editRequestFormatFailure } from "../../actions/CMS/RequestFormatApiActions";
import { ADD_REQUEST_FORMAT, EDIT_REQUEST_FORMAT } from "../../actions/ActionTypes";

//call Apis
export default function* RequestFormatApiSaga() {
    yield takeEvery(ADD_REQUEST_FORMAT, addRequestFormatApi);
    yield takeEvery(EDIT_REQUEST_FORMAT, editRequestFormatApi);
}

function* addRequestFormatApi({ request }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add request format Api
        const response = yield call(swaggerPostAPI, Method.AddRequestFormat, request, headers);

        // To set add request format success response to reducer
        yield put(addRequestFormatSuccess(response));
    } catch (error) {

        // To set add request format failure response to reducer
        yield put(addRequestFormatFailure(error));
    }
}

function* editRequestFormatApi({ request }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call edit request format Api
        const response = yield call(swaggerPostAPI, Method.UpdateRequestFormat, request, headers);

        // To set edit request format success response to reducer
        yield put(editRequestFormatSuccess(response));
    } catch (error) {

        // To set edit request format failure response to reducer
        yield put(editRequestFormatFailure(error));
    }
}






