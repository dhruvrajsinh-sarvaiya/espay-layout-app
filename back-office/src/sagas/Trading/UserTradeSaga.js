// sagas For User Trade Data Actions By Tejas

import axios from 'axios';
// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_USER_TRADE_TOTAL_DATA } from "Actions/types";

// action sfor set data or response
import {
  getUserTradeTotalDataSuccess,
  getUserTradeTotalDataFailure
} from "Actions/Trading";

// Sagas Function for get User Trade Data by :Tejas
function* getUserTradeTotalData() {
  yield takeEvery(GET_USER_TRADE_TOTAL_DATA, getUserTradeTotalDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getUserTradeTotalDataDetail({ payload }) {

  try {
    const response = yield call(getUserTradeTotalDataRequest);

    // set response if its available else set error message
    if (response.ReturnCode == 0 && response.statusCode === 200) {
      yield put(getUserTradeTotalDataSuccess(response));
    } else {
      yield put(getUserTradeTotalDataFailure(response));
    }
  } catch (error) {
    yield put(getUserTradeTotalDataFailure(error));
  }
}

// function for Call api and set response
const getUserTradeTotalDataRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getTotalUserTradeCounts")
    .then(response => response.data)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getUserTradeTotalData),
  ]);
}
