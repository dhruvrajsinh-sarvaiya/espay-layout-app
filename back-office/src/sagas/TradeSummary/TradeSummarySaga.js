// sagas For Trade Summary Data Actions By Tejas


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import { GET_TRADE_SUMMARY_LIST } from "Actions/types";

// action sfor set data or response
import {
  getTradeSummaryListSuccess,
  getTradeSummaryListFailure
} from "Actions/TradeSummary";

// Sagas Function for get Trade Summary Data by :Tejas
function* getTradeSummaryList() {
  yield takeEvery(GET_TRADE_SUMMARY_LIST, getTradeSummaryListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTradeSummaryListDetail({ payload }) {
  const { Data } = payload;
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradingSummary', Data, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getTradeSummaryListSuccess(response));
    } else {
      yield put(getTradeSummaryListFailure(response));
    }
  } catch (error) {
    yield put(getTradeSummaryListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getTradeSummaryList)]);
}
