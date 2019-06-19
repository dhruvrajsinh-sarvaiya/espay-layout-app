// sagas For Seller Order Actions By Tejas Date : 14/9/2018
// socket implement by devang parekh
// use : sagas is used to connect to socket and get records from their

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';

// types for set actions and reducers
import { 
    GET_SELLER_ORDER_LIST,
    DO_BULK_BUYER_ORDER,
    CHANGE_SELL_PAIR_SOCKET,
    CLOSE_SOCKET_CONNECTION
} from 'Actions/types';

// action sfor set data or response
import {
    getSellerOrderListSuccess,
    getSellerOrderListFailure,
    doBulkBuyOrderFailure,
    doBulkBuyOrderSuccess
} from 'Actions/Trade';

// event channel for socket connection to make channel between socket and front
import { eventChannel } from 'redux-saga';
import io from 'socket.io-client';

// socket connection URL
//const sellSocketServerURL = 'https://new-stack-node-socket.azurewebsites.net:3002';
const sellSocketServerURL = 'http://172.20.65.131:3002';
let sellSocket;
let sellSocketChannel;

// wrapping function for socket.on
// constant for connection to socket using selected pair
const connect = (Pair) => {
     
    sellSocket = io(sellSocketServerURL);
    return new Promise((resolve) => {
        sellSocket.on('connect', () => {
            // join socket connection using selected pair
            sellSocket.emit('join', Pair);
            resolve(sellSocket);
        });
    });

 };
 
 // constant is used to handle event which data may pass from socket and bind into handler
 const createSocketChannel = sellSocket => eventChannel((emit) => {
     
    const handler = (data) => {
        emit(data);
    };

    sellSocket.on('SellOrders', handler);

    return () => {
        sellSocket.off('SellOrders', handler);
    };

 });

function* createChannelToSocket() {

    // then create a socket channel
    sellSocketChannel = yield call(createSocketChannel, sellSocket);
        
    // then put the new data into the reducer
    while (true) {
        const payload = yield take(sellSocketChannel);
        
        yield put(getSellerOrderListSuccess(payload));
    }

}

// Function for set response to data and Call Function for Api Call
function* getSellerOrderData({payload}) {
    
    //const { Pair } = payload;
    const Pair= "ETH_BTC";
    try {

        // connect to the server
        sellSocket = yield call(connect,Pair);
        
        yield call(createChannelToSocket);

    } catch(e) {
        yield put(getSellerOrderListFailure(error))
    }

}

// Sagas Function for get Seller Order list data by :Tejas Date : 14/9/2018
function* getSellerOrder() {
    yield takeEvery(GET_SELLER_ORDER_LIST, getSellerOrderData)
}

// function for close socket connection when component unmount
function* closeSocketPairConnection({payload}) {
    //console.log("closeSocketPairConnection sagas");
    if(sellSocket) {
        const { Pair } = payload;
        sellSocket.emit('leave', Pair);
        sellSocket.close();
    }    

}

// function for close socket connection when component unmount call from component
function* closeSellSocketConnection() {
    yield takeEvery(CLOSE_SOCKET_CONNECTION, closeSocketPairConnection)
}

function* changeSellPairSocketConnection({payload}) {
    
    if(sellSocket) {
        
        const { Pair } = payload;
        sellSocket.emit('leave', Pair);
        sellSocket.close();
        
        sellSocket = yield call(connect,Pair);
        yield call(createChannelToSocket);

    }    

}

function* changeSellPairSocket() {
    yield takeEvery(CHANGE_SELL_PAIR_SOCKET, changeSellPairSocketConnection)
}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getSellerOrder),        
        fork(changeSellPairSocket),
        fork(closeSellSocketConnection),
    ]);
}