/**********
Name: Tejas Gauswami
Use : Saga for Order Book Data
Date  : 3/6/2019
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
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

  var headers = { 'Authorization': AppConfig.authorizationToken }
  //const response = yield call(swaggerGetAPI, 'api/Transaction/GetBuyerBook/' + payload.Pair + isMargin, {}); 
  /*  const response = {
    "ReturnCode": 0,
    "ReturnMsg": "Success",
    "ErrorCode": 2253,
    "statusCode": 200,
    "response": [
        {
            "Amount": 10,
            "Price": 0.000024,
            "OrderId": "bfc61ded-9a96-471e-8513-447ec92ff4fc",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BINANCE"
          },
          {
            "Amount": 10,
            "Price": 0.000024,
            "OrderId": "bfc61ded-9a96-471e-8513-447ec92ff4fc",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"POLONIX"
          },
          {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"COINBASE"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BITTREX"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"TRADESATOSHI"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"UPBIT"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"OLEXCHANGE"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"CEX.IO"
          },  
          {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BITFINEX"
          },    
          {
            "Amount": 15,
            "Price": 0.051501,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BITSTAMP"
          },
          {
            "Amount": 10,
            "Price": 0.0152301,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"KRAKEN"
          }
    ]
  } */
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

  var headers = { 'Authorization': AppConfig.authorizationToken }
  //const response = yield call(swaggerGetAPI, 'api/Transaction/GetSellerBook/' + payload.Pair + isMargin, {});
  /*  const response = {
    "ReturnCode": 0,
    "ReturnMsg": "Success",
    "ErrorCode": 2253,
    "statusCode": 200,
    "response": [
        {
            "Amount": 10,
            "Price": 0.000024,
            "OrderId": "bfc61ded-9a96-471e-8513-447ec92ff4fc",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BINANCE"
          },
          {
            "Amount": 10,
            "Price": 0.000024,
            "OrderId": "bfc61ded-9a96-471e-8513-447ec92ff4fc",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"POLONIX"
          },
          {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"COINBASE"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BITTREX"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"TRADESATOSHI"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"UPBIT"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"OLEXCHANGE"
          },
           {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"CEX.IO"
          },  
          {
            "Amount": 10,
            "Price": 0.000001,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BITFINEX"
          },  
          {
            "Amount": 15,
            "Price": 0.051501,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"BITSTAMP"
          },
          {
            "Amount": 10,
            "Price": 0.0152301,
            "OrderId": "560742aa-35c7-4ab8-949d-81a510043a84",
            "RecordCount": 1,
            "IsStopLimit": 0,
            "exchangeName":"KRAKEN"
          }
    ]
  } */
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

  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerGetAPI, 'api/Transaction/GetTradePairAsset' + isMargin, {});
  //console.log("pairList", response)
  // const response = yield call(swaggerGetAPI, 'api/Transaction/GetSellerBookArbitrage/' + "LTC_BTC" + isMargin, {});

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