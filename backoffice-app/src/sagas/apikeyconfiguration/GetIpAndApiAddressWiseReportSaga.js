import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import { getApiWiseReportSuccess, getApiWiseReportFailure, getIpAddressWiseReportSuccess, getIpAddressWiseReportFailure } from "../../actions/ApiKeyConfiguration/GetIpAndApiAddressWiseReportActions";
import { GET_API_WISE_REPORT, GET_IP_ADDRESS_WISE_REPORT } from "../../actions/ActionTypes";

//call Apis
export default function* GetIpAndApiAddressWiseReportSaga() {
    // To register Get Api Wise Report method
    yield takeEvery(GET_API_WISE_REPORT, getApiWiseReportApi);
    // To register Get IP Address Wise Report method
    yield takeEvery(GET_IP_ADDRESS_WISE_REPORT, getIpAddressWiseReportApi);
}

// Generator for Api Wise Report
function* getApiWiseReportApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        let request = {};
        var headers = { 'Authorization': token };

        if (payload.MemberID !== undefined && payload.MemberID !== '') {
            request = {
                ...request,
                MemberID: payload.MemberID
            }
        }
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            request = {
                ...request, FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            request = {
                ...request, ToDate: payload.ToDate
            }
        }
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            request = {
                ...request,
                Pagesize: payload.PageSize
            }
        }
        if (payload.PageIndex !== undefined && payload.PageIndex !== '') {
            request = {
                ...request, PageNo: payload.PageIndex - 1
            }
        }

        // To call api wise report Api
        const response = yield call(swaggerPostAPI, Method.GetAPIWiseReport, request, headers);

        // To set api wise report success response to reducer
        yield put(getApiWiseReportSuccess(response));
    } catch (error) {

        // To set api wise report failure response to reducer
        yield put(getApiWiseReportFailure(error));
    }
}

// Generator for IP Address Wise Report
function* getIpAddressWiseReportApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        // create request
        let request = {};

        var headers = { 'Authorization': token };
        if (payload.MemberID !== undefined && payload.MemberID !== '') {
            request = {
                ...request,
                MemberID: payload.MemberID
            }
        }
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            request = {
                ...request,
                FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            request = {
                ...request,
                ToDate: payload.ToDate
            }
        }
        if (payload.IPAddress !== undefined && payload.IPAddress !== '') {
            request = {
                ...request, IPAddress: payload.IPAddress
            }
        }
        if (payload.PageSize !== undefined
            && payload.PageSize !== '') {
            request = {
                ...request,
                Pagesize: payload.PageSize
            }
        }
        if (payload.PageIndex !== undefined && payload.PageIndex !== '') {
            request = { ...request, PageNo: payload.PageIndex - 1 }
        }

        // To call ip address wise report list Api
        const response = yield call(swaggerPostAPI, Method.GetIPAddressWiseReport, request, headers);

        // To set ip address wise report list success response to reducer
        yield put(getIpAddressWiseReportSuccess(response));
    } catch (error) {

        // To set ip address wise report list failure response to reducer
        yield put(getIpAddressWiseReportFailure(error));
    }
}