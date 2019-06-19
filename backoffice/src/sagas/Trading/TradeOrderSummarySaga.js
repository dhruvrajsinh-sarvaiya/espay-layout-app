// sagas For order Summary total Actions By Tejas

// for call axios call or API Call
import api from "Api";

import axios from 'axios';

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";


// types for set actions and reducers
import { GET_ORDER_SUMMARY_TOTAL_DATA } from "Actions/types";

// action sfor set data or response
import {
    getOrderSummaryTotalDataSuccess,
    getOrderSummaryTotalDataFailure
} from "Actions/Trading";

// Sagas Function for get order Summary total by :Tejas
function* getOrderSummaryTotalData() {
  yield takeEvery(GET_ORDER_SUMMARY_TOTAL_DATA, getOrderSummaryTotalDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getOrderSummaryTotalDataDetail({ payload }) {
  
  try {
    const response = yield call(getOrderSummaryTotalDataRequest);
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getOrderSummaryTotalDataSuccess(response));
    } else {
      yield put(getOrderSummaryTotalDataFailure(response));
    }
  } catch (error) {
    yield put(getOrderSummaryTotalDataFailure(error));
  }
}

// function for Call api and set response
const getOrderSummaryTotalDataRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getOrderSummaryCounts")
    .then(response => response.data)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all(
      [
          fork(getOrderSummaryTotalData)
      ]
        );
}
