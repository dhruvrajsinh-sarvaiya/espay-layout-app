
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { getLeverageReportSuccess, getLeverageReportFailure } from "../../actions/Margin/LeverageReportAction";
import { swaggerGetAPI } from "../../api/helper";
import { GET_LEVERAGE_REPORT } from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

function* getLeverageReportRequest(payload) {
    const request = payload.payload;

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // create request url
    var URL = Method.LeverageReport + '/' + request.FromDate + '/' + request.ToDate + '/' + request.PageNo + '/' + request.PageSize + '?';
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId !== "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("UserId") && request.UserId !== "") {
        URL += '&UserID=' + request.UserId;
    }
    if (request.hasOwnProperty("Status") && request.Status !== "") {
        URL += '&Status=' + request.Status;
    }

    try {
        // To call Get Leverage Report Data Api
        const response = yield call(swaggerGetAPI, URL, request, headers);

        // To set Leverage Report success response to reducer
        yield put(getLeverageReportSuccess(response));

    } catch (error) {
        // To set Leverage Report failure response to reducer
        yield put(getLeverageReportFailure(error));
    }
}

function* getLeverageReport() {
    // To register Get Leverage Report method
    yield takeEvery(GET_LEVERAGE_REPORT, getLeverageReportRequest);
}

export default function* rootSaga() {
    yield all([
        fork(getLeverageReport)
    ]);
}
