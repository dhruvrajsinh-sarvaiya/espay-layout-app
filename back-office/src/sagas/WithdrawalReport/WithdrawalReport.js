import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import api from 'Api';
import api from "Api";

//import Action type
import { GET_WITHDRAWAL_REPORT, UPDATE_WITHDRAWAL_REPORT } from "Actions/types";

// import functions from action
import {
  getWithdrawalReportSuccess,
  getWithdrawalReportFailure,
  onUpdateWhithdrawalReportSuccess,
  onUpdateWhithdrawalReportFail
} from "Actions/WithdrawalReport";

// fetch Withdrawal Report from API
const getWithdrawalReportRequest = async () =>
  await api
    .get("withdrawalReport.js")
    .then(response => response)
    .catch(error => error);

// update Withdrawal Report from API
const updateWithdrawalReportRequest = async withdrawalReport =>
  await api
    .post("withdrawalReport.js", withdrawalReport)
    .then(response => response)
    .catch(error => error);

// Used for call function for get Withdrawal Report
function* getWithdrawalReportData() {
  try {
    const response = yield call(getWithdrawalReportRequest);
    yield put(getWithdrawalReportSuccess(response));
  } catch (error) {
    yield put(getWithdrawalReportFailure(error));
  }
}

//Saga Generatore Function for every time call Action from Actions
function* getWithdrawalReport() {
  yield takeEvery(GET_WITHDRAWAL_REPORT, getWithdrawalReportData);
}

// Used for call function for update Withdrawal Report
function* updateWithdrawalReportData({ payload }) {
  try {
    const withdrawalAdress = yield call(
      updateWithdrawalReportRequest,
      payload.withdrawalreport
    );
    if (withdrawalAdress.message) {
      yield put(onUpdateWhithdrawalReportFail(withdrawalAdress.message));
    } else {
      yield put(onUpdateWhithdrawalReportSuccess(withdrawalAdress));
    }
  } catch (error) {
    yield put(onUpdateWhithdrawalReportFail(error));
  }
}

//Saga Generatore Function for every time call Action from Actions
export function* onUpdateWhithdrawalAddresReport() {
  yield takeEvery(UPDATE_WITHDRAWAL_REPORT, updateWithdrawalReportData);
}

export default function* rootSaga() {
  yield all([fork(getWithdrawalReport), fork(onUpdateWhithdrawalAddresReport)]);
}
