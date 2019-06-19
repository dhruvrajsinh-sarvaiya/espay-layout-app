// sagas For top Gainers Data Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// function for get Data with Type GET
import { swaggerGetAPI } from 'Helpers/helpers';

//import Appconfig Object for access Constants
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_TOP_GAINERS_DATA,
  GET_TOP_GAINERS_LOSERS_DATA
} from "Actions/types";

// action sfor set data or response
import {
  getTopGainersSuccess,
  getTopGainersFailure,
  getTopGainersLosersSuccess,
  getTopGainersLosersFailure
} from "Actions/Trade";

// Sagas Function for get Top Gainers Cap data by :Tejas
function* getTopGainersData() {
  yield takeEvery(GET_TOP_GAINERS_DATA, getTopGainersDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTopGainersDataDetail({ payload }) {
  const { Data } = payload;
  //added by parth andhariya
  var IsMargin = '';
  if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
    IsMargin += "?&IsMargin=" + Data.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOffice/GetTopGainerPair/' + Data.Type + IsMargin, Data, headers);

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
  const { Data } = payload;
  //added by parth andhariya
  var IsMargin = '';
  if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
    IsMargin += "?&IsMargin=" + Data.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOffice/GetTopLooserGainerPair' + IsMargin, Data, headers);

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

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getTopGainersData),
    fork(getTopGainersLosersData),
  ]);
}
