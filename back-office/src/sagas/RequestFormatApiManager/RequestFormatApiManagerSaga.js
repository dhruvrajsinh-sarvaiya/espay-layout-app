/* 
    Created By : Megha Kariya
    Date : 20-02-2019
    Description : CMS Request Format API saga file
*/

import { call, all, put, takeEvery, fork } from "redux-saga/effects";
import { swaggerPostAPI, swaggerGetAPI } from "Helpers/helpers";
import { GET_REQUEST_FORMET, ADD_REQUEST_FORMET_LIST, EDIT_REQUEST_LIST,GET_APP_TYPE } from "Actions/types";
import {
  getrequestformetSucessfull,
  getrequestformetfail,

  addrequestformetlistSucessfull,
  addrequestformetlistFail,

  editrequestlistSucessful,
  editrequestlistfail,
  getAppTypefail,
  getAppTypeSucessfull,
} from "Actions/RequestFormatApiManager";
import AppConfig from 'Constants/AppConfig';

// Get Api Calling Here For List Display
function* getallrequestformetfetch() {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  var api = "api/MasterConfiguration/GetAllRequestFormat/GetAllRequestFormat";
  var response = yield call(swaggerGetAPI, api, {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getrequestformetSucessfull(response));
    } else yield put(getrequestformetfail(response));
  } catch (erorr) {
    yield put(getrequestformetfail(erorr));
  }
}
export function* getallrequestformet() {
  yield takeEvery(GET_REQUEST_FORMET, getallrequestformetfetch);
}



// Add Method call here
function* addrequestformetlitfetch({payload}) {
  const response= yield call(swaggerPostAPI,'/api/MasterConfiguration/AddRequestFormat/AddRequestFormat',payload) 
 
  try {
    if(response.ReturnCode ===0){
    yield put(addrequestformetlistSucessfull(response));
    }
    else{
      yield put(addrequestformetlistFail(response));
    }
  } catch (erorr) {
    yield put(addrequestformetlistFail(erorr));
  }
}
function* addrequestformetlistdisplay() {
  yield takeEvery(ADD_REQUEST_FORMET_LIST, addrequestformetlitfetch);
}

 

// Edit Here
function* editrequestlist({payload}){
  const response = yield call(swaggerPostAPI, '/api/MasterConfiguration/UpdateRequestFormat/UpdateRequestFormat', payload, 1);
  // const editrequestlist = payload;
  
  try{
    if (response.ReturnCode === 0) {
      yield put(editrequestlistSucessful(response));
  } else {
      yield put(editrequestlistfail(response));
  }
  }catch(error){
    yield put(editrequestlistfail(error))
  }
}
function* editrequestlistdisplay(){
  yield takeEvery(EDIT_REQUEST_LIST,editrequestlist)
}
// Added By Megha Kariya (21/02/2019)
function* getAppTypefetch() {
var headers = { 'Authorization': AppConfig.authorizationToken };
  var api = "/api/TransactionConfiguration/GetAppType";
  var response = yield call(swaggerGetAPI, api, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getAppTypeSucessfull(response));
    } else yield put(getAppTypefail(response));
  } catch (erorr) {
    yield put(getAppTypefail(erorr));
  }
}
function* getAppType() {
  yield takeEvery(GET_APP_TYPE, getAppTypefetch);
}

export default function* rootSaga() {
  yield all(
             [
                 fork(getallrequestformet), 
                 fork(addrequestformetlistdisplay),
                 fork(editrequestlistdisplay),
                 fork(getAppType)
             ]
            );
}
