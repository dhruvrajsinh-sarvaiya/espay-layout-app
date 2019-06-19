// sagas For top Referral Summary Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_REFERRAL_SUMMARY_DATA } from "Actions/types";

// action sfor set data or response
import {
  getReferralSummarySuccess,
  getReferralSummaryFailure
} from "Actions/Trade";

// Sagas Function for get  Referral Summary Cap data by :Tejas
function* getReferralSummaryData() {
  yield takeEvery(GET_REFERRAL_SUMMARY_DATA, getReferralSummaryDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getReferralSummaryDataDetail({ payload }) {
  const { Pair } = payload;
  try {
    const response = yield call(getReferralSummaryDataRequest, Pair);
    // set response if its available else set error message
    if (response && response != null && response != undefined) {
      yield put(getReferralSummarySuccess(response));
    } else {
      yield put(getReferralSummaryFailure("error"));
    }
  } catch (error) {
    yield put(getReferralSummaryFailure(error));
  }
}

// function for Call api and set response
const getReferralSummaryDataRequest = async ReferralSummaryRequest =>
  await api
    .get("ReferralSummary.js")
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getReferralSummaryData)]);
}
