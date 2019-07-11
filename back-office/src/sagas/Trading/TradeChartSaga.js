// sagas For Trade Chart Data Actions By Tejas Date:7/1/2019
// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";


// types for set actions and reducers
import { GET_CHART_DATA } from "Actions/types";

// action sfor set data or response
import {
  getChartDataListSuccess,
  getChartDataListFailure
} from "Actions/Trading";

//import functions for get and post Api's
import { swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// Sagas Function for get Chart Data by :Tejas
function* getChartDataList() {
  yield takeEvery(GET_CHART_DATA, getChartDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getChartDataListDetail({ payload }) {
  const { Pair } = payload;
  //added by parth andhariya
  var IsMargin = '';
  if (Pair.hasOwnProperty("IsMargin") && Pair.IsMargin != "") {
    IsMargin += "?&IsMargin=" + Pair.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOffice/GetBackOfficeGraphDetail/' + Pair.Pair + "/" + Pair.Interval + IsMargin, Pair, headers);

    // set response if its available else set error message
    if (response.ReturnCode === 0) {
      yield put(getChartDataListSuccess(response));
    } else {
      yield put(getChartDataListFailure(response));
    }
  } catch (error) {
    yield put(getChartDataListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getChartDataList)]);
}
