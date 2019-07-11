/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup With Blockchain Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

//Action Types..
import {
    SIGNUP_WITH_BLOCKCHAIN
} from 'Actions/types';

//Action methods..
import {
    signUpWithBlockchainSuccess,
    signUpWithBlockchainFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;

//WebSocket Call...
const watchMessages = (socket, request) => eventChannel((emit) => {
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

//Function for Signup With Blockchain
function* signUpWithBlockchainAPI({ payload }) {
    const socket = new WebSocket(socketApiUrl);

    let request = {
        m: 0,
        i: 0,
        n: 'BlockChainSignUp',
        t: 1,
        r: 3,
        o: payload
    }

    const socketChannel = yield call(watchMessages, socket, request);
    try {
        const response = yield take(socketChannel);
        if (response.statusCode === 200) {
            yield put(signUpWithBlockchainSuccess(response));
        } else {
            yield put(signUpWithBlockchainFailure(response));
        }
    } catch (error) {
        yield put(signUpWithBlockchainFailure(error));
    }
}

/* Create Sagas method for Signup With Blockchain */
export function* signUpWithBlockchainSagas() {
    yield takeEvery(SIGNUP_WITH_BLOCKCHAIN, signUpWithBlockchainAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(signUpWithBlockchainSagas)
    ]);
}