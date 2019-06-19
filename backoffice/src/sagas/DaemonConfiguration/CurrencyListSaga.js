// sagas For Currency List Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_CURRENCY_LIST } from "Actions/types";

// action sfor set data or response
import {
  getCurrencyListSuccess,
  getCurrencyListFailure,
} from "Actions/DaemonConfigure";

// Sagas Function for get Currency List Data by :Tejas
function* getCurrencyList() {
  yield takeEvery(GET_CURRENCY_LIST, getCurrencyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getCurrencyListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(getCurrencyListRequest, Data);

    // set response if its available else set error message
    if (response && response != null && response !== undefined) {
      yield put(getCurrencyListSuccess(response));
    } else {
      yield put(getCurrencyListFailure("error"));
    }
  } catch (error) {
    yield put(getCurrencyListFailure(error));
  }
}

// function for Call api and set response 
const getCurrencyListRequest = async (Data) =>
  await api.get('GetCurrencyList.js')
    .then(response => response)
    .catch(error => error)
// Function for root saga
export default function* rootSaga() {
  yield all([fork(getCurrencyList),
  ]);
}
