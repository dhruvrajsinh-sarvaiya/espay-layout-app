// sagas For Currency Details Actions By Tejas Date : 17/9/2018

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';
import { swaggerGetAPI,swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

// types for set actions and reducers
import {
  GET_CURRENCY_LIST,
  GET_CURRENT_PRICE,
  GET_CURRENCY_DATA
} from "Actions/types";

// action sfor set data or response
import {
  getCurrencyListSuccess,
  getCurrencyListFailure,
  getCurrentPriceSuccess,
  getCurrentPriceFailure,
  getCurrencyDataSuccess,
  getCurrencyDataFailure,
} from "Actions/Trade";

import AppConfig from 'Constants/AppConfig';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// function for call socket and handle socket response
function* getCurrentPriceData({ payload }) {
  
    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if(payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '?IsMargin=1';
        }
        // end
        
        const response = yield call(swaggerGetAPI,'api/Transaction/GetPairRates/'+payload.Pair+isMargin,{});
        //console.log('GetGraphDetail Response',response,new Date());

        if(response.ReturnCode === 0) {
            yield put(getCurrentPriceSuccess(response));
        } else {
            yield put(getCurrentPriceFailure(response));
        }
        
    } catch (error) {
        yield put(getCurrentPriceFailure(error));
    }

}

function* getCurrencyListData() {

    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerGetAPI,'api/Wallet/ListWallet',{},headers);   
    
    try {

        if(lgnErrCode.includes(response.statusCode)){
            redirectToLogin();
        } else if(statusErrCode.includes(response.statusCode)){               
            staticRes = staticResponse(response.statusCode);
            yield put(getCurrencyListFailure(staticRes));
        } else if(response.statusCode === 200) {
            yield put(getCurrencyListSuccess(response.Wallets));
        } else {
            yield put(getCurrencyListFailure(response));
        }

    } catch (error) {
        yield put(getCurrencyListFailure(error));
    }

}

// Get Currency List BY Tejas 12/2/2019
function* getCurrencyDataDetail() {

  var headers =  {'Authorization': AppConfig.authorizationToken}
  const response = yield call(swaggerPostAPI,'api/TransactionConfiguration/ListCurrency',{},headers);   
  
  try {

      if(lgnErrCode.includes(response.statusCode)){
          redirectToLogin();
      } else if(statusErrCode.includes(response.statusCode)){               
          staticRes = staticResponse(response.statusCode);
          yield put(getCurrencyDataFailure(staticRes));
      } else if(response.statusCode === 200) {
          yield put(getCurrencyDataSuccess(response));
      } else {
          yield put(getCurrencyDataFailure(response));
      }

  } catch (error) {
      yield put(getCurrencyDataFailure(error));
  }

}


// Sagas Function for get Current Price Details list data by :Tejas
function* getCurrentPrice() {
  yield takeEvery(GET_CURRENT_PRICE, getCurrentPriceData);
}

// Sagas Function for get Currency Details list data by :Tejas Date : 17/9/2018
function* getCurrencyList() {
  yield takeEvery(GET_CURRENCY_LIST, getCurrencyListData);
}

// Sagas Function for get Currency Details list data by :Tejas Date : 12/2/2019
function* getCurrencyData() {
  yield takeEvery(GET_CURRENCY_DATA, getCurrencyDataDetail);
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getCurrencyList),
    fork(getCurrentPrice),
    fork(getCurrencyData)
  ]);
}
