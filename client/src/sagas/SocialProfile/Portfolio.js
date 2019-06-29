/**
 * Auther : Salim Deraiya
 * Created : 29-10-2019
 * Leader Portfolio List Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
	GET_LEADER_PORTFOLIO_LIST
} from 'Actions/types';

//Action methods..
import {
	getLeaderPortfolioListSuccess,
	getLeaderPortfolioListFailure
} from 'Actions/SocialProfile';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI } from 'Helpers/helpers';


//Function for Get Leader Portfolio List API
function* getLeaderPortfolioListAPI({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Transaction/GetCopiedLeaderOrders', payload, headers);

	try {
		if (response.ReturnCode === 0) {
			yield put(getLeaderPortfolioListSuccess(response));
		} else {
			yield put(getLeaderPortfolioListFailure(response));
		}
	} catch (error) {
		yield put(getLeaderPortfolioListFailure(error));
	}
}

/* Create Sagas method for Get Leader Portfolio List */
export function* getLeaderPortfolioListSagas() {
	yield takeEvery(GET_LEADER_PORTFOLIO_LIST, getLeaderPortfolioListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(getLeaderPortfolioListSagas)
	]);
}