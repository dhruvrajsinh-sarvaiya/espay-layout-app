/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : For Get Api Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_API,
} from 'Actions/types';

//import function from action
import {
    getApiSuccess,
} from 'Actions/Api';

/**
 * Send Api Request To Server
 */
const getApiRequest = async () =>
    await api.get('apis.js')
        .then(response => response.data)
        .catch(error => error);

/**
 * Get Api data From Server
 */
function* getApiFromServer() {
    try {
        const response = yield call(getApiRequest);
        yield put(getApiSuccess(response));
    } catch (error) {
        yield put(getApiSuccess(error));
    }
}

/**
 * Get Api
 */
export function* getApi() {
    yield takeEvery(GET_API, getApiFromServer);
}

/**
 * Faq Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getApi)
    ]);
}