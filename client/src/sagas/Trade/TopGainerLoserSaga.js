// sagas For top Gainers Data Actions By Tejas Date : 4-1-2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// function for get Data with Type GET
import { swaggerGetAPI } from 'Helpers/helpers';

// types for set actions and reducers
import {
  GET_TOP_GAINERS_DATA,
  GET_TOP_GAINERS_LOSERS_DATA,
  GET_TOP_LOSERS_DATA
} from "Actions/types";

// action sfor set data or response
import {
  getTopGainersSuccess,
  getTopGainersFailure,
  getTopGainersLosersSuccess,
  getTopGainersLosersFailure,
  getTopLosersSuccess,
  getTopLosersFailure
} from "Actions/Trade";

// Sagas Function for get Top Gainers Cap data by :Tejas
function* getTopGainersData() {
  yield takeEvery(GET_TOP_GAINERS_DATA, getTopGainersDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTopGainersDataDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(swaggerGetAPI, '/api/TransactionBackOffice/GetTopGainerPair/' + Data.Type, {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTopGainersSuccess(response));
    } else {
      yield put(getTopGainersFailure(response));
    }
  } catch (error) {
    yield put(getTopGainersFailure(error));
  }
}

// Sagas Function for get Top Gainers Cap data by :Tejas
function* getTopGainersLosersData() {
  yield takeEvery(GET_TOP_GAINERS_LOSERS_DATA, getTopGainersLosersDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTopGainersLosersDataDetail({ payload }) {

  try {
    const response = yield call(swaggerGetAPI, '/api/TransactionBackOffice/GetTopLooserGainerPair', {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTopGainersLosersSuccess(response));
    } else {
      yield put(getTopGainersLosersFailure(response));
    }
  } catch (error) {
    yield put(getTopGainersLosersFailure(error));
  }
}

// Sagas Function for get Top Losers Cap data by :Tejas
function* getTopLosersData() {
  yield takeEvery(GET_TOP_LOSERS_DATA, getTopLosersDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTopLosersDataDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(swaggerGetAPI, '/api/TransactionBackOffice/GetTopLooserPair/' + Data.Type, {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTopLosersSuccess(response));
    } else {
      yield put(getTopLosersFailure(response));
    }
  } catch (error) {
    yield put(getTopLosersFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getTopGainersData),
    fork(getTopGainersLosersData),
    fork(getTopLosersData),
  ]);
}
