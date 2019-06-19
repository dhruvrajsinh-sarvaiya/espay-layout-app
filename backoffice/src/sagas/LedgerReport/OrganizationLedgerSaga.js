import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    GET_ORGANIZATION_LEDGER_LIST,
} from "Actions/types";

import {
    displayOrganizationLedgerSuccess,
    displayOrganizationLedgerFail
} from "Actions/LedgerReports";

import {swaggerPostAPI} from "Helpers/helpers";
import axios from "axios";

const response = [{
    ledgerID:1,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
},{
    ledgerID:2,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
},{
    ledgerID:3,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
},{
    ledgerID:4,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
},{
    ledgerID:6,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
},{
    ledgerID:7,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
},{
    ledgerID:8,
    Amount:1000,
    creditAmount:10,
    debitAmount:0,
    previousBalance:900,
    postBalance:1100,
    remark:"Testing Static Data",
    date:"01-01-2019",
}];
function* displayOrganizationLedgerReport() {

    yield takeEvery(GET_ORGANIZATION_LEDGER_LIST, displayLedgerReportSaga);
}

function* displayLedgerReportSaga({ payload }) {

    // console.log('Payload in request : ',payload);
    try {
        //const res = yield call(fetchData);

        /*const response = res.data;

        if (response && response != null && response.ReturnCode === 0) {*/

            yield put(displayOrganizationLedgerSuccess(response));
        /*}else{

            yield put(displayOrganizationLedgerFail(response));
        }
*/
    } catch (error) {

        yield put(displayOrganizationLedgerFail(error));
    }
}
/*function* fetchData(){

    return yield axios.get('https://parocleandev.azurewebsites.net/FrontAPI/api/Transaction/GetOrderhistory?Pair=999')
        .then(function (response) {
            return response;
        })
        .catch(function (error) {

            return error;
        });
}*/

export default function* rootSaga() {
    yield all([
        fork(displayOrganizationLedgerReport),
    ]);
}