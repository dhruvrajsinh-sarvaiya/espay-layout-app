// sagas For Trade Chart Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_HEADER_INFO } from "Actions/types";

// actions for set data or response
import { getHeaderDataSuccess, getHeaderDataFailure } from "Actions/Trade";

// Sagas Function for get Header Info by :Tejas
function* getHeaderData() {
  yield takeEvery(GET_HEADER_INFO, getHeaderDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getHeaderDataDetail({ payload }) {
  const { Pair } = payload;
  try {
    const response = yield call(getHeaderDataRequest, Pair);
    // set response if its available else set error message
    if (response && response != null && response != undefined) {
      yield put(getHeaderDataSuccess(response));
    } else {
      yield put(getHeaderDataFailure("error"));
    }
  } catch (error) {
    yield put(getHeaderDataFailure(error));
  }
}

// function for Call api and set response
const getHeaderDataRequest = async HeaderDataRequest =>
  await api
    .get("HeaderData.js")
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getHeaderData)]);
}
