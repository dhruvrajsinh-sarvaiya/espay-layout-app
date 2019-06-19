// sagas For Revenue Data Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import axios from 'axios';

// types for set actions and reducers
import { GET_REVENUE_DATA } from "Actions/types";

// action sfor set data or response
import {
    getRevenueDataListSuccess,
    getRevenueDataListFailure
} from "Actions/Trading";

// Sagas Function for get Revenue Data by :Tejas
function* getRevenueDataList() {
  yield takeEvery(GET_REVENUE_DATA, getRevenueDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getRevenueDataListDetail({ payload }) {
  
  try {
    const response = yield call(getRevenueDataListRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getRevenueDataListSuccess(response));
    } else {
      yield put(getRevenueDataListFailure(response));
    }
  } catch (error) {
    yield put(getRevenueDataListFailure(error));
  }
}

// function for Call api and set response
const getRevenueDataListRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getRevenue")
    .then(response => response.data)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getRevenueDataList)]);
}
