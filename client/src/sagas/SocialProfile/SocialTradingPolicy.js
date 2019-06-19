/**
 * Auther : Salim Deraiya
 * Created : 24/12/2018
 * Social Trading Policy Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { GET_SOCIAL_TRADING_POLICY } from 'Actions/types';

//Action methods..
import {
    getSocialTradingPolicySuccess,
    getSocialTradingPolicyFailure
} from 'Actions/SocialProfile';
import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI } from 'Helpers/helpers';

//Function for Get Social Trading Policy API
function* getSocialTradingPolicyAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetSocialProfile', {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getSocialTradingPolicySuccess(response));
		} else {
			yield put(getSocialTradingPolicyFailure(response));
		}
	} catch (error) {
		yield put(getSocialTradingPolicyFailure(error));
	}
}

/* Create Sagas method for Get Social Trading Policy */
export function* getSocialTradingPolicySagas() {
    yield takeEvery(GET_SOCIAL_TRADING_POLICY, getSocialTradingPolicyAPI);
}


/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getSocialTradingPolicySagas),
    ]);
}