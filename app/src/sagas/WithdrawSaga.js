import {
	FETCHING_WITHFRAW_HISTORY_DATA,
	WithdrawRequestSuccess,
	WithdrawRequestFailure,
	FETCHING_WITHDRAW_HISTORY_DATA_SUCCESS,
	FETCHING_WITHDRAW_HISTORY_DATA_FAILURE,
	FetchWithdrawRequest,
	VERIFY_2FA_WITHDRAW,
	RESEND_WITHDRAWAL_EMAIL,
} from '../actions/ActionTypes';
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { isEmpty } from '../validations/CommonValidation';
import { swaggerGetAPI, swaggerPostAPI } from '../api/helper';
import { twoFAGoogleAuthenticationSuccess, twoFAGoogleAuthenticationFailure, ResendWithdrawalEmailSuccess, ResendWithdrawalEmailFailure } from '../actions/Wallet/WithdrawAction';

//For Withdraw Coin API Call
function* CallWithdrawRequest(action) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Withdraw Request List api
		const data = yield call(swaggerPostAPI, Method.Withdrawal, action.withdrawRequest, headers);

		// To set Withdraw Request success response to reducer
		yield put({ type: WithdrawRequestSuccess, data })
	} catch (e) {
		// To set Withdraw Request failure response to reducer
		yield put({ type: WithdrawRequestFailure, e })
	}
}

//For Withdraw History API Call
function* CallWithdrawHistory(action) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var url = '';
		var headers = { 'Authorization': tokenID }

		// Coin is available or not
		if (isEmpty(action.withdrawHistoryRequest.Coin)) {
			url = Method.WithdrawalHistoy + '/' + action.withdrawHistoryRequest.FromDate + '/' + action.withdrawHistoryRequest.ToDate;
		}
		else {
			url = Method.WithdrawalHistoy + '/' + action.withdrawHistoryRequest.FromDate + '/' + action.withdrawHistoryRequest.ToDate + '?Coin=' + action.withdrawHistoryRequest.Coin;
		}

		// To call Withdraw History List api
		const data = yield call(swaggerGetAPI, url, action.withdrawHistoryRequest, headers);

		// To set Withdraw History success response to reducer
		yield put({ type: FETCHING_WITHDRAW_HISTORY_DATA_SUCCESS, data })
	} catch (error) {
		// To set Withdraw History failure response to reducer
		yield put({ type: FETCHING_WITHDRAW_HISTORY_DATA_FAILURE, e })
	}
}

function* verifyGoogleAuthCode(payload) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }
		
		// To call Verify Google Auth List api
		const response = yield call(swaggerPostAPI, Method.TwoFAVerifyCode, payload.verifyCodeRequest, headers);
		
		// To set Verify Google Auth success response to reducer
		yield put(twoFAGoogleAuthenticationSuccess(response));
	} catch (error) {
		// To set Verify Google Auth failure response to reducer
		yield put(twoFAGoogleAuthenticationFailure(error));
	}
}

function* ResendWithdrawalConfirmationEmail(payload) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }
		
		// To call Resend Withdrawal Confirmation Email api
		const response = yield call(swaggerPostAPI, Method.ResendEmailWithdrawalConfirmation + '/' + payload.Request.TrnNo, {}, headers);
		
		// To set Resend Withdrawal Confirmation Email success response to reducer
		yield put(ResendWithdrawalEmailSuccess(response));
	} catch (error) {
		// To set Resend Withdrawal Confirmation Email failure response to reducer
		yield put(ResendWithdrawalEmailFailure(error));
	}
}

function* WithdrawSaga() {

	// To register Withdraw Request Module method
	yield takeLatest(FetchWithdrawRequest, CallWithdrawRequest)
	
	// To register Withdraw History Module method
	yield takeLatest(FETCHING_WITHFRAW_HISTORY_DATA, CallWithdrawHistory)
	
	// To register Verify 2FA method
	yield takeLatest(VERIFY_2FA_WITHDRAW, verifyGoogleAuthCode)

	// To register resend withdrawal emial method
	yield takeLatest(RESEND_WITHDRAWAL_EMAIL, ResendWithdrawalConfirmationEmail)
}

export default WithdrawSaga
