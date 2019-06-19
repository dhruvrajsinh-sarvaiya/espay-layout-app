/**
 * Auther : Salim Deraiya
 * Created : 29-10-2019
 * Top Leader Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GET_TOP_LEADER_LIST
} from 'Actions/types';

//Action methods..
import {
    getTopLeaderListSuccess,
    getTopLeaderListFailure
} from 'Actions/SocialProfile';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Get Top Leader List API
function* getTopLeaderListAPI() {
    var headers =  {'Authorization': AppConfig.authorizationToken}
	const response = yield call(swaggerGetAPI,'api/Transaction/TopLeadersList',{},headers);
	
	try {
		if (response.ReturnCode === 0) {
			yield put(getTopLeaderListSuccess(response));
		} else {
			yield put(getTopLeaderListFailure(response));
		}
	} catch (error) {
		yield put(getTopLeaderListFailure(error));
	}
}

/* Create Sagas method for Get Top Leader List */
export function* getTopLeaderListSagas() {
    yield takeEvery(GET_TOP_LEADER_LIST, getTopLeaderListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getTopLeaderListSagas)
    ]);
}