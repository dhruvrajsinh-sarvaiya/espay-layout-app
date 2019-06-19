/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Referral Latest Commission History Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//Action Types..
import { REFERRAL_LATEST_COMMISSION_HISTORY_LIST } from "Actions/types";

//Action methods..
import {
  referralLatestCommissionHistorySuccess,
  referralLatestCommissionHistoryFailure
} from "Actions/MyAccount";

//Function check API call for Referral Latest Commission History..
const getReferralLatestCommissionHistoryAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

const data = [
  ["0.00000010 BTC", "abcdefgh@gmail.com", "2018-06-08"],
  ["0.00000015 BTC", "ijklmnop@gmail.com", "2018-06-06"],
  ["0.00000020 BTC", "qrstuvwx@gmail.com", "2018-06-04"],
  ["0.00000025 BTC", "yzabcdef@gmail.com", "2018-06-03"],
  ["0.00000030 BTC", "ghijklmn@gmail.com", "2018-06-01"]
];

const errMsg = "Data not found";

//Function for Referral Latest Commission History
function* referralLatestCommissionHistoryAPI({ payload }) {
  try {
    //const response = yield call(getReferralLatestCommissionHistoryAPIRequest,payload);
    if (data.length > 0) {
      yield put(referralLatestCommissionHistorySuccess(data));
    } else {
      yield put(referralLatestCommissionHistoryFailure(errMsg));
    }
  } catch (error) {
    yield put(referralLatestCommissionHistoryFailure(error));
  }
}

/* Create Sagas method for referralLatestCommissionHistory */
export function* referralLatestCommissionHistorySagas() {
  yield takeEvery(
    REFERRAL_LATEST_COMMISSION_HISTORY_LIST,
    referralLatestCommissionHistoryAPI
  );
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([fork(referralLatestCommissionHistorySagas)]);
}
