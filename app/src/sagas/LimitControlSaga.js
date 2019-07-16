import {
	FETCH_SAVE_LIMIT_SUCCESS,
	FETCH_SAVE_LIMIT_FAILURE,
	FETCH_LIMIT_CONTROL_SUCCESS,
	FETCH_LIMIT_CONTROL_FAILURE,
	FETCH_SAVE_LIMIT,
	FETCH_LIMIT_CONTROL,
} from '../actions/ActionTypes';
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI, swaggerPostAPI } from '../api/helper';
import { parseIntVal, parseFloatVal } from '../controllers/CommonUtils';

function* LimitControlSaga() {
	// To register CallGetLimits method
	yield takeLatest(FETCH_LIMIT_CONTROL, CallGetLimits)
	// To register CallLimitControl method
	yield takeLatest(FETCH_SAVE_LIMIT, CallLimitControl)
}

//For Get Limits API Call
function* CallGetLimits(action) {
	try {
		//to get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call Get Limits api
		const data = yield call(swaggerGetAPI, Method.GetWalletLimit + '/' + action.AccWalletID, action.getLimitRequest, headers);

		// To set Get Limits success response to reducer
		yield put({ type: FETCH_LIMIT_CONTROL_SUCCESS, data })
	} catch (error) {
		// To set Get Limits failure response to reducer
		yield put({ type: FETCH_LIMIT_CONTROL_FAILURE, e })
	}
}

//For Limit Control API Call
function* CallLimitControl(action) {
	try {
		let reqObj = {
			AccWalletID: action.AccWalletID,
			TrnType: parseIntVal(action.trnType),
			LimitPerDay: parseFloatVal(action.LimitPerDay),
			LimitPerHour: parseFloatVal(action.LimitPerHour),
			LimitPerTransaction: parseFloatVal(action.LimitPerTrn),
			StartTimeUnix: parseIntVal(action.StartTime),
			EndTimeUnix: parseIntVal(action.EndTime),
			LifeTime: parseFloatVal(action.LifeTimeLimit)
		};

		//to get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call Set Limits Control api
		const data = yield call(swaggerPostAPI, Method.SetWalletLimit + '/' + reqObj.AccWalletID, reqObj, headers);

		// To set Set Limits success response to reducer
		yield put({ type: FETCH_SAVE_LIMIT_SUCCESS, data })
	} catch (error) {
		// To set Set Limits failure response to reducer
		yield put({ type: FETCH_SAVE_LIMIT_FAILURE, e })
	}
}

export default LimitControlSaga
