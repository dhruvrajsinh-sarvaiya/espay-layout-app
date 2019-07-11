/* 
    Developer : Parth Andhariya
    Date : 15-04-2019
    File Comment : IP Wise Request report saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerPostAPI
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_IP_WISE_REQUEST_REPORT
} from "Actions/types";
import {
    getIPWiseRequestReportSuccess,
    getIPWiseRequestReportFailure
} from "Actions/IPWiseRequestReportAction";

//get Ip Wise list from API
function* getIPWiseRequestReportApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, "api/BackOfficeAPIConfiguration/GetIPAddressWiseReport", request, headers);
    try {
        // check response code
        if (response.ReturnCode == 0) {
            yield put(getIPWiseRequestReportSuccess(response));
        } else {
            yield put(getIPWiseRequestReportFailure(response));
        }
    } catch (error) {
        yield put(getIPWiseRequestReportFailure(error));
    }
}
/* get Ip Wise list */
export function* getIPWiseRequestReport() {
    yield takeEvery(GET_IP_WISE_REQUEST_REPORT, getIPWiseRequestReportApi);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getIPWiseRequestReport),
    ]);
}
