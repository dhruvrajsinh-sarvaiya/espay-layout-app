/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Customer Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { LIST_CUSTOMER_DASHBOARD_REPORT, CUSTOMER_DASHBOARD } from "Actions/types";
// import functions from action
import {
    getCustomerDataSuccess,
    getCustomerDataFailure,
    getCustomerRptDataSuccess,
    getCustomerRptDataFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerGetAPI } from 'Helpers/helpers';


//Display Signup User Dashbord Data
function* getCustomerCountDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, '/api/SignUpReport/GetUserSignUpCount/', {}, headers);
    try {
      if (response.ReturnCode === 0) {
        yield put(getCustomerDataSuccess(response));
      } else {
        yield put(getCustomerDataFailure(response));
      }
    } catch (error) {
      yield put(getCustomerDataFailure(error));
    }
  }
  
  //Display Users Signup Report
  function* getCustomerDataReport({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var swaggerUrl = 'api/SignUpReport/GetUserSignUPreport?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;
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
        yield put(getCustomerRptDataSuccess(response));
      } else {
        yield put(getCustomerRptDataFailure(response));
      }
    } catch (error) {
      yield put(getCustomerRptDataFailure(error));
    }
  }
  
  //Display User Signup Count Data
  function* getCustomerCount() {
    yield takeEvery(CUSTOMER_DASHBOARD, getCustomerCountDataAPI);
  }
  
  //Display Users Signup Report
  function* getCustomerReport() {
    yield takeEvery(LIST_CUSTOMER_DASHBOARD_REPORT, getCustomerDataReport);
  }
  
  export default function* rootSaga() {
    yield all([
      fork(getCustomerCount),
      fork(getCustomerReport)]);
  }