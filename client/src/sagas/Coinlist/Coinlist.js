/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 30-10-2018
    UpdatedDate : 30-10-2018
    Description : Coinlist Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    GET_COINLIST,
} from 'Actions/types';

import {
    getCoinlistSuccess,
    getCoinlistFailure
} from 'Actions/Coinlist';

import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;
import { swaggerGetAPI, loginErrCode, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Get Coin List API
function* getCoinlistAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllServiceConfiguration', {}, headers);
    try {

        if (response.statusCode === 200) {
            yield put(getCoinlistSuccess(response));
        } else {
            yield put(getCoinlistFailure(response));
        }
    } catch (error) {
        yield put(getCoinlistFailure(error));
    }
}
//Get Coinlist
export function* getCoinlist() {
    yield takeEvery(GET_COINLIST, getCoinlistAPI);
}

// Coinlist Root Saga
export default function* rootSaga() {
    yield all([
        fork(getCoinlist)
    ]);
}