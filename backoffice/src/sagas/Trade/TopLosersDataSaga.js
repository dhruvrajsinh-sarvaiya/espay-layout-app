// sagas For top Losers Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import { GET_TOP_LOSERS_DATA } from "Actions/types";

// action sfor set data or response
import { getTopLosersSuccess, getTopLosersFailure } from "Actions/Trade";

// Sagas Function for get Top Losers Cap data by :Tejas
function* getTopLosersData() {
  yield takeEvery(GET_TOP_LOSERS_DATA, getTopLosersDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTopLosersDataDetail({ payload }) {
  const { Data } = payload;
  //added by parth andhariya
  var IsMargin = '';
  if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
    IsMargin += "?&IsMargin=" + Data.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOffice/GetTopLooserPair/' + Data.Type + IsMargin, Data, headers);

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
  yield all([fork(getTopLosersData)]);
}
