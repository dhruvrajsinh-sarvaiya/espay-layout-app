/**
 * Auther : Salim Deraiya
 * Created : 29-10-2019
 * Top Gainer Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GET_TOP_GAINER_LIST
} from 'Actions/types';

//Action methods..
import {
    getTopGainerListSuccess,
    getTopGainerListFailure
} from 'Actions/SocialProfile';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Get Top Gainer List API
function* getTopGainerListAPI({ payload }) {
    var headers =  {'Authorization': AppConfig.authorizationToken}
	const response = yield call(swaggerGetAPI,'api/Transaction/TopProfitGainer/'+payload.curDate+'/'+payload.limit,{},headers);
	
	try {
		if (response.ReturnCode === 0) {
			yield put(getTopGainerListSuccess(response));
		} else {
			yield put(getTopGainerListFailure(response));
		}
	} catch (error) {
		yield put(getTopGainerListFailure(error));
	}
}

/* Create Sagas method for Get Top Gainer List */
export function* getTopGainerListSagas() {
    yield takeEvery(GET_TOP_GAINER_LIST, getTopGainerListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getTopGainerListSagas)
    ]);
}