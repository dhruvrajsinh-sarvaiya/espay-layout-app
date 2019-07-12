import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";
// types for set actions and reducers
import { userAccessToken } from "../selector";
import { Method } from "../controllers/Constants";
import { swaggerDeleteAPI } from "../api/helper";
import { DELETE_API_KEY } from "../actions/ActionTypes";
import { deleteApiKeySuccess, deleteApiKeyFailure } from "../actions/ApiKey/ApiKeyDeleteAction";

// Sagas Function for delete api Key list
function* deleteApiKeyList() {
    // To register Delete Api Key method
    yield takeLatest(DELETE_API_KEY, deleteApiKeyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* deleteApiKeyListDetail({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Delete Api Ket List Detail api
        const response = yield call(swaggerDeleteAPI, Method.DeleteAPIKey + '/' + payload.planKey, {}, headers);

        // To set Delete Api Key List success response to reducer
        yield put(deleteApiKeySuccess(response));
    } catch (error) {
        // To set Delete Api Key List failure response to reducer
        yield put(deleteApiKeyFailure(error));
    }
}

// Function for root saga
export default function* rootSaga() {
    yield all([fork(deleteApiKeyList),]);
}