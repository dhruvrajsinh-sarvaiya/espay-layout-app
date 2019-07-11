/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Authorization Token Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GENERATE_TOKEN,
    REFRESH_TOKEN,
    GET_MENU_ACCESS_BY_ID,
} from 'Actions/types';
//Action methods..
import {
    gerenateTokenSuccess,
    gerenateTokenFailure,
    refreshTokenSuccess,
    refreshTokenFailure,
    getMenuPermissionByIDSuccess,
    getMenuPermissionByIDFailure
} from 'Actions/MyAccount';
//Call redirectToLogin to helper
import { redirectToLogin, generateLocalStorageVariable, swaggerPostHeaderFormAPI, swaggerPostAPI, generateLocalStorageMenu, convertObjToFormData } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

// code added by devang parekh (1-4-2019)
function* getMenuAccessPermissionDetail() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    /* get root menu access rights after login */
    var request = convertObjToFormData({ 'ParentID': '00000000-0000-0000-0000-000000000000' });
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/GetMasterListLight', request, headers);
    return response;
}
// end

//Function for Generate Token API
function* gerenateTokenAPI({ payload }) {
    var swaggerUrl = typeof payload.appkey !== 'undefined' ? 'connect/token?appkey=' + payload.appkey : 'connect/token';

    let request = {
        'grant_type': AppConfig.grantTypeForToken,
        'username': payload.username,
        'password': payload.password,
        'client_id': AppConfig.clientIDForToken,
        'scope': AppConfig.scopeForToken,
    }
    const response = yield call(swaggerPostHeaderFormAPI, swaggerUrl, request);
    
    try {
        if (response.ReturnCode === 0 && typeof response.access_token === 'undefined') {
            redirectToLogin();
            yield put(gerenateTokenFailure(response));
        } else if (response.ReturnCode === 0 && response.access_token !== '') {
            generateLocalStorageVariable(response.access_token, response.id_token, response.refresh_token);

            // code added by devang parekh (1-4-2019)
            // code for call menu access api and get response and store into local storage otherwise give error message
            const menuAccess = yield call(getMenuAccessPermissionDetail, response.access_token);
            if (menuAccess.ReturnCode === 0 && menuAccess.Result) {
                generateLocalStorageMenu(menuAccess.Result);
                yield put(gerenateTokenSuccess(response))
            } else {
                yield put(gerenateTokenFailure(response));
            }
            //end
        } else {
            yield put(gerenateTokenFailure(response));
        }
    } catch (error) {
        yield put(gerenateTokenFailure(error));
    }
}

//Function for Refresh Token API
function* refreshTokenAPI() {
    let request = {
        refresh_token: localStorage.getItem('gen_refresh_token'),
        grant_type: AppConfig.grantTypeForRefreshToken
    }

    const response = yield call(swaggerPostHeaderFormAPI, 'connect/token', request);
    try {
        if (response.ReturnCode === 0) {
            generateLocalStorageVariable(response.access_token, response.id_token, localStorage.getItem('gen_refresh_token'));
            yield call(window.JbsHorizontalLayout.reRefreshTokenSignalR);
            yield put(refreshTokenSuccess(response));
        } else {
            yield put(refreshTokenFailure(response));
        }
    } catch (error) {
        yield put(refreshTokenFailure(error));
    }
}

// get menu permission by id - added by nishant 29-04-2019
function* getMenuPermissionByIDRequest({ parentId }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var request = convertObjToFormData({ 'ParentID': parentId });
    const response = yield call(swaggerPostAPI, 'api/BackofficeRoleManagement/GetAccessRightsV2', request, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getMenuPermissionByIDSuccess(response));
        } else {
            yield put(getMenuPermissionByIDFailure(response));
        }
    } catch (error) {
        yield put(getMenuPermissionByIDFailure(error));
    }
}

/* Create Sagas method for Generate Token */
export function* gerenateTokenSagas() {
    yield takeEvery(GENERATE_TOKEN, gerenateTokenAPI);
}

/* Create Sagas method for Refresh Token */
export function* refreshTokenSagas() {
    yield takeEvery(REFRESH_TOKEN, refreshTokenAPI);
}

/* get menu persmission by id - added by nishant on 29-04-2019 */
export function* getMenuPermissionByID() {
    yield takeEvery(GET_MENU_ACCESS_BY_ID, getMenuPermissionByIDRequest);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(gerenateTokenSagas),
        fork(refreshTokenSagas),
        fork(getMenuPermissionByID), // added by nishant - 29-04-2019
    ]);
}