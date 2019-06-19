// sagas For Active User Data Actions By Tejas

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_ACTIVE_USER_DATA } from "Actions/types";

// action sfor set data or response
import { getActiveUserSuccess, getActiveUserFailure } from "Actions/Trade";

// Sagas Function for get Active User Data by :Tejas
function* getActiveUserData() {
  yield takeEvery(GET_ACTIVE_USER_DATA, getActiveUserDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getActiveUserDataDetail({ payload }) {
  const { Pair } = payload;
  try {
    const response = yield call(getActiveUserDataRequest, Pair);
    // set response if its available else set error message
    if (response && response != null && response !== undefined) {
      yield put(getActiveUserSuccess(response));
    } else {
      yield put(getActiveUserFailure("error"));
    }
  } catch (error) {
    yield put(getActiveUserFailure(error));
  }
}


// function for Call api and set response 
const getActiveUserDataRequest = async (MarketDataRequest) =>
    await api.get('ActiveUser.js')
        .then(response => response)
        .catch(error => error)

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getActiveUserData)]);
}
