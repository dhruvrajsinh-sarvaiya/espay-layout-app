// sagas For Trade Summary total Actions By Tejas

// for call axios call or API Call
import api from "Api";

import axios from 'axios';

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";


// types for set actions and reducers
import { GET_TRADE_SUMMARY_TOTAL_DATA } from "Actions/types";

// action sfor set data or response
import {
    getTradeSummaryTotalDataSuccess,
    getTradeSummaryTotalDataFailure
} from "Actions/Trading";

// Sagas Function for get Trade Summary total by :Tejas
function* getTradeSummaryTotalData() {
  yield takeEvery(GET_TRADE_SUMMARY_TOTAL_DATA, getTradeSummaryTotalDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTradeSummaryTotalDataDetail({ payload }) {
  
  try {
    const response = yield call(getTradeSummaryTotalDataRequest);
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getTradeSummaryTotalDataSuccess(response));
    } else {
      yield put(getTradeSummaryTotalDataFailure(response));
    }
  } catch (error) {
    yield put(getTradeSummaryTotalDataFailure(error));
  }
}

// function for Call api and set response
const getTradeSummaryTotalDataRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getTradeSummaryCounts")
    .then(response => response.data)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all(
      [
          fork(getTradeSummaryTotalData)
      ]
        );
}
