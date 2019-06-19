/* 
    Developer : Khushbu Badheka
    Date : 08-Jan-2019
    File Saga : Push Notification Queue Module
*/

// For API Call
import api from "Api";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//import AppConfig from 'Constants/AppConfig';

import {
    DISPALY_PUSHNOTIFICATION,
    DISPALY_RESENDPUSHNOTIFICATION,
   
} from "Actions/types";

// import functions from action
import {
    displayPushNotificationSuccess,
    displayPushNotificationFailure,
    displayResendPushNotificationSuccess,

} from "Actions/PushNotificationQueue";

//Display Push Notification Queue
function* displayNotificationData({payload}) {
   
  const request = payload;

  let queryParams = '';
  const requestparam = {};
  const createQueryParams = params =>
        Object.keys(params)
        .map(k => `${k}=${encodeURI(params[k])}`)
        .join('&');

  if(request.PageSize !== '' && typeof request.PageSize !== 'undefined'){
      requestparam.PageSize = request.PageSize;
  }

  if(request.Status !== '' && typeof request.Status !== 'undefined'){
      requestparam.Status = request.Status;
  }

  if(requestparam){
    queryParams = createQueryParams(requestparam);
  }

  var requestData = 'api/MasterConfiguration/GetNotificationQueue/'+ request.FromDate + '/' + request.ToDate + '/' + request.Page+(queryParams !== "" ? '?'+queryParams : '');

  try {
    const response = yield call(swaggerGetAPI,requestData,{});
   
    if (response && response.NotificationQueueObj != null && response.ReturnCode === 0) {
      yield put(displayPushNotificationSuccess(response));  
    } else {
      yield put(displayPushNotificationFailure(response));
    }
  } catch (error) {
    yield put(displayPushNotificationFailure(error));
  }

}

function* displayPushNotificationResendData({ payload }) {

    var requestData = 'api/GlobalNotification/ResendNotification/'+ payload.NotificationID;
   // console.log("requestData",requestData);
    try {
        const response = yield call(swaggerPostAPI,requestData,{});
       
        if (response && response != null && response.ReturnCode === 0) {
          yield put(displayResendPushNotificationSuccess(response));  
        } 
      } catch (error) {
        yield put(displayPushNotificationResendFailure(error));
      }

  }

function* displayPushNotificationResendReport() { 
    yield takeEvery(DISPALY_RESENDPUSHNOTIFICATION, displayPushNotificationResendData);
}

//Display Push Notification Queue
function* displayPushNotificationDataReport() {
    yield takeEvery(DISPALY_PUSHNOTIFICATION, displayNotificationData);
}

export default function* PushNotificationQueueSaga() {
    yield all([
        fork(displayPushNotificationDataReport),
        fork(displayPushNotificationResendReport)
    ]);
}
