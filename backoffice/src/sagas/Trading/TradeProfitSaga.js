// sagas For Profit Data Actions By Tejas

// for call axios call or API Call
import api from "Api";

import axios from 'axios';
// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";


// types for set actions and reducers
import {
   GET_PROFIT_DATA,
  GET_PROFIT_TOTAL_DATA,
  GET_WITHDRAW_DATA,
  GET_DEPOSIT_DATA,
  GET_BUYER_DATA,
  GET_SELLER_DATA,
 } from "Actions/types";

// action sfor set data or response
import {
    getProfitDataListSuccess,
    getProfitDataListFailure,
    getProfitTotalDataSuccess,
    getProfitTotalDataFailure,
    getSellerDataListSuccess,
    getSellerDataListFailure,
    getBuyerDataListSuccess,
    getBuyerDataListFailure,
    getDepositDataListSuccess,
    getDepositDataListFailure,
    getWithdrawDataListSuccess,
    getWithdrawDataListFailure,

} from "Actions/Trading";

// Sagas Function for get Profit Data by :Tejas
function* getProfitDataList() {
  yield takeEvery(GET_PROFIT_DATA, getProfitDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProfitDataListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(getProfitDataListRequest, Data);
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getProfitDataListSuccess(response));
    } else {
      yield put(getProfitDataListFailure(response));
    }
  } catch (error) {
    yield put(getProfitDataListFailure(error));
  }
}

// function for Call api and set response
const getProfitDataListRequest = async Data =>
  await api
    .get("TradeSummaryList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for get Profit Data by :Tejas
function* getProfitTotalData() {
  
  yield takeEvery(GET_PROFIT_TOTAL_DATA, getProfitTotalDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProfitTotalDataDetail({ payload }) {
  
  try {
    const response = yield call(getProfitTotalDataRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getProfitTotalDataSuccess(response));
    } else {
      yield put(getProfitTotalDataFailure(response));
    }
  } catch (error) {
    yield put(getProfitTotalDataFailure(error));
  }
}

// function for Call api and set response
const getProfitTotalDataRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getProfitCounts")
    .then(response => response.data)
    .catch(error => error);


// Sagas Function for get Withdraw Data by :Tejas
function* getWithdrawDataList() {
  
  yield takeEvery(GET_WITHDRAW_DATA, getWithdrawDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getWithdrawDataListDetail({ payload }) {
  
  try {
    const response = yield call(getWithdrawDataListRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getWithdrawDataListSuccess(response));
    } else {
      yield put(getWithdrawDataListFailure(response));
    }
  } catch (error) {
    yield put(getWithdrawDataListFailure(error));
  }
}

// function for Call api and set response
const getWithdrawDataListRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getWithdrawData")
    .then(response => response.data)
    .catch(error => error);



// Sagas Function for get Deposit Data by :Tejas
function* getDepositDataList() {
  
  yield takeEvery(GET_DEPOSIT_DATA, getDepositDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getDepositDataListDetail({ payload }) {
  
  try {
    const response = yield call(getDepositDataListRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getDepositDataListSuccess(response));
    } else {
      yield put(getDepositDataListFailure(response));
    }
  } catch (error) {
    yield put(getDepositDataListFailure(error));
  }
}

// function for Call api and set response
const getDepositDataListRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getDepositData")
    .then(response => response.data)
    .catch(error => error);


// Sagas Function for get bUYER Data by :Tejas
function* getBuyerDataList() {
  
  yield takeEvery(GET_BUYER_DATA, getBuyerDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getBuyerDataListDetail({ payload }) {
  
  try {
    const response = yield call(getBuyerDataListRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getBuyerDataListSuccess(response));
    } else {
      yield put(getBuyerDataListFailure(response));
    }
  } catch (error) {
    yield put(getBuyerDataListFailure(error));
  }
}

// function for Call api and set response
const getBuyerDataListRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getBuyerData")
    .then(response => response.data)
    .catch(error => error);



// Sagas Function for get Seller Data by :Tejas
function* getSellerDataList() {
  
  yield takeEvery(GET_SELLER_DATA, getSellerDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSellerDataListDetail({ payload }) {
  
  try {
    const response = yield call(getSellerDataListRequest);
    
    // set response if its available else set error message
    if ( response.ReturnCode == 0 &&  response.statusCode === 200 ) {
      yield put(getSellerDataListSuccess(response));
    } else {
      yield put(getSellerDataListFailure(response));
    }
  } catch (error) {
    yield put(getSellerDataListFailure(error));
  }
}

// function for Call api and set response
const getSellerDataListRequest = async Data =>
  await axios
    .get("https://virtserver.swaggerhub.com/joshibiz3/getUserTrade/1.0.0/getSellerData")
    .then(response => response.data)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getProfitDataList),
    fork(getProfitTotalData),
    fork(getWithdrawDataList),
    fork(getDepositDataList),
    fork(getBuyerDataList),
    fork(getSellerDataList),
    ]);
}
