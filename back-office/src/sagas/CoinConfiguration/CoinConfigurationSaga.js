// sagas For Coin Configuration List By Tejas Date:7/1/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, convertObjToFormData } from 'Helpers/helpers'; //added by parth andhariya convertObjToFormData

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_COIN_CONFIGURATION_LIST,
  ADD_COIN_CONFIGURATION_LIST,
  UPDATE_COIN_CONFIGURATION_LIST,
  //added by parth andhariya
  ADD_CURRENCY_LOGO,
} from "Actions/types";

// actions for set data or response
import {
  getCoinConfigurationListSuccess,
  getCoinConfigurationListFailure,
  addCoinConfigurationListSuccess,
  addCoinConfigurationListFailure,
  updateCoinConfigurationListSuccess,
  updateCoinConfigurationListFailure,
  //added by parth andhariya
  AddCurrencyLogoSuccess,
  AddCurrencyLogoFailure
} from "Actions/CoinConfiguration";

// Sagas Function for get Coin Configuration List by :Tejas
function* getCoinConfigurationList() {
  yield takeEvery(GET_COIN_CONFIGURATION_LIST, getCoinConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getCoinConfigurationListDetail({ payload }) {
  const { Data } = payload;
  try {
    //added by parth andhariya
    var IsMargin = '';
    if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
      IsMargin += "?&IsMargin=" + Data.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken },url = "";

    //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
     
      url = 'api/TransactionConfiguration/GetAllServiceConfigurationDataArbitrage';
  } else {
      url = 'api/TransactionConfiguration/GetAllServiceConfigurationData';
  }
  const response = yield call(swaggerGetAPI, url + IsMargin, Data, headers); 


  // const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllServiceConfigurationData' + IsMargin, Data, headers);

    // set response if its available else set error message
    if ( response != null && response.ReturnCode === 0) {
      yield put(getCoinConfigurationListSuccess(response));
    } else {
      yield put(getCoinConfigurationListFailure(response));
    }
  } catch (error) {
    yield put(getCoinConfigurationListFailure(error));
  }
}

// Sagas Function for Add Coin Configuration  by :Tejas
function* addCoinConfigurationList() {
  yield takeEvery(ADD_COIN_CONFIGURATION_LIST, addCoinConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addCoinConfigurationListDetail({ payload }) {
  const { Data } = payload;

  try {
    //added by parth andhariya
    var headers = { 'Authorization': AppConfig.authorizationToken },url = ""
     //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddServiceConfigurationArbitrage';
  } else {
      url = 'api/TransactionConfiguration/AddServiceConfiguration';
  }
  const response = yield call(swaggerPostAPI, url, Data, headers); 
    
   // const response = yield call(swaggerPostAPI, URL, Data, headers);

    // set response if its available else set error message
    if ( response != null && response.ReturnCode === 0) {
      yield put(addCoinConfigurationListSuccess(response));
    } else {
      yield put(addCoinConfigurationListFailure(response));
    }
  } catch (error) {
    yield put(addCoinConfigurationListFailure(error));
  }
}

// Sagas Function for Update Coin Configuration List by :Tejas
function* updateCoinConfigurationList() {
  yield takeEvery(UPDATE_COIN_CONFIGURATION_LIST, updateCoinConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateCoinConfigurationListDetail({ payload }) {
  const { Data } = payload;

  try {
    //added by parth andhariya
   // let URL = 'api/TransactionConfiguration/UpdateServiceConfiguration';



    var headers = { 'Authorization': AppConfig.authorizationToken },url = ""
     //   //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/UpdateServiceConfigurationArbitrage';
  } else {
      url = 'api/TransactionConfiguration/UpdateServiceConfiguration';
  }
  const response = yield call(swaggerPostAPI, url, Data, headers); 
    
    //const response = yield call(swaggerPostAPI, URL, Data, headers);

    // set response if its available else set error message
    if ( response != null && response.ReturnCode === 0) {
      yield put(updateCoinConfigurationListSuccess(response));
    } else {
      yield put(updateCoinConfigurationListFailure(response));
    }
  } catch (error) {
    yield put(updateCoinConfigurationListFailure(error));
  }
}

//added by parth andhariya
//geting response from api and set response
function* AddCurrencyLogoApi({ payload }) {
  try {
    let URL = 'api/WalletControlPanel/AddCurrencyLogo';
    var formData = convertObjToFormData(payload);
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, URL, formData, headers);
    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(AddCurrencyLogoSuccess(response));
    } else {
      yield put(AddCurrencyLogoFailure(response));
    }
  } catch (error) {
    yield put(AddCurrencyLogoFailure(error));
  }
}
//api call for currency logo
function* AddCurrencyLogo() {
  yield takeEvery(ADD_CURRENCY_LOGO, AddCurrencyLogoApi);
}
// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getCoinConfigurationList),
    fork(addCoinConfigurationList),
    fork(updateCoinConfigurationList),
    //added by parth andhariya
    fork(AddCurrencyLogo),
  ]);
}