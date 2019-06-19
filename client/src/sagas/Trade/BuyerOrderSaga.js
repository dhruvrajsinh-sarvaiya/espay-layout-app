// sagas For Buyer Order Actions By Tejas Date : 14/9/2018
// socket implement by devang parekh
// use : sagas is used to connect to socket and get records from their

import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from "redux-saga/effects";

// types for set actions and reducers
import {
  GET_BUYER_ORDER_LIST,
  CLOSE_SOCKET_CONNECTION,
  CHANGE_BUY_PAIR_SOCKET
} from "Actions/types";

// actions for set data or response
import {
  getBuyerOrderListSuccess,
  getBuyerOrderListFailure
} from "Actions/Trade";

// event channel for socket connection to make channel between socket and front
import { eventChannel } from "redux-saga";
import io from "socket.io-client";

// socket connection URL
//const buySocketServerURL = 'https://new-stack-node-socket.azurewebsites.net:3001';
const buySocketServerURL = "http://172.20.65.131:3001";
let buySocket;
let buySocketChannel;

// Sagas Function for get Buyer Order list (using socket connection) data by :Tejas Date : 14/9/2018
function* getBuyerOrder() {
  yield takeEvery(GET_BUYER_ORDER_LIST, getBuyerOrderData);
}

// wrapping function for socket.on
// constant for connection to socket using selected pair
// INPUT: Pair like LTC_BTC
const connect = Pair => {
  // connect using URL
  buySocket = io(buySocketServerURL);

  return new Promise(resolve => {
    buySocket.on("connect", () => {
      // join socket connection using selected pair
      buySocket.emit("join", Pair);
      resolve(buySocket);
    });
  });
};

// constant is used to handle event which data may pass from socket and bind into handler
const createSocketChannel = buySocket =>
  eventChannel(emit => {
    // handler for
    const handler = data => {
      emit(data);
    };

    // handle buy orders from socket
    buySocket.on("BuyOrders", handler);

    // return buy orders from socket
    return () => {
      buySocket.off("BuyOrders", handler);
    };
  });

// common function for create socket channel
function* createChannelToSocket() {
  // then create a socket channel
  buySocketChannel = yield call(createSocketChannel, buySocket);

  // then put the new data into the reducer
  while (true) {
    const payload = yield take(buySocketChannel);

    // send orders to state reducer
    yield put(getBuyerOrderListSuccess(payload));
  }
}

// function for call socket and handle socket response
function* getBuyerOrderData({ payload }) {
  //const { Pair } = payload;
  const Pair = "ETH_BTC";
  try {
    // connect to the server
    buySocket = yield call(connect, Pair);
    // call function for socket channel
    yield call(createChannelToSocket);
  } catch (e) {
    yield put(getBuyerOrderListFailure("error"));
  }
}

// function for close socket connection when component unmount
function* closeSocketPairConnection({ payload }) {
  // check buy socket connection or not if yes then disconnect
  if (buySocket) {
    const { Pair } = payload;
    buySocket.emit("leave", Pair);
    buySocket.close();
  }
}

// function for close socket connection when component unmount call from component
function* closeBuySocketConnection() {
  yield takeEvery(CLOSE_SOCKET_CONNECTION, closeSocketPairConnection);
}

function* changeBuyPairSocketConnection({ payload }) {
  // check buy socket connection and based on handle change pair socket
  if (buySocket) {
    const { Pair } = payload;
    buySocket.emit("leave", Pair);
    buySocket.close();

    buySocket = yield call(connect, Pair);
    yield call(createChannelToSocket);
  }
}

// when pair change call this function
function* changeBuyPairSocket() {
  yield takeEvery(CHANGE_BUY_PAIR_SOCKET, changeBuyPairSocketConnection);
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getBuyerOrder),
    fork(changeBuyPairSocket),
    fork(closeBuySocketConnection)
  ]);
}
