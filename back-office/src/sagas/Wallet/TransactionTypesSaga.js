//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    redirectToLogin,
    loginErrCode,
} from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
//Action Types..
import {
    WITHDRAWALSUMMARY
} from 'Actions/types';
//Action methods..
import {
    getWithdrawSummarySuccess,
    getWithdrawSummaryFail
} from 'Actions/Wallet';
// swagger url from app config
import AppConfig from 'Constants/AppConfig';

//get withdrawal summary from API
function* getWithdrawSummaryAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/WithdrawalSummary', { "FromDate": "2018-12-01", "ToDate": "2018-12-05" }, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(getWithdrawSummarySuccess(response));
            } else {
                yield put(getWithdrawSummaryFail(response));
            }
        }
    } catch (error) {
        yield put(getWithdrawSummaryFail(error));
    }
}
/* get withdrawal summary */
export function* getWithdrawSummary() {
    yield takeEvery(WITHDRAWALSUMMARY, getWithdrawSummaryAPI);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getWithdrawSummary),
    ]);
}