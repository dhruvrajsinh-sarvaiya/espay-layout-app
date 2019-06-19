// sagas For Trade Chart Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_MARKET_DETAIL_DATA } from "Actions/types";

// action sfor set data or response
import {
  getMArketDetailDataSuccess,
  getMArketDetailDataFailure
} from "Actions/Trade";

// Sagas Function for get Current Market Cap data by :Tejas
function* getMarketData() {
  yield takeEvery(GET_MARKET_DETAIL_DATA, getMarketDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getMarketDataDetail({ payload }) {
  const { Pair } = payload;
  try {
    const response = yield call(getMarketDataRequest, Pair);
    // set response if its available else set error message
    if (response && response != null && response != undefined) {
      yield put(getMArketDetailDataSuccess(response));
    } else {
      yield put(getMArketDetailDataFailure("error"));
    }
  } catch (error) {
    yield put(getMArketDetailDataFailure(error));
  }
}


// function for Call api and set response 
const getMarketDataRequest = async (MarketDataRequest) =>
    await api.get('MarketData.js')
        .then(response => response)
        .catch(error => error)

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getMarketData)]);
}
