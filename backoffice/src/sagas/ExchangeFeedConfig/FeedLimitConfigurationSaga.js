// sagas For Feed Limit Configuration Actions By Tejas 18/2/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers 
import {
    GET_FEED_LIMIT_LIST,
    ADD_FEED_LIMIT_CONFIGURATION,
    UPDATE_FEED_LIMIT_CONFIGURATION,  
    GET_FEED_LIMIT_TYPE,    
} from "Actions/types";

// actions for set data or response
import {
    getFeedLimitListSuccess,
    getFeedLimitListFailure,
    addFeedLimitListSuccess,
    addFeedLimitListFailure,
    updateFeedLimitListSuccess,
    updateFeedLimitListFailure,  
    getExchangeFeedLimitSuccess,
    getExchangeFeedLimitFailure
} from "Actions/ExchangeFeedConfig";

// Sagas Function for get Exchange Feed Configuration Data by :Tejas
function* getFeedLimitList() {
  yield takeEvery(
    GET_FEED_LIMIT_LIST,
    getFeedLimitListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* getFeedLimitListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/ExchangeFeedConfiguration/GetFeedLimitList', {}, headers)
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getFeedLimitListSuccess(response));
    }
    else {
      yield put(getFeedLimitListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getFeedLimitListFailure(error));
  }
}

// Sagas Function for Add Exchange Feed Configuration Data by :Tejas
function* addFeedLimitList() {
  yield takeEvery(
    ADD_FEED_LIMIT_CONFIGURATION,
    addFeedLimitListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* addFeedLimitListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/ExchangeFeedConfiguration/AddExchangeFeedLimit', Data, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(addFeedLimitListSuccess(response));
    }
    else {
      yield put(addFeedLimitListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(addFeedLimitListFailure(error));
  }
}

// Sagas Function for Add Exchange Feed Configuration Data by :Tejas
function* updateFeedLimitList() {
  yield takeEvery(
    UPDATE_FEED_LIMIT_CONFIGURATION,
    updateFeedLimitListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* updateFeedLimitListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/ExchangeFeedConfiguration/UpdateExchangeFeedLimit', Data, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateFeedLimitListSuccess(response));
    }
    else {
      yield put(updateFeedLimitListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(updateFeedLimitListFailure(error));
  }
}

// Sagas Function for get Exchange Feed Configuration Data by :Tejas
function* getExchangeFeedLimit() {
    yield takeEvery(
        GET_FEED_LIMIT_TYPE,
      getExchangeFeedLimitDetail
    );
  }
  
  // Function for set response to data and Call Function for Api Call
  function* getExchangeFeedLimitDetail({ payload }) {
    const { Data } = payload;
  
    try {
  
      var headers = { 'Authorization': AppConfig.authorizationToken }
  
      const response = yield call(swaggerGetAPI, 'api/ExchangeFeedConfiguration/GetExchangeFeedLimitType', {}, headers)
      
      if (response && response != null && response.ReturnCode === 0) {
        yield put(getExchangeFeedLimitSuccess(response));
      }
      else {
        yield put(getExchangeFeedLimitFailure(response));
      }
    } catch (error) {
      // console.log(error)
      yield put(getExchangeFeedLimitFailure(error));
    }
  }
  

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getFeedLimitList),
    fork(addFeedLimitList),
    fork(updateFeedLimitList), 
    fork(getExchangeFeedLimit),   
  ]);
}
