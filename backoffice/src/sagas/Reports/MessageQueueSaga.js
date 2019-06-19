/*
 * Created By : Megha Kariya
 * Date : 15-01-2019
 * Comment : Messaging Queue saga file
 */
// for call axios call or API Call

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import { GET_MESSAGE_QUEUE_LIST, RESEND_MESSAGE } from "Actions/types";

// action for set data or response
import {
  getMessageQueueListSuccess,
  getMessageQueueListFailure,
  resendMessageUserSuccess,
  resendMessageUserFailure
} from "Actions/Reports";

// get Messages
function* getMessageQueueList() {
  yield takeEvery(GET_MESSAGE_QUEUE_LIST, getMessageQueueListDetail);
}

// function for call API for get Message
function* getMessageQueueListDetail({ payload }) {
  const { Data } = payload;
  let queryParams = '';
  
  try {

    const createQueryParams = params =>
      Object.keys(params)
      .map(k => `${k}=${encodeURI(params[k])}`)
      .join('&');

    if(Data){
      queryParams = createQueryParams(Data);
    }
    var url = 'api/MasterConfiguration/GetMessagingQueue/' + Data.FromDate + '/' + Data.ToDate + '/' + Data.Page +(queryParams !== "" ? '?'+queryParams : '');
    const response = yield call(swaggerGetAPI, url, Data);
    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getMessageQueueListSuccess(response));
    } else {
      yield put(getMessageQueueListFailure(response));
    }
  } catch (error) {
    yield put(getMessageQueueListFailure(error));
  }
}
// resend message
function* resendMessageUser() {
  yield takeEvery(RESEND_MESSAGE, resendMessageUserDetail);
}

// Call API for resend msg
function* resendMessageUserDetail({ payload }) {
  const { Data } = payload;
  try {
   
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    var url = '/api/GlobalNotification/ResendSMS/' + Data.MessageID;
    var request = {MessageID:Data.MessageID};
    const response = yield call(swaggerPostAPI, url, request);
    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(resendMessageUserSuccess(response));
    } else {
      yield put(resendMessageUserFailure(response));
    }
  } catch (error) {
    yield put(resendMessageUserFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getMessageQueueList),
    fork(resendMessageUser)
  ]);
}
