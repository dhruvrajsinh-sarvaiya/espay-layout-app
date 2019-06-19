/**
 * Auther : Salim Deraiya
 * Created : 29-10-2019
 * Top Looser Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GET_TOP_LOOSER_LIST
} from 'Actions/types';

//Action methods..
import {
    getTopLooserListSuccess,
    getTopLooserListFailure
} from 'Actions/SocialProfile';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Get Top Looser List API
function* getTopLooserListAPI({ payload }) {
    var headers =  {'Authorization': AppConfig.authorizationToken}
	const response = yield call(swaggerGetAPI,'api/Transaction/TopProfitLoser/'+payload.curDate+'/'+payload.limit,{},headers);
	
	try {
		if (response.ReturnCode === 0) {
			yield put(getTopLooserListSuccess(response));
		} else {
			yield put(getTopLooserListFailure(response));
		}
	} catch (error) {
		yield put(getTopLooserListFailure(error));
	}
}

/* Create Sagas method for Get Top Looser List */
export function* getTopLooserListSagas() {
    yield takeEvery(GET_TOP_LOOSER_LIST, getTopLooserListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getTopLooserListSagas)
    ]);
}