/**********
Name: Tejas Gauswami
Use : Saga for Order Book Data
Date  : 3/6/2019
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import {
  ARBITRAGE_BUYER_BOOK_LIST,
  ARBITRAGE_SELLER_BOOK_LIST,
  ARBITRAGE_PAIR_LIST
} from 'Actions/types';

// action sfor set data or response
import {
  atbitrageBuyerBookSuccess,
  atbitrageBuyerBookFailure,
  atbitrageSellerBookSuccess,
  atbitrageSellerBookFailure,
  getArbitragePairListSuccess,
  getArbitragePairListFailure
} from 'Actions/Arbitrage';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get Buyer Book data 
function* getArbitrageBuyerBook() {
  yield takeEvery(ARBITRAGE_BUYER_BOOK_LIST, getArbitrageBuyerBookList)
}

// Function for Buyer Book
function* getArbitrageBuyerBookList({ payload }) {

  var isMargin = '', staticRes = {};
  if (payload.hasOwnProperty('IsMargin') && payload.IsMargin === 1) {
    isMargin = '?IsMargin=1';
  }
  // end

  const response = yield call(swaggerGetAPI, 'api/Transaction/GetBuyerBookArbitrage/' + payload.Pair + isMargin, {});

  try {
    if (lgnErrCode.includes(response.statusCode)) {
      redirectToLogin();
    } else if (statusErrCode.includes(response.statusCode)) {
      staticRes = staticResponse(response.statusCode);
      yield put(atbitrageBuyerBookFailure(staticRes));
    } else if (response.statusCode === 200) {
      yield put(atbitrageBuyerBookSuccess(response));
    } else {
      yield put(atbitrageBuyerBookFailure(response));
    }
  } catch (error) {
    yield put(atbitrageBuyerBookFailure(error));
  }

}

// Sagas Function for get Seller Book data 
function* getArbitrageSellerBook() {
  yield takeEvery(ARBITRAGE_SELLER_BOOK_LIST, getArbitrageSellerBookList)
}

// Function for Seller Ordedr
function* getArbitrageSellerBookList({ payload }) {

  var isMargin = '', staticRes = {};
  if (payload.hasOwnProperty('IsMargin') && payload.IsMargin === 1) {
    isMargin = '?IsMargin=1';
  }
  // end

  const response = yield call(swaggerGetAPI, 'api/Transaction/GetSellerBookArbitrage/' + payload.Pair + isMargin, {});
  try {
    if (lgnErrCode.includes(response.statusCode)) {
      redirectToLogin();
    } else if (statusErrCode.includes(response.statusCode)) {
      staticRes = staticResponse(response.statusCode);
      yield put(atbitrageSellerBookFailure(staticRes));
    } else if (response.statusCode === 200) {
      yield put(atbitrageSellerBookSuccess(response));
    } else {
      yield put(atbitrageSellerBookFailure(response));
    }
  } catch (error) {
    yield put(atbitrageSellerBookFailure(error));
  }

}

// Sagas Function for get Seller Book data 
function* getArbitragePairList() {
  yield takeEvery(ARBITRAGE_PAIR_LIST, getArbitragePairListList)
}

// Function for Seller Ordedr
function* getArbitragePairListList({ payload }) {

  var isMargin = '', staticRes = {};
  if (payload.hasOwnProperty('IsMargin') && payload.IsMargin === 1) {
    isMargin = '?IsMargin=1';
  }
  // end

  const response = yield call(swaggerGetAPI, 'api/Transaction/GetTradePairAssetArbitrage' + isMargin, {});

  try {
    if (lgnErrCode.includes(response.statusCode)) {
      redirectToLogin();
    } else if (statusErrCode.includes(response.statusCode)) {
      staticRes = staticResponse(response.statusCode);
      yield put(getArbitragePairListFailure(staticRes));
    } else if (response.statusCode === 200) {
      yield put(getArbitragePairListSuccess(response));
    } else {
      yield put(getArbitragePairListFailure(response));
    }
  } catch (error) {
    yield put(getArbitragePairListFailure(error));
  }

}

// Function for root saga 
export default function* rootSaga() {
  yield all([
    fork(getArbitrageBuyerBook),
    fork(getArbitrageSellerBook),
    fork(getArbitragePairList)
  ]);
}