/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Authorization Token Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
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

import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;

//Call redirectToLogin to helper
import { redirectToLogin, loginErrCode, staticResponse, statusErrCodeList, generateLocalStorageVariable } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//WebSocket Call...
const watchMessages = (socket,request) => eventChannel((emit) => {
    socket.onopen = () => {
        socket.send(JSON.stringify(request)) // Send data to server
    };
    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        emit(msg);
    };
    return () => {
        socket.close();
    };
});
 
//Function for Generate Token API
function* gerenateTokenAPI({payload}) {
    const socket = new WebSocket(socketApiUrl);

    let request = {
        m : 0,
        i : 0,
        n : 'GenerateNewToken',
        t : 1,
        r : 0,
        o : payload
    }
    //console.log('Token Req',request);
    const socketChannel = yield call(watchMessages, socket, request);    
    while (true) {
        try {
            const response = yield take(socketChannel);
            //console.log('Token Res',response);
            if(lgnErrCode.includes(response.statusCode)){
                redirectToLogin();
            } else if(statusErrCode.includes(response.statusCode)){
                staticRes = staticResponse(response.statusCode);
                yield put(gerenateTokenFailure(staticRes));
            } else if(response.statusCode === 200) {
                generateLocalStorageVariable(response.tokenID);
                yield put(gerenateTokenSuccess(response));
            } else {
                yield put(gerenateTokenFailure(response));
            }
        } catch (error) {
            yield put(gerenateTokenFailure(error));
        }
    }
}

//Function for Refresh Token API
function* refreshTokenAPI({payload}) {
    const socket = new WebSocket(socketApiUrl);

    let request = {
        m : 6, //Protected Method
        i : 0,
        n : 'refreshToken',
        t : 1,
        r : 0,
        o : payload,
        h : {tokenID : localStorage.getItem('tokenID')}
    }
    //console.log('Ref Req',request);
    const socketChannel = yield call(watchMessages, socket, request);    
    while (true) {
        try {
            const response = yield take(socketChannel);
            //console.log('Ref Res',response);
            if(lgnErrCode.includes(response.statusCode)){
                redirectToLogin();
            } else if(statusErrCode.includes(response.statusCode)){      
                staticRes = staticResponse(response.statusCode);
                yield put(refreshTokenFailure(staticRes));
            } else if(response.statusCode === 200) {                
                //console.log('ref Response',response);
                window.JbsHorizontalLayout.reRefreshTokenSignalR();
                yield put(refreshTokenSuccess(response));
            } else {
                yield put(refreshTokenFailure(response));
                redirectToLogin();
            }
        } catch (error) {
            yield put(refreshTokenFailure(error));
            redirectToLogin();
        }
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