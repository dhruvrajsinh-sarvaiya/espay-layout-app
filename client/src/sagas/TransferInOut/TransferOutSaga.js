/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    FIle Comment : Deposit history action method's saga implementation
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import api from 'Api';
import api from "Api";

// import types for dispatch puropse
import { GET_EXTERNALTRANSFER_HISTORY } from "Actions/types";

// import functions from action
import {
    getExternalTransferHistorySuccess,
    getExternalTransferHistoryFailure
} from "Actions/TransferInOut";

// fetch deposti history data from API
const getExternalTransferHistoryRequest = async () =>
    await api
        .get("internaltransfer.js")
        .then(response => response)
        .catch(error => error);

// Used for call function for get Deposit History
function* getExternalTransferHistoryData() {
    try {
        const response = yield call(getExternalTransferHistoryRequest);

        yield put(getExternalTransferHistorySuccess(response));
    } catch (error) {
        yield put(getExternalTransferHistoryFailure(error));
    }
}

// dispatch action for get DepositHistory
function* getExternalTransferHistory() {
    yield takeEvery(GET_EXTERNALTRANSFER_HISTORY, getExternalTransferHistoryData);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([fork(getExternalTransferHistory)]);
}
