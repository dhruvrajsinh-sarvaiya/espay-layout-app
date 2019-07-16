import { DELEVERAGE_PRE_CONFIRM, DELEVERAGE_CONFIRM } from "../actions/ActionTypes";
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { userAccessToken } from '../selector';
import { Method } from '../controllers/Constants';
import { swaggerGetAPI, swaggerPostAPI } from '../api/helper';
import {
	deleveragePreConfirmSuccess, deleveragePreConfirmFailure,
	deleverageConfirmSuccess, deleverageConfirmFailure
} from "../actions/Margin/DeleverageAction";


//For Deleverage Pre Confirm
function* CallDeleveragePreConfirm(payload) {
	try {
		const request = payload.request;
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Deleverage PreConfirm api
		var URL = Method.MarginWithdrawPreConfirm + '?Currency=' + request.Currency;
		const data = yield call(swaggerGetAPI, URL, {}, headers);

		// To set Develerage PreConfirm success response to reducer
		yield put(deleveragePreConfirmSuccess(data));
	} catch (error) {
		// To set Develerage PreConfirm failure response to reducer
		yield put(deleveragePreConfirmFailure(error));
	}
}

//For Deleverage Confirm
function* CallDeleverageConfirm(payload) {
	try {
		const request = payload.Request;
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		var URL = Method.WithdrawMigration + '?Currency=' + request.Currency;

		// To call Deleverage Confirm api
		const data = yield call(swaggerPostAPI, URL, {}, headers);

		// To set Develerage Confirm success response to reducer
		yield put(deleverageConfirmSuccess(data));
	} catch (error) {
		// To set Develerage Confirm failure response to reducer
		yield put(deleverageConfirmFailure(error));
	}
}

function* DeleverageSaga() {
	//For Deleverage Pre Confirm
	yield takeLatest(DELEVERAGE_PRE_CONFIRM, CallDeleveragePreConfirm)
	//-------------

	//For Deleverage Confirm
	yield takeLatest(DELEVERAGE_CONFIRM, CallDeleverageConfirm)
	//-------------
}

export default DeleverageSaga
