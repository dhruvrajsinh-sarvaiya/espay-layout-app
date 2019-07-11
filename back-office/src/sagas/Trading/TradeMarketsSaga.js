// sagas For Markets Data Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerGetAPI, } from 'Helpers/helpers';
// types for set actions and reducers
import { GET_MARKETS } from "Actions/types";

// action sfor set data or response
import {
  getMarketsDataListSuccess,
  getMarketsDataListFailure
} from "Actions/Trading";

// Sagas Function for get Markets Data by :Tejas
function* getMarketsDataList() {
  yield takeEvery(GET_MARKETS, getMarketsDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getMarketsDataListDetail({ payload }) {
  var request = payload.Data;
  //added by parth andhariya
  var IsMargin = '';
  if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
    IsMargin += "?&IsMargin=" + request.IsMargin;
  }
  try {
    const response = yield call(swaggerGetAPI, 'api/Transaction/GetMarketTicker' + IsMargin, request);

    if (response != null && response.ReturnCode === 0) {
      yield put(getMarketsDataListSuccess(response));
    }
    else {
      yield put(getMarketsDataListFailure(response));
    }
  } catch (error) {
    yield put(getMarketsDataListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getMarketsDataList)]);
}
