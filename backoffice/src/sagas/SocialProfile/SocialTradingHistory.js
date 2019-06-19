/**
 * Author : Saloni Rathod
 * Created : 20/03/2019
 * Social Trading History
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    // Social Trading History
    SOCIAL_TRADING_HISTORY_LIST,

} from 'Actions/types';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
    socialTradingHistoryListSuccess,
    socialTradingHistoryListFailure,

} from 'Actions/SocialProfile';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for  Social Trading History
function* socialTradingHistoryListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/GetCopiedLeaderOrders', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(socialTradingHistoryListSuccess(response));
        } else {
            yield put(socialTradingHistoryListFailure(response));
        }
    } catch (error) {
        yield put(socialTradingHistoryListFailure(error));
    }
}



/* Create Sagas method for  Social Trading History */
export function* socialTradingHistoryListSagas() {
    yield takeEvery(SOCIAL_TRADING_HISTORY_LIST, socialTradingHistoryListAPI);
}



/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(socialTradingHistoryListSagas),
    ]);
}