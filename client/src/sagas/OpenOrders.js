/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * open orders Sagas
 */
// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

// import actions methods for handle response
import {
    openOrdersSuccess,
    openOrdersFailure,
} from 'Actions';

// for call api with params
import api from 'Api';

import AppConfig from 'Constants/AppConfig';
const socketUrl = AppConfig.socketAPIUrl;
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();


// import action types which is neccessary
import { 
    OPEN_ORDERS,
    OPEN_ORDERS_REFRESH
} from 'Actions/types';

// call api for getting open orders with params
// Input (open orders request)
const getOpenOrdersRequest = async (openOrdersRequest) =>
    await api.get('openOrders.js')
    //.then(console.log('API',openOrdersRequest))
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

// Function for Open Oders
function* openOrdersAPI({payload}) {
    
    let request = {
        m : 6,
        i : 0,
        n : 'GetActiveOrder',
        t : 1,
        r : 5,
        //h:{"tokenID":"1PyiMs4S3Zj0CnsYJMj1YkfN2EYeGw4CK6RbYkmYjZdfFbvURu5baTxWSOWrmuNk"},
        h : {tokenID : localStorage.getItem('tokenID')},
        o :payload.openOrdersRequest
    }
    
    var headers =  {'Authorization': AppConfig.authorizationToken}
    if(payload.openOrdersRequest.IsArbitrage !== undefined && payload.openOrdersRequest.IsArbitrage === 1) {
        var url = 'api/Transaction/GetActiveOrderArbitrage';
    } else {
        var url = 'api/Transaction/GetActiveOrder';
    }

    const response = yield call(swaggerPostAPI,url,payload.openOrdersRequest,headers);   
    
    try {
        if(lgnErrCode.includes(response.statusCode)){
            redirectToLogin();
        } else if(statusErrCode.includes(response.statusCode)){               
            staticRes = staticResponse(response.statusCode);
            yield put(openOrdersFailure(staticRes));
        } else if(response.statusCode === 200) {
            yield put(openOrdersSuccess(response));
        } else {
            yield put(openOrdersFailure(response));
        }
    } catch (error) {
        yield put(openOrdersFailure(error));
    }

    // //const socket = new WebSocket('ws://172.20.65.131:8082/');
    // const socket = new WebSocket(socketUrl);
    // const socketChannel = yield call(watchMessages, socket, request);    
    // while (true) {
    //     try {
    //         const response = yield take(socketChannel); 
                      
    //         if(typeof response.ReturnCode !== 'undefined' && response.ReturnCode === 0 && response.ErrorCode === 0 || response.ErrorCode === 2253 ) {   
                                
    //             yield put(openOrdersSuccess(response));
    //         } else {
    //             yield put(openOrdersFailure(response));
    //         }
    //     } catch (error) {
    //         yield put(openOrdersFailure(error));
    //     }
    // }

}

/**
 * open orders List...
 */
export function* openOrders() {
    //console.log('Sagas openOrders');
    // call open orders action type and sagas api function
    yield takeEvery(OPEN_ORDERS, openOrdersAPI);
}

/**
 * open orders List on refresh or apply Buttom...
 */
export function* openOrdersRefresh() {
    //console.log('Sagas openOrdersRefresh');
    // call open orders action type and sagas api function
    yield takeEvery(OPEN_ORDERS_REFRESH, openOrdersAPI);
}

/**
 * open orders Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
    yield all([
        fork(openOrders),
        fork(openOrdersRefresh)
    ]);
}