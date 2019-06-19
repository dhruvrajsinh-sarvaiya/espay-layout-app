/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Authorization Token Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//queryString
const qs = require('querystring');
//Action Types..
import {
    GENERATE_TOKEN,
    REFRESH_TOKEN,
    CHECK_TOKEN
} from 'Actions/types';
//Action methods..
import {
    gerenateTokenSuccess,
    gerenateTokenFailure,
    refreshTokenSuccess,
    refreshTokenFailure,
    checkTokenSuccess,
    checkTokenFailure
} from 'Actions/MyAccount';
//Call redirectToLogin to helper
import { redirectToLogin, loginErrCode, staticResponse, statusErrCodeList, generateLocalStorageVariable } from 'Helpers/helpers';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerPostHeaderFormAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
 
//Function for Generate Token API
function* gerenateTokenAPI({payload}) {
    var swaggerUrl = typeof payload.appkey !== 'undefined' && payload.appkey !== '' ? 'connect/token?appkey='+payload.appkey : 'connect/token';
    
    let request = {
        'grant_type' : AppConfig.grantTypeForToken,  
        'username' : payload.username,
        'password' : payload.password,
        'client_id' : AppConfig.clientIDForToken,
        'scope' : AppConfig.scopeForToken,
    }
    // console.log('Token Request :',request);
    const response = yield call(swaggerPostHeaderFormAPI,swaggerUrl,request);
    // console.log('Toekn Response :',response);
    try {
        if(response.ReturnCode === 0 && typeof response.access_token === 'undefined') {
            // redirectToLogin();
            yield put(gerenateTokenFailure(response));
        } else if(response.ReturnCode === 0 && response.access_token !== '') {
            generateLocalStorageVariable(response.access_token,response.id_token,response.refresh_token);
            yield put(gerenateTokenSuccess(response));
        } else {
            yield put(gerenateTokenFailure(response));
        }
    } catch (error) {
        yield put(gerenateTokenFailure(error));
    }
}

//Function for Refresh Token API
function* refreshTokenAPI({}) {
    let request = {
        refresh_token : localStorage.getItem('gen_refresh_token'),  
        grant_type : AppConfig.grantTypeForRefreshToken
    }

    //console.log('Login Request',request);
    const response = yield call(swaggerPostHeaderFormAPI,'connect/token',request);
    //console.log('Login Response',response);
    try {
        if(response.ReturnCode === 0) {
            generateLocalStorageVariable(response.access_token,response.id_token,localStorage.getItem('gen_refresh_token'));
            yield call(window.JbsHorizontalLayout.reRefreshTokenSignalR);
            yield put(refreshTokenSuccess(response));
        } else {
            yield put(refreshTokenFailure(response));
        }
    } catch (error) {
        yield put(refreshTokenFailure(error));
    }
}

//Function for Check Token API
function* checkTokenAPI({payload}) {
    const socket = new WebSocket(socketApiUrl);

    let request = {
        m : 0,
        i : 0,
        n : 'token',
        t : 1,
        r : 0,
        o : payload
    }
    
    const socketChannel = yield call(watchMessages, socket, request);    
    while (true) {
        try {
            const response = yield take(socketChannel);
            //console.log('Check Token Response',response);
            /* if(lgnErrCode.includes(response.statusCode)){
                redirectToLogin();
            } else */ if(statusErrCode.includes(response.statusCode)){      
                staticRes = staticResponse(response.statusCode);
                yield put(checkTokenFailure(staticRes));
            } else if(response.statusCode === 200) {
                yield put(checkTokenSuccess(response));
            } else {
                localStorage.removeItem('tokenID');
                yield put(checkTokenFailure(response));
            }
        } catch (error) {
            localStorage.removeItem('tokenID');
            yield put(checkTokenFailure(error));
        }
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

/* Create Sagas method for Check Token */
export function* checkTokenSagas() {    
    yield takeEvery(CHECK_TOKEN, checkTokenAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(gerenateTokenSagas),
        fork(refreshTokenSagas),
        fork(checkTokenSagas)
    ]);
}