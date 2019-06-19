/* 
    Developer : Nishant Vadgama
    Date : 13-12-2018
    File Comment : Users details methods saga 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI,
    redirectToLogin,
    loginErrCode,
} from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
import AppConfig from 'Constants/AppConfig';
import {
    USERLIST
} from 'Actions/types';
import {
    getUserListSuccess,
    getUserListFailulre
} from 'Actions/Wallet';

//get user list from API
function* getUserListRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListAllUserDetails', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(getUserListSuccess(response));
            } else {
                yield put(getUserListFailulre(response));
            }
        }
    } catch (error) {
        yield put(getUserListFailulre(error));
    }
}
/* get user list */
export function* getUserList() {
    yield takeEvery(USERLIST, getUserListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getUserList),
    ]);
}