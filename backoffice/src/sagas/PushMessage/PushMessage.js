/*
 * CreatedBy : Megha Kariya
 * Date : 17-01-2019
 * Comment : Push Message saga file
 */
//Push Message Saga

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';

import {
  DISPALY_USER_LIST,
  SEND_MSG
} from "Actions/types";

// import functions from action
import {
  displayUserListSuccess,
  displayUserListFailure,
  sendMessageUserSuccess,
  sendMessageUserFailure,
} from "Actions/PushMessage";


//Display User List
function* displayUserListData({payload}) {

  try {

    var url = 'api/Chat/GetUserList';
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, url, {}, headers);
    // set response if its available else set error message
    let response_data = [];
    if (response && response != null && response.ReturnCode === 0) {
      response.Users.map(function(data,index){
        var temp_data = {};
        if(payload.cumpulsoryBit == 1){
          if(data.Mobile !== '' && data.Mobile !== null) {
            temp_data.label=data.Mobile + ((data.FirstName && data.LastName) || data.Email ? ' (' + (data.FirstName && data.LastName ? data.FirstName + ' ' + data.LastName + ' - ' : '') + (data.Email ?  data.Email : '')+ ')' : '');
            temp_data.value=data.Mobile;
            response_data.push(temp_data);
          }
        }else if (payload.cumpulsoryBit == 2){
          if(data.Email !== '' && data.Email !== null) {
            temp_data.label=data.Email + ( (data.FirstName && data.LastName)  ? ' (' + (data.FirstName && data.LastName ? data.FirstName + ' ' + data.LastName : '')+ ')' : '');
            temp_data.value=data.Email;
            response_data.push(temp_data);
          }
        }

      });
      yield put(displayUserListSuccess(response_data));
    } else {
      yield put(displayUserListFailure(response));
    }
  } catch (error) {
    yield put(displayUserListFailure(error));
  }
}

//Display User List
function* displayUserListDataReport() {
  yield takeEvery(DISPALY_USER_LIST, displayUserListData);
}

//Send Message
function* sendMsgData({payload}) {

  try {
    // console.log(payload)
    var request = {};
    request.MobileNo = payload.mobileNoListDetail; // code change by devang parekh (30-3-2019)
    request.Message = payload.smsText;
    // request.Message = '';
    
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/GlobalNotification/PushSMS', request,headers);
    // const response = {ReturnCode:0,ReturnMsg: "Success"}
    // set response if its available else set error message
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(sendMessageUserSuccess(response));
    } else {
      yield put(sendMessageUserFailure(response));
    }
  } catch (error) {
    yield put(sendMessageUserFailure(error));
  }

}

//Send Message to users
function* sendMsgUser() {
  yield takeEvery(SEND_MSG, sendMsgData);
}

export default function* rootSaga() {
  yield all([
    fork(displayUserListDataReport),
    fork(sendMsgUser)
  ]);
}
