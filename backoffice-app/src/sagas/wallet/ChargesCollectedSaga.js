import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, } from "../../api/helper";
import { GET_CHARGECOLLECTED_REPORT } from '../../actions/ActionTypes';
// import functions from action
import { getChargeCollectedReportSuccess, getChargeCollectedReportFailure } from '../../actions/Wallet/ChargesCollectedAction';
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";

function* getChargeCollectedReportRequest({ payload }) {

    try {
        const request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.TrnChargeLogReport + "/" + request.PageNo + "/" + request.PageSize + "?";
        if (request.hasOwnProperty("TrnNo") && request.TrnNo != "") {
            URL += "&TrnNo=" + request.TrnNo;
        }
        if (request.hasOwnProperty("WalleTypeId") && request.WalleTypeId != "") {
            URL += "&WalleTypeId=" + request.WalleTypeId;
        }
        if (request.hasOwnProperty("Status") && request.Status != "") {
            URL += "&Status=" + request.Status;
        }
        if (request.hasOwnProperty("TrnTypeID") && request.TrnTypeID != "") {
            URL += "&TrnTypeID=" + request.TrnTypeID;
        }
        if (request.hasOwnProperty("SlabType") && request.SlabType != "") {
            URL += "&SlabType=" + request.SlabType;
        }
        if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
            URL += "&ToDate=" + request.ToDate;
        }
        if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
            URL += "&FromDate=" + request.FromDate;
        }

        // To call Charges Collected List Data Api
        const response = yield call(swaggerGetAPI, URL, request, headers);

        // To set Charges Collected List success response to reducer
        yield put(getChargeCollectedReportSuccess(response));
    } catch (error) {

        // To set Charges Collected List Failure response to reducer
        yield put(getChargeCollectedReportFailure(error));
    }
}

// To call Charges Collected List Api
function* getChargeCollectedReport() {
    yield takeEvery(GET_CHARGECOLLECTED_REPORT, getChargeCollectedReportRequest);
}

// link to root saga middleware
export default function* rootSaga() {
    yield all([fork(getChargeCollectedReport)]);
}
