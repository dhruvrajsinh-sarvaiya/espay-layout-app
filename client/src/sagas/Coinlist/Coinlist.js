/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 30-10-2018
    UpdatedDate : 30-10-2018
    Description : Coinlist Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery,take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

// api
import api from 'Api';

import {
    GET_COINLIST,
} from 'Actions/types';

import {
    getCoinlistSuccess,
    getCoinlistFailure
} from 'Actions/Coinlist';

import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();
//WebSocket Call...
// const watchMessages = (socket,request) => eventChannel((emit) => {
//     socket.onopen = () => {
//         socket.send(JSON.stringify(request)) // Send data to server
//     };
//     socket.onmessage = (event) => {
//         const msg = JSON.parse(event.data);
//         emit(msg);
//     };
//     return () => {
//         socket.close();
//     };
// });

//Function for Get Coin List API
// function* getCoinlistAPI() {

//     const socket = new WebSocket(socketApiUrl);

//     let request = {
//         m : 6,
//         i : 0,
//         n : 'GetAllServiceConfiguration',
//         t : 0,
//         r : 12,
//         o : {},
//         h : {tokenID : localStorage.getItem('tokenID')}
//     }
    
//     const socketChannel = yield call(watchMessages, socket, request);    
//     while (true) {
//         try {
//             const response = yield take(socketChannel);
//             if(response.statusCode === 200) {
//                 yield put(getCoinlistSuccess(response));
//             } else {
//                 yield put(getCoinlistFailure(response));
//             }
//         } catch (error) {
//             yield put(getCoinlistFailure(error));
//         }
//     }
// }

//Function for Get Coin List API
function* getCoinlistAPI() {
    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerGetAPI,'api/TransactionConfiguration/GetAllServiceConfiguration',{},headers);
    //console.log("response",response);
    try {
        // if(lgnErrCode.includes(response.statusCode)){
        //     redirectToLogin();
        // } else if(statusErrCode.includes(response.statusCode)){               
        //     staticRes = staticResponse(response.statusCode);
        //     yield put(getCoinlistFailure(staticRes));
        // } else 
        if(response.statusCode === 200) {
            //console.log("response",response);
            yield put(getCoinlistSuccess(response));
        } else {
            yield put(getCoinlistFailure(response));
        }
    } catch (error) {
        yield put(getCoinlistFailure(error));
    }
}
//Get Coinlist
export function* getCoinlist() {
    yield takeEvery(GET_COINLIST, getCoinlistAPI);
}

// Coinlist Root Saga
export default function* rootSaga() {
    yield all([
        fork(getCoinlist)
    ]);
}