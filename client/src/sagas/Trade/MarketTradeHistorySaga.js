// sagas For Market Trade History Actions By Tejas Date : 14/9/2018

// for call api call or API Call
import api from 'Api';

// effects for redux-saga
import { all, call, fork, put,take, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import { 
    GET_MARKET_TRADE_HISTORY,
    CHANGE_MARKET_TRADE_HISTORY_SOCKET,
    CLOSE_SOCKET_CONNECTION
} from 'Actions/types';

// action sfor set data or response
import { 
    getMarketTradeHistorySuccess,
    getMarketTradeHistoryFailure
} from 'Actions/Trade';

// event channel for socket connection to make channel between socket and front
import { eventChannel } from 'redux-saga';
import io from 'socket.io-client';

// socket connection URL
const marketTradeSocketServerURL = 'http://172.20.65.131:3003';
let marketTradeSocket;
let marketTradeSocketChannel;

// wrapping function for socket.on
// constant for connection to socket using selected pair
const connect = (Pair) => {
     
    marketTradeSocket = io(marketTradeSocketServerURL);
    return new Promise((resolve) => {
        marketTradeSocket.on('connect', () => {
            // join socket connection using selected pair
            marketTradeSocket.emit('join', Pair);
            resolve(marketTradeSocket);
        });
    });

 };

// constant is used to handle event which data may pass from socket and bind into handler
const createSocketChannel = marketTradeSocket => eventChannel((emit) => {
    
    // handler for 
    const handler = (data) => {
        emit(data);
    };

    // handle buy orders from socket
    marketTradeSocket.on('TradeHistory', handler);

    // return buy orders from socket
    return () => {
        marketTradeSocket.off('TradeHistory', handler);
    };

});

function* createChannelToSocket() {

    // then create a socket channel
    marketTradeSocketChannel = yield call(createSocketChannel, marketTradeSocket);
    
    // then put the new data into the reducer
    while (true) {
        
        const payload = yield take(marketTradeSocketChannel);
        
        yield put(getMarketTradeHistorySuccess(payload));
    }

}

// Sagas Function for get Market Trade History list data by :Tejas Date : 14/9/2018
function* getMarketTradeHistory() {
    yield takeEvery(GET_MARKET_TRADE_HISTORY, getMarketTradeHistoryData)
}

// Function for set response to data and Call Function for Api Call
function* getMarketTradeHistoryData({payload}) {
    const { Pair } = payload;
    
    try {
        
        // connect to the server
        marketTradeSocket = yield call(connect,Pair);
        
        yield call(createChannelToSocket);

    } catch (error) {
        yield put(getMarketTradeHistoryFailure(error))
    }
}

// function for Call api and set response 
const getMarketTradeHistoryRequest = async (marketTradeHistoryRequest) =>
    await api.get('marketTradeHistory.js')
   // .then(console.log('API',marketTradeHistoryRequest))   
        .then(response => response)
        .catch(error => error)


// function for close socket connection when component unmount
function* closeSocketPairConnection({payload}) {
    //console.log("closeSocketPairConnection sagas");
    if(marketTradeSocket) {
        const { Pair } = payload;
        marketTradeSocket.emit('leave', Pair);
        marketTradeSocket.close();
    }    

}

// function for close socket connection when component unmount call from component
function* closeMarketSocketConnection() {
    yield takeEvery(CLOSE_SOCKET_CONNECTION, closeSocketPairConnection)
}

function* changeMarketTradeSocketPairConnection({payload}) {
    
    if(marketTradeSocket) {
        
        const { Pair } = payload;
        marketTradeSocket.emit('leave', Pair);
        marketTradeSocket.close();
        
        marketTradeSocket = yield call(connect,Pair);
        yield call(createChannelToSocket);

    }    

}

function* changeMarketTradeSocketConnection() {
    yield takeEvery(CHANGE_MARKET_TRADE_HISTORY_SOCKET, changeMarketTradeSocketPairConnection)
}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getMarketTradeHistory),
        fork(changeMarketTradeSocketConnection),
        fork(closeMarketSocketConnection),
    ]);
}