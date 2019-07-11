/* 
    Developer : Khushbu Badheka
    Date : 08-Jan-2019
    File Saga : Push Notification Queue Module
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

import {
  DISPALY_PUSHNOTIFICATION,
  DISPALY_RESENDPUSHNOTIFICATION,
} from "Actions/types";

// import functions from action
import {
  displayPushNotificationSuccess,
  displayPushNotificationFailure,
  displayResendPushNotificationSuccess,
  displayPushNotificationResendFailure,
} from "Actions/PushNotificationQueue";

//Display Push Notification Queue
function* displayNotificationData({ payload }) {

  const request = payload;
  let queryParams = '';
  const requestparam = {};
  const createQueryParams = params =>
    Object.keys(params)
      .map(k => `${k}=${encodeURI(params[k])}`)
      .join('&');

  if (request.PageSize !== undefined && request.PageSize !== '') {
    requestparam.PageSize = request.PageSize;
  }

  if (request.Status !== undefined && request.Status !== '') {
    requestparam.Status = request.Status;
  }

  if (Object.keys(requestparam).length > 0) {
    queryParams = createQueryParams(requestparam);
  }

  var requestData = 'api/MasterConfiguration/GetNotificationQueue/' + request.FromDate + '/' + request.ToDate + '/' + request.Page + (queryParams !== "" ? '?' + queryParams : '');

  try {
    const response = yield call(swaggerGetAPI, requestData, {});

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

  var requestData = 'api/GlobalNotification/ResendNotification/' + payload.NotificationID;
  try {
    const response = yield call(swaggerPostAPI, requestData, {});

    if (response != null && response.ReturnCode === 0) {
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
