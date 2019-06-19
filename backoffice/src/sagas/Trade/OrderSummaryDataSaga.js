// sagas For top Order Summary Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_ORDER_SUMMARY_DATA } from "Actions/types";

// action sfor set data or response
import { getOrderSummarySuccess, getOrderSummaryFailure } from "Actions/Trade";

// Sagas Function for get  Order Summary Cap data by :Tejas
function* getOrderSummaryData() {
  yield takeEvery(GET_ORDER_SUMMARY_DATA, getOrderSummaryDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getOrderSummaryDataDetail({ payload }) {
  const { Pair } = payload;
  try {
    const response = yield call(getOrderSummaryDataRequest, Pair);
    // set response if its available else set error message
    if (response && response != null && response != undefined) {
      yield put(getOrderSummarySuccess(response));
    } else {
      yield put(getOrderSummaryFailure("error"));
    }
  } catch (error) {
    yield put(getOrderSummaryFailure(error));
  }
}

// function for Call api and set response
const getOrderSummaryDataRequest = async OrderSummaryRequest =>
  await api
    .get("OrderSummary.js")
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getOrderSummaryData)]);
}
