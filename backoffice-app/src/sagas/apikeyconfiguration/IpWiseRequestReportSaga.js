// IpWiseRequestReportSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_IP_WISE_REPORT } from '../../actions/ActionTypes';
import { getIpWiseReportSuccess, getIpWiseReportFailure } from '../../actions/ApiKeyConfiguration/IpWiseRequestReportAction';

export default function* IpWiseRequestReportSaga() {
    // To register Get Ip Wise Request Report method
    yield takeEvery(GET_IP_WISE_REPORT, getIpWiseRequestReportData)
}

// Generator for Get Ip Wise Request Report
function* getIpWiseRequestReportData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Ip Wise Request Report Data Api
        const data = yield call(swaggerPostAPI, Method.GetIPAddressWiseReport, payload, headers)

        // To set Get Ip Wise Request Report success response to reducer
        yield put(getIpWiseReportSuccess(data))
    } catch (error) {
        // To set Get Ip Wise Request Report failure response to reducer
        yield put(getIpWiseReportFailure())
    }
}