// sagas For Active My Open Order By Tejas Date : 14/9/2018

// for call api call or API Call
import api from 'Api';

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import AppConfig from 'Constants/AppConfig';
const socketUrl = AppConfig.socketAPIUrl;
import { redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// types for set actions and reducers
import { GET_ACTIVE_OPEN_MY_ORDER_LIST } from 'Actions/types';

// action sfor set data or response
import { getActiveMyOpenOrderListSuccess, getActiveMyOpenOrderListFailure } from 'Actions/Trade';

// Sagas Function for get My Open Order list data by :Tejas Date : 14/9/2018
function* getActiveMyOpenOrderList() {
    yield takeEvery(GET_ACTIVE_OPEN_MY_ORDER_LIST, getActiveMyOpenOrderListData)
}

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
function* getActiveMyOpenOrderListData({payload}) {
   
    let request = {
        m : 6,
        i : 0,
        n : 'GetActiveOrder',
        t : 1,
        r : 5,        
        h : {tokenID : localStorage.getItem('tokenID')},
        //h: {"tokenID":"cJNyXfxxY0AFJw3aWd1XTsybMk3EKzCmJXYudOIne7DfPfABBDBbtUv5lY7djPtm"},
        o :payload
    }
    
    //const socket = new WebSocket('ws://172.20.65.131:8082/');
    const socket = new WebSocket(socketUrl);
    const socketChannel = yield call(watchMessages, socket, request);    
    while (true) {
        try {
            const response = yield take(socketChannel); 
            if(lgnErrCode.includes(response.statusCode)){
                redirectToLogin();
            } else if(statusErrCode.includes(response.statusCode)){               
                staticRes = staticResponse(response.statusCode);
                yield put(getActiveMyOpenOrderListFailure(staticRes));
            } else if(response.statusCode === 200) {
                yield put(getActiveMyOpenOrderListSuccess(response));
            } else {
                yield put(getActiveMyOpenOrderListFailure(response));
            }

            // if(typeof response.ReturnCode !== 'undefined' && response.ReturnCode === 0 ) {   
                        
            //     yield put(getActiveMyOpenOrderListSuccess(response));
            // } else {
            //     yield put(getActiveMyOpenOrderListFailure(response));
            // }
        } catch (error) {
            yield put(getActiveMyOpenOrderListFailure(error));
        }
    }

}


// function for Call api and set response 
const getActiveMyOpenOrderListRequest = async (activeMyOpenOrdersRequest) =>
    await api.get('activeMyOpenOrder.js')    
        .then(response => response)
        .catch(error => error)


// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getActiveMyOpenOrderList),
    ]);
}