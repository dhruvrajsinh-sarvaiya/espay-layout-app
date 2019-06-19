// saga  for Getmenu access details By Tejas 29/4/219

import { call, all, put, takeEvery, fork } from "redux-saga/effects";
import { swaggerPostAPI,swaggerGetAPI,convertObjToFormData } from "Helpers/helpers";
import { 
  GET_MENU_ACCESS,
  UPDATE_MODULE_PERMISSION_ACCESS, //Added by salim dt:06/05/2019
  UPDATE_MODULE_FIELD_ACCESS, //Added by salim dt:06/05/2019
} from "Actions/types";
import {
    getMenuAccessSuccess,
    getMenuAccessFailure,
    updateModuleAccessPermissionSuccess,
    updateModuleAccessPermissionFailure,
    updateModuleFieldAccessSuccess,
    updateModuleFieldAccessFailure

} from "Actions/GetMenuAccessDetailsAction";

import AppConfig from 'Constants/AppConfig';

// Sagas Function for get Menu Details by :Tejas
function* getMenuAccess() {
    
    yield takeEvery(GET_MENU_ACCESS, getMenuAccessDetail);
}

// Function for set response to data and Call Function for Api Call
function* getMenuAccessDetail({ payload }) {
        /* var ParentID = '';
        var GroupID = '';
        
        if (payload.hasOwnProperty("ParentID") && payload.ParentID !== "") {
            ParentID += "?ParentID=" + payload.ParentID;
        }

        if (payload.hasOwnProperty("GroupID") && payload.GroupID !== "") {
            GroupID += "&GroupID=" + payload.GroupID;
        } */ 

    try {
        var headers= {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': AppConfig.authorizationToken
          }
          var formData = convertObjToFormData(payload);
        //var headers = { 'Authorization': AppConfig.authorizationToken }

        let response = {}
        if(payload.ParentID === "00000000-0000-0000-0000-000000000000"){
          //  response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/getMasterListLight', formData, headers);
           response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/ConfigureGroupAccessRights', formData, headers);
        }else{
          //  response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/GetAccessRights', formData, headers);
           response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/ConfigureGroupAccessRights', formData, headers);
        }
        
        //const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/GetAccessRights', formData, headers);
        //const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/GetAccessRights' + ParentID + GroupID, {}, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {            
          yield put(getMenuAccessSuccess(response));
        } else {
          yield put(getMenuAccessFailure(response));
        }
      } catch (error) {
        yield put(getMenuAccessFailure(error));
      }
}

//Added by salim dt:06/05/2019
//Function for Update Module Access Permission API
function* updateModuleAccessPermissionAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/UpdateModuleGroupAccess', payload, headers);
  try {
      if (response.ReturnCode === 0) {
          yield put(updateModuleAccessPermissionSuccess(response));
      } else {
          yield put(updateModuleAccessPermissionFailure(response));
      }
  } catch (error) {
      yield put(updateModuleAccessPermissionFailure(error));
  }
}

//Function for Update Module Fields Access Permission API
function* updateModuleFieldAccessAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/UpdateModuleFieldpAccess', payload, headers);
  try {
      if (response.ReturnCode === 0) {
          yield put(updateModuleFieldAccessSuccess(response));
      } else {
          yield put(updateModuleFieldAccessFailure(response));
      }
  } catch (error) {
      yield put(updateModuleFieldAccessFailure(error));
  }
}

/* Create Sagas method for Add Rule Field */
export function* updateModuleAccessPermissionSagas() {
  yield takeEvery(UPDATE_MODULE_PERMISSION_ACCESS, updateModuleAccessPermissionAPI);
}

/* Create Sagas method for Edit Rule Field */
export function* updateModuleFieldAccessSagas() {
  yield takeEvery(UPDATE_MODULE_FIELD_ACCESS, updateModuleFieldAccessAPI);
}

// Function for root saga
export default function* rootSaga() {
    yield all([fork(getMenuAccess)]);
    yield all([fork(updateModuleAccessPermissionSagas)]); //Added by salim dt:06/05/2019
    yield all([fork(updateModuleFieldAccessSagas)]); //Added by salim dt:06/05/2019
  }