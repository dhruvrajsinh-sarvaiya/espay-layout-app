import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { LIST_USER_SIGNUP_REPORT, USER_SIGNUP_DASHBOARD } from "Actions/types";

// import functions from action
import {
  getUserSignupRptDataSuccess,
  getUserSignupRptDataFailure,
  getUserSignupDataSuccess,
  getUserSignupDataFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Signup User Dashbord Data
function* getSignupUserCountDataAPI() {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerGetAPI, '/api/SignUpReport/GetUserSignUpCount/', {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getUserSignupDataSuccess(response));
    } else {
      yield put(getUserSignupDataFailure(response));
    }
  } catch (error) {
    yield put(getUserSignupDataFailure(error));
  }
}

//Display Users Signup Report
function* getUserSignupDataReport({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  var swaggerUrl = 'api/SignUpReport/GetUserSignUPreport?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;
  //ComplainId=' + payload.ComplainId + '&EmailId=' + payload.EmailId + '&MobileNo=' + payload.MobileNo + '&Status=' + payload.Status + '&TypeId=' + payload.TypeId
  if (payload.hasOwnProperty("Filtration") && payload.Filtration !== "") {
    swaggerUrl += '&Filtration=' + payload.Filtration;
  }
  if (payload.hasOwnProperty("EmailAddress") && payload.EmailAddress !== "") {
    swaggerUrl += '&EmailAddress=' + payload.EmailAddress;
  }
  if (payload.hasOwnProperty("Username") && payload.Username !== "") {
    swaggerUrl += '&Username=' + payload.Username;
  }
  if (payload.hasOwnProperty("Mobile") && payload.Mobile !== "") {
    swaggerUrl += '&Mobile=' + payload.Mobile;
  }
  if (payload.hasOwnProperty("Status") && payload.Status !== "") {
    swaggerUrl += '&Status=' + payload.Status;
  }
  if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
    swaggerUrl += '&FromDate=' + payload.FromDate;
  }
  if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
    swaggerUrl += '&ToDate=' + payload.ToDate;
  }
  const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

  try {
    if (response.ReturnCode === 0) {
      yield put(getUserSignupRptDataSuccess(response));
    } else {
      yield put(getUserSignupRptDataFailure(response));
    }
  } catch (error) {
    yield put(getUserSignupRptDataFailure(error));
  }
}

//Display User Signup Count Data
function* getSignupUserCount() {
  yield takeEvery(USER_SIGNUP_DASHBOARD, getSignupUserCountDataAPI);
}

//Display Users Signup Report
function* getSignupUserReport() {
  yield takeEvery(LIST_USER_SIGNUP_REPORT, getUserSignupDataReport);
}

export default function* rootSaga() {
  yield all([
    fork(getSignupUserCount),
    fork(getSignupUserReport)]);
}
