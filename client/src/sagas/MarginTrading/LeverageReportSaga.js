/**
 *   Developer : Parth Andhariya
 *   Date : 05-03-2019
 *   Component: Leverge Report Saga
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI,swaggerPostAPI } from 'Helpers/helpers';

import { GET_LEVERAGE_REPORT_LIST ,UPGRADE_LOAN} from "Actions/types";
import {
    getLeverageReportListSuccess,
    getLeverageReportListFailure,
    getUpgradeLoanSuccess,
    getUpgradeLoanFailure
} from "Actions/MarginTrading";
//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

function* getLeverageReportListDetails(payload) {
    var request = payload.payload;
    try {
        var url = "api/MarginWallet/LeverageRequestReport/" + request.PageNo + "/" + request.PageSize + "?";
        var headers = { 'Authorization': AppConfig.authorizationToken };

        if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
            url += '&FromDate=' + request.FromDate;
        }
        if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
            url += '&ToDate=' + request.ToDate;
        }
        if (request.hasOwnProperty("Status") && request.Status != "") {
            url += '&Status=' + request.Status;
        }
        if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
            url += '&WalletTypeId=' + request.WalletTypeId;
        }
        // delete request.PageNo;
        // delete request.PageSize;
        const response = yield call(swaggerGetAPI, url, request, headers);
        if (response.ReturnCode === 0) {
            yield put(getLeverageReportListSuccess(response));
        } else {
            yield put(getLeverageReportListFailure(response));
        }
    } catch (error) {
        yield put(getLeverageReportListFailure(error));
    }
}
//get api for Leverge Report 
function* getLeverageReportList() {
    yield takeEvery(GET_LEVERAGE_REPORT_LIST, getLeverageReportListDetails);
}

function* getUpdateFromApi( payload ) {
    var request = payload.payload;
        var headers = { 'Authorization': AppConfig.authorizationToken };
        var url ="api/MarginWallet/UpgradeLoan?"
        if (request.hasOwnProperty("LoanID") && request.LoanID != "") {
            url += '&LoanID=' + request.LoanID;
        }
        if (request.hasOwnProperty("LeverageX") && request.LeverageX != "") {
            url += '&LeverageX=' + request.LeverageX;
        }
        const response = yield call(swaggerPostAPI,url ,request, headers);
        try{
        if (response.ReturnCode === 0) {
            yield put(getUpgradeLoanSuccess(response));
        } else {
            yield put(getUpgradeLoanFailure(response));
        }
    
    } catch (error) {
        yield put(getUpgradeLoanFailure(error));
    }
}
function* getUpdateLoan() {
    yield takeEvery(UPGRADE_LOAN, getUpdateFromApi);
}
export default function* rootSaga() {
    yield all([
        fork(getLeverageReportList),
        fork(getUpdateLoan)
    ]);
}
