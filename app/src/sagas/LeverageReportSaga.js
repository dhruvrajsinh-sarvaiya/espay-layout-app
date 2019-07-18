import { LEVERAGE_REQUEST_REPORT_LIST } from "../actions/ActionTypes";
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { userAccessToken } from '../selector';
import { Method } from '../controllers/Constants';
import { swaggerGetAPI } from '../api/helper';
import { getLeverageReportListSuccess, getLeverageReportListFailure, } from "../actions/Margin/LeverageReportAction";

//For Leverage Requests List
function* CallLeverageRequest(payload) {
	try {
		const request = payload.Request;
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// Create requestUrl
		var URL = Method.LeverageRequestReport + '/' + request.Page + "/" + request.PageSize + '?';

		// FromDate is not undefine and empty
		if (request.hasOwnProperty("FromDate") && request.FromDate !== "") {
			URL += '&FromDate=' + request.FromDate;
		}

		// ToDate is not undefine and empty
		if (request.hasOwnProperty("ToDate") && request.ToDate !== "") {
			URL += '&ToDate=' + request.ToDate;
		}

		// WalletTypeId is not undefine and empty
		if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId !== "") {
			URL += '&WalletTypeId=' + request.WalletTypeId;
		}

		// UserId is not undefine and empty
		if (request.hasOwnProperty("UserId") && request.UserId !== "") {
			URL += '&UserId=' + request.UserId;
		}

		// Status is not undefine and empty
		if (request.hasOwnProperty("Status") && request.Status !== "") {
			URL += '&Status=' + request.Status;
		}

		// To call Leverage Request Module api
		const data = yield call(swaggerGetAPI, URL, request, headers);

		// To set Leverage Report List success response to reducer
		yield put(getLeverageReportListSuccess(data));
	} catch (error) {
		// To set Leverage Report List failure response to reducer
		yield put(getLeverageReportListFailure(error));
	}
}

function* LeverageReportSaga() {
	//For Leverage Requests List
	yield takeLatest(LEVERAGE_REQUEST_REPORT_LIST, CallLeverageRequest)
}

export default LeverageReportSaga
