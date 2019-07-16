// OpenPositionReportSaga.js
import { call, select, put, takeLatest } from 'redux-saga/effects';

import { GET_OPEN_POSITION_REPORT_DATA, } from "../actions/ActionTypes";
import { getOpenPositionReportDataSuccess, getOpenPositionReportDataFailure, } from "../actions/Reports/OpenPositionReportAction";
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI, queryBuilder } from '../api/helper';

// Generator for Open Position Report
function* openPositionReportData({ payload }) {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }
		
		// Create request
		let obj = {}

		// PairId is not undefined and empty
		if (payload.PairId !== undefined && payload.PairId !== '') {
			obj = {
				...obj,
				PairId: payload.PairId
			}
		}
		
		// Create Request into QueryBuilder
		let newRequest = Method.GetOpenPosition + queryBuilder(obj)

		// To call Open Position Report api
		const data = yield call(swaggerGetAPI, newRequest, {}, headers);

		// To set Open Position Report success response to reducer
		yield put(getOpenPositionReportDataSuccess(data));
	} catch (error) {
		// To set Open Position Report failure response to reducer
		yield put(getOpenPositionReportDataFailure());
	}
}

export default function* OpenPositionReportSaga() {

	// To register openPositionReportData method
	yield takeLatest(GET_OPEN_POSITION_REPORT_DATA, openPositionReportData);

}