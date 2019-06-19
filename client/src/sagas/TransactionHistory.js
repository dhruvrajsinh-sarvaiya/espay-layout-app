/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Sagas
 */
// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

// import actions methods for handle response
import {
    transactionHistorySuccess,
    transactionHistoryFailure,
} from 'Actions';

import AppConfig from 'Constants/AppConfig';
const socketUrl = AppConfig.socketAPIUrl;

import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// for call api with params
import api from 'Api';

// import action types which is neccessary
import {
    TRANSACTION_HISTORY,
    TRANSACTION_HISTORY_REFRESH
} from 'Actions/types';

// call api for getting transaction history with params
// Input (transaction request)
const getTransactionHistoryRequest = async (transactionHistoryRequest) =>
    await api.get('transHistory.js')
        //.then(console.log('API',transactionHistoryRequest))
        .then(response => response)
        .catch(error => error);

//WebSocket Call...
const watchMessages = (socket, request) => eventChannel((emit) => {
    socket.onopen = () => {
        socket.send(JSON.stringify(request)) // Send data to server
    };
    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        //console.log(msg);
        emit(msg);
    };
    return () => {
        socket.close();
    };
});

// Function for PAIR LIST DATA
function* transactionHistoryAPI({payload}) {
    
    let request = {
        m : 6,
        i : 0,
        n : 'GetTradeHistory',
        t : 1,
        r : 5,
        //h:{"tokenID":"htjVEkM93lYe6PtsPwUTThMIOEu3E1Rj2n1ZAWecPQqALeMUXBCglAjvmFdQeykc"},
        h : {tokenID : localStorage.getItem('tokenID')},
        o :payload
    }
        
    var headers =  {'Authorization': AppConfig.authorizationToken}
    if(payload.IsArbitrage !== undefined && payload.IsArbitrage === 1) {
        var url = 'api/Transaction/GetTradeHistoryArbitrage';
    } else {
        var url = 'api/Transaction/GetTradeHistory';
    }
    const response = yield call(swaggerPostAPI,url,payload,headers);   
    
    try {
        if(lgnErrCode.includes(response.statusCode)){
            redirectToLogin();
        } else if(statusErrCode.includes(response.statusCode)){               
            staticRes = staticResponse(response.statusCode);
            yield put(transactionHistoryFailure(staticRes));
        } else if(response.statusCode === 200) {
            yield put(transactionHistorySuccess(response));
        } else {
            yield put(transactionHistoryFailure(response));
        }
    } catch (error) {
        yield put(transactionHistoryFailure(error));
    }

    // //const socket = new WebSocket('ws://172.20.65.131:8082/');
    // const socket = new WebSocket(socketUrl);
    // const socketChannel = yield call(watchMessages, socket, request);    
    // while (true) {
    //     try {
    //         const response = yield take(socketChannel);   
            
    //         if(typeof response.ReturnCode !== 'undefined' && response.ReturnCode === 0 && response.ErrorCode === 0 || response.ErrorCode === 2253 ) {   
    //             //console.log(response)                  
    //             yield put(transactionHistorySuccess(response));
    //         } else {
    //             yield put(transactionHistoryFailure(response));
    //         }
    //     } catch (error) {
    //         yield put(transactionHistoryFailure(error));
    //     }
    // }

}

/**
 * Transaction History List...
 */
export function* transactionHistory() {
    //console.log('Sagas transactionHistory');
    // call transaction history action type and sagas api function
    yield takeEvery(TRANSACTION_HISTORY, transactionHistoryAPI);
}

/**
 * Transaction History List on refresh or apply Buttom...
 */
export function* transactionHistoryRefresh() {
    //console.log('Sagas transactionHistoryRefresh');
    // call transaction history action type and sagas api function
    yield takeEvery(TRANSACTION_HISTORY_REFRESH, transactionHistoryAPI);
}

/**
 * Transaction history Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
    yield all([
        fork(transactionHistory),
        fork(transactionHistoryRefresh)
    ]);
}