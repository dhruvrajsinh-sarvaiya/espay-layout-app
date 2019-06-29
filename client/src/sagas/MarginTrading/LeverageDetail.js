// Dev: Devang Parekh 
// Date : 6-3-2019
// sagas For get leverage detail for margin trading dashboard ()

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import { GET_LEVERAGE_DETAIL } from 'Actions/types';
// action for set data or response
import { getLeverageDetailSuccess, getLeverageDetailFailure } from 'Actions/MarginTrading';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get get charge type list data by :Tejas Date : 6/2/2019
function* getLeverageDetail() {
    yield takeEvery(GET_LEVERAGE_DETAIL, getLeverageDetailRequest)
}

// Function for Open Oders
function* getLeverageDetailRequest({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, '/api/MarginWallet/GetPairLeverageDetail?FirstCurrency=' + payload.firstCurrency + '&SecondCurrency=' + payload.secondCurrency, payload, headers);

    try {

        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(getLeverageDetailFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(getLeverageDetailSuccess(response));
        } else {
            yield put(getLeverageDetailFailure(response));
        }

    } catch (error) {
        yield put(getLeverageDetailFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getLeverageDetail),
    ]);
}