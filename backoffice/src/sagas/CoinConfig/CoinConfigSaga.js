/* 
    Developer : Nishant Vadgama
    Date : 15-10-2018
    FIle Comment : Coin Configuration add , update, delete and list saga methods
*/
import { all, call, fork, take, put, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import api from "Api";
import {
  GET_COINLIST,
  ADD_COIN,
  GET_COINDETAILS,
  UPDATE_COIN,
  DELETE_COIN
} from "Actions/types";
import {
  getCoinListSuccess,
  getCoinListFailure,
  addCoinSuccess,
  addCoinFailure,
  getCoinDetailsSuccess,
  getCoinDetailsFailure,
  updateCoinSuccess,
  updateCoinFailure,
  deleteCoinSuccess,
  deleteCoinFailure
} from "Actions/CoinConfig";

// get coin list method
const getCoinListRequest = (socket, request) =>
  eventChannel(emit => {
    socket.onopen = () => {
      socket.send(JSON.stringify(request)); // Send data to server
    };
    socket.onmessage = event => {
      const msg = JSON.parse(event.data);
      emit(msg);
    };
    return () => {
      socket.close();
    };
  });
function* getCoinListSocket() {
  let request = {
    m: 0,
    i: 0,
    n: "ListAllWalletTypeMaster",
    t: 0,
    r: 11,
    o: {}
  };
  const socket = new WebSocket("ws://172.20.65.131:8082/");
  const socketChannel = yield call(getCoinListRequest, socket, request);
  while (true) {
    try {
      const responseFromSocket = yield take(socketChannel);
      if (!responseFromSocket.returnCode)
        // success
        yield put(getCoinListSuccess(responseFromSocket.walletTypeMasters));
      // failed
      else yield put(getCoinListFailure("No data found"));
    } catch (error) {
      yield put(getCoinListFailure(error));
    }
  }
}
function* getCoinList() {
  yield takeEvery(GET_COINLIST, getCoinListSocket);
}

/* Add Coin request method */
const addCoinRequest = (socket, request) =>
  eventChannel(emit => {
    socket.onopen = () => {
      socket.send(JSON.stringify(request)); // Send data to server
    };
    socket.onmessage = event => {
      const msg = JSON.parse(event.data);
      emit(msg);
    };
    return () => {
      socket.close();
    };
  });
function* addCoinSocket(payload) {
  let request = {
    m: 0,
    i: 0,
    n: "AddWalletTypeMaster",
    t: 1,
    r: 11,
    o: payload.request
  };
  const socket = new WebSocket("ws://172.20.65.131:8082/");
  const socketChannel = yield call(addCoinRequest, socket, request);
  while (true) {
    try {
      const responseFromSocket = yield take(socketChannel);
      yield put(addCoinSuccess(responseFromSocket));
    } catch (error) {
      yield put(addCoinFailure(error));
    }
  }
}
function* addCoin() {
  yield takeEvery(ADD_COIN, addCoinSocket);
}

/* Get coin details */
const getCoinDetailsRequest = (socket, request) =>
  eventChannel(emit => {
    socket.onopen = () => {
      socket.send(JSON.stringify(request)); // Send data to server
    };
    socket.onmessage = event => {
      const msg = JSON.parse(event.data);
      emit(msg);
    };
    return () => {
      socket.close();
    };
  });
function* getCoinDetailsSocket(payload) {
  let request = {
    m: 0,
    i: 0,
    n: "GetWalletTypeMasterById",
    t: 0,
    r: 11,
    o: { WalletTypeId: payload.coinId }
  };
  const socket = new WebSocket("ws://172.20.65.131:8082/");
  const socketChannel = yield call(getCoinDetailsRequest, socket, request);
  while (true) {
    try {
      const responseFromSocket = yield take(socketChannel);
      yield put(getCoinDetailsSuccess(responseFromSocket));
    } catch (error) {
      yield put(getCoinDetailsFailure(error));
    }
  }
}
function* getCoinDetails() {
  yield takeEvery(GET_COINDETAILS, getCoinDetailsSocket);
}

/* Update Coin request method */
const updateCoinRequest = (socket, request) =>
  eventChannel(emit => {
    socket.onopen = () => {
      socket.send(JSON.stringify(request)); // Send data to server
    };
    socket.onmessage = event => {
      const msg = JSON.parse(event.data);
      emit(msg);
    };
    return () => {
      socket.close();
    };
  });
function* updateCoinSocket(payload) {
  let reqObj = payload.request;
  reqObj["WalletTypeId"] = payload.request.id;
  let request = {
    m: 0,
    i: 0,
    n: "UpdateWalletTypeMaster",
    t: 2,
    r: 11,
    o: payload.request
  };
  const socket = new WebSocket("ws://172.20.65.131:8082/");
  const socketChannel = yield call(updateCoinRequest, socket, request);
  while (true) {
    try {
      const responseFromSocket = yield take(socketChannel);
      yield put(updateCoinSuccess(responseFromSocket));
    } catch (error) {
      yield put(updateCoinFailure(error));
    }
  }
}
function* updateCoin() {
  yield takeEvery(UPDATE_COIN, updateCoinSocket);
}

/* Delete coin */
const deleteCoinRequest = (socket, request) =>
  eventChannel(emit => {
    socket.onopen = () => {
      socket.send(JSON.stringify(request)); // Send data to server
    };
    socket.onmessage = event => {
      const msg = JSON.parse(event.data);
      emit(msg);
    };
    return () => {
      socket.close();
    };
  });
function* deleteCoinSocket(payload) {
  let request = {
    m: 0,
    i: 0,
    n: "DeleteWalletTypeMaster",
    t: 4,
    r: 11,
    o: { WalletTypeId: payload.coinId }
  };
  const socket = new WebSocket("ws://172.20.65.131:8082/");
  const socketChannel = yield call(deleteCoinRequest, socket, request);
  while (true) {
    try {
      const responseFromSocket = yield take(socketChannel);
      yield put(deleteCoinSuccess(responseFromSocket));
    } catch (error) {
      yield put(deleteCoinFailure(error));
    }
  }
}
function* deleteCoin() {
  yield takeEvery(DELETE_COIN, deleteCoinSocket);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
  yield all([
    fork(getCoinList),
    fork(addCoin),
    fork(getCoinDetails),
    fork(updateCoin),
    fork(deleteCoin)
  ]);
}
