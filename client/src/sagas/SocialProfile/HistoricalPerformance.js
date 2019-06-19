/**
 * Auther : Salim Deraiya
 * Created : 23-01-2019
 * Historical Performance Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GET_HISTORICAL_PERFORMANCE_CHART_DATA
} from 'Actions/types';

//Action methods..
import {
    getHistoricalPerformanceChartDataSuccess,
    getHistoricalPerformanceChartDataFailure
} from 'Actions/SocialProfile';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Get Historical Performance Chart API
function* getHistoricalPerformanceChartAPI({ payload }) {
    var headers =  {'Authorization': AppConfig.authorizationToken}
	const response = yield call(swaggerGetAPI,'api/Transaction/GetHistoricalPerformance/'+payload.LeaderId,{},headers);
	// console.log('Response :',response);
	try {
		if (response.ReturnCode === 0) {
			yield put(getHistoricalPerformanceChartDataSuccess(response));
		} else {
			yield put(getHistoricalPerformanceChartDataFailure(response));
		}
	} catch (error) {
		yield put(getHistoricalPerformanceChartDataFailure(error));
	}
}

/* Create Sagas method for Get Historical Performance Chart */
export function* getHistoricalPerformanceSagas() {
    yield takeEvery(GET_HISTORICAL_PERFORMANCE_CHART_DATA, getHistoricalPerformanceChartAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getHistoricalPerformanceSagas)
    ]);
}