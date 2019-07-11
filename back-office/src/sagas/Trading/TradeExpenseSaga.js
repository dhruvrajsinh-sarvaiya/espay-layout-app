// sagas For Expense Data Actions By Tejas

import axios from 'axios';
// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";


// types for set actions and reducers
import { GET_EXPENSE_DATA } from "Actions/types";

// action sfor set data or response
import {
    getExpenseDataListSuccess,
    getExpenseDataListFailure
} from "Actions/Trading";

// Sagas Function for get Expense Data by :Tejas
function* getExpenseDataList() {
  yield takeEvery(GET_EXPENSE_DATA, getExpenseDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getExpenseDataListDetail({ payload }) {
  
  try {
    const response = yield call(getExpenseDataListRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getExpenseDataListSuccess(response));
    } else {
      yield put(getExpenseDataListFailure(response));
    }
  } catch (error) {
    yield put(getExpenseDataListFailure(error));
  }
}

// function for Call api and set response
const getExpenseDataListRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getExpenses")
    .then(response => response.data)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getExpenseDataList)]);
}
