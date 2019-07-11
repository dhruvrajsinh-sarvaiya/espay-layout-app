/* 
    Developer : Nishant Vadgama
    Date : 01-02-2019
    File Comment : Admin assets report saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
    redirectToLogin,
    loginErrCode,
} from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
import AppConfig from 'Constants/AppConfig';
import {
    GET_ADMINASSET_REPORT,
} from "Actions/types";
import {
    getAdminAssetReportSuccess,
    getAdminAssetReportFailure,
} from "Actions/AdminAsset";

//get asset list from API
function* getAdminAssetReportRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/AdminAssets/' + request.PageNo + '/' + request.PageSize + '?';
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("WalletUsageType") && request.WalletUsageType != "") {
        URL += '&WalletUsageType=' + request.WalletUsageType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(getAdminAssetReportSuccess(response));
            } else {
                yield put(getAdminAssetReportFailure(response));
            }
        }
    } catch (error) {
        yield put(getAdminAssetReportFailure(error));
    }
}
/* get asset list */
export function* getAdminAssetReport() {
    yield takeEvery(GET_ADMINASSET_REPORT, getAdminAssetReportRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getAdminAssetReport),
    ]);
}
