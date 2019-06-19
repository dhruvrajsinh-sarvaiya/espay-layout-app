// sagas For Trade Chart Data Actions By Tejas Date:7/1/2019

// for call api call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import { GET_CHART_DATA } from "Actions/types";

// action sfor set data or response
import { getChartDataSuccess, getChartDataFailure } from "Actions/Trade";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// Sagas Function for get Current Market Cap data by :Tejas
function* getChartData() {
  yield takeEvery(GET_CHART_DATA, getChartDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getChartDataDetail({ payload }) {
  const { Pair } = payload;
  
//   try {
//     var headers = { 'Authorization': AppConfig.authorizationToken }    
//     const response = yield call(swaggerGetAPI, '/api/TransactionBackOffice/GetBackOfficeGraphDetail/' + Pair.Pair, {});
// console.log("respose",response)
//     // set response if its available else set error message
//     if (response && response != null && response.ReturnCode === 0) {
//       yield put(getChartDataSuccess(response));
//     } else {
//       yield put(getChartDataFailure(response));
//     }
//   } catch (error) {
//     yield put(getChartDataFailure(error));
//   }
}


// Function for root saga
export default function* rootSaga() {
  yield all([fork(getChartData)]);
}
