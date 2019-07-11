// sagas For Active Open Order By Tejas Date : 14/9/2018

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import { GET_ACTIVE_OPEN_ORDER_LIST } from 'Actions/types';

// action sfor set data or response
import { getRecentOrderListSuccess, getRecentOrderListFailure } from 'Actions/Trade';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get Open Order list data by :Tejas Date : 14/9/2018
function* getRecentOrderList() {
    yield takeEvery(GET_ACTIVE_OPEN_ORDER_LIST, getRecentOrderListData)
}

// Function for Open Oders
function* getRecentOrderListData({ payload }) {

    // code changed by devang parekh for handling margintrading data (23-2-2019)
    var isMargin = '';
    if (payload.hasOwnProperty('IsMargin') && payload.IsMargin === 1) {
        isMargin = '?IsMargin=1';
    }
    // end

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/GetRecentOrder' + isMargin, payload.Pair, headers);

    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(getRecentOrderListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(getRecentOrderListSuccess(response));
        } else {
            yield put(getRecentOrderListFailure(response));
        }
    } catch (error) {
        yield put(getRecentOrderListFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getRecentOrderList)
    ]);
}