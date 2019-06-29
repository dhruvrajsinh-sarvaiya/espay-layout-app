// sagas For Buyer Order Actions By Tejas Date : 14/9/2018
// socket implement by devang parekh
// use : sagas is used to connect to socket and get records from their

// effects for redux-saga
import { all, fork, put, takeEvery } from "redux-saga/effects";
// types for set actions and reducers
import {
  CLOSE_SOCKET_CONNECTION,
} from "Actions/types";
// actions for set data or response
import {
  getBuyerOrderListFailure
} from "Actions/Trade";
// event channel for socket connection to make channel between socket and front
// socket connection URL
let buySocket;

// Sagas Function for get Buyer Order list (using socket connection) data by :Tejas Date : 14/9/2018
function* getBuyerOrder() {
  yield put(getBuyerOrderListFailure("error"));
}

// function for close socket connection when component unmount
function* closeSocketPairConnection({ payload }) {
  // check buy socket connection or not if yes then disconnect
  if (buySocket) {
    const { Pair } = payload;
    yield buySocket.emit("leave", Pair);
    buySocket.close();
  }
}

// function for close socket connection when component unmount call from component
function* closeBuySocketConnection() {
  yield takeEvery(CLOSE_SOCKET_CONNECTION, closeSocketPairConnection);
}


// when pair change call this function
function* changeBuyPairSocket() {
  yield put(getBuyerOrderListFailure("error"));
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getBuyerOrder),
    fork(changeBuyPairSocket),
    fork(closeBuySocketConnection)
  ]);
}
