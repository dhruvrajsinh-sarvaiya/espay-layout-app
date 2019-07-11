/**
 * Auther : Salim Deraiya
 * Created : 07-02-2019
 * Leader Board Sagas
 */
//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GET_LEADER_BOARD_LIST
} from 'Actions/types';
//Action methods..
import {
    getLeaderBoardListSuccess,
    getLeaderBoardListFailure
} from 'Actions/SocialProfile';
import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI } from 'Helpers/helpers';

//Function for Get Leader Board List API
function* getLeaderBoardListAPI({ payload }) {
    var sUrl = 'api/WalletOpnAdvanced/LeaderBoard';
    if(payload.UserCount > 0 ) {
        sUrl += '?UserCount='+payload.UserCount;
    }
    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerGetAPI, sUrl, {}, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(getLeaderBoardListSuccess(response));
		} else {
			yield put(getLeaderBoardListFailure(response));
		}
	} catch (error) {
		yield put(getLeaderBoardListFailure(error));
	}
}
/* Create Sagas method for Get Leader Board List */
export function* getLeaderBoardListSagas() {
    yield takeEvery(GET_LEADER_BOARD_LIST, getLeaderBoardListAPI);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getLeaderBoardListSagas)
    ]);
}