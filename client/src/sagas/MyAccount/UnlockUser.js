/**
 * Auther : Salim Deraiya
 * Created : 01/11/2018
 * Unlock User Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

//Action Types..
import {
    UNLOCK_USER
} from 'Actions/types';

//Action methods..
import {
    unlockUserSuccess,
    unlockUserFailure
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

//Function for unlockUser
function* unlockUserAPI({ payload }) {
    const socket = new WebSocket(socketApiUrl);

    let request = {
        m: 0,
        i: 0,
        n: 'UnLockUser',
        t: 1,
        r: 2,
        o: payload
    }

    const socketChannel = yield call(watchMessages, socket, request);
    while (true) {
        try {
            const response = yield take(socketChannel);
            if (response.statusCode === 200) {
                yield put(unlockUserSuccess(response));
                break;
            } else {
                yield put(unlockUserFailure(response));
                break;
            }
        } catch (error) {
            yield put(unlockUserFailure(error));
            break;
        }
    }
}

/* Create Sagas method for unlockUser */
export function* unlockUserSagas() {
    yield takeEvery(UNLOCK_USER, unlockUserAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(unlockUserSagas)
    ]);
}