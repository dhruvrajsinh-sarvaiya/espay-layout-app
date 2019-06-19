// sagas For New Signup Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_NEW_SIGNUP_DATA } from "Actions/types";

// action sfor set data or response
import { getNewSignupSuccess, getNewSignupFailure } from "Actions/Trade";

// Sagas Function for get New Signup Data by :Tejas
function* getNewSignupData() {
  yield takeEvery(GET_NEW_SIGNUP_DATA, getNewSignupDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getNewSignupDataDetail({ payload }) {
  const { Pair } = payload;
  try {
    const response = yield call(getNewSignupDataRequest, Pair);
    // set response if its available else set error message
    if (response && response != null && response != undefined) {
      yield put(getNewSignupSuccess(response));
    } else {
      yield put(getNewSignupFailure("error"));
    }
  } catch (error) {
    yield put(getNewSignupFailure(error));
  }
}

// function for Call api and set response
const getNewSignupDataRequest = async MarketDataRequest =>
  await api
    .get("NewSignup.js")
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getNewSignupData)]);
}
