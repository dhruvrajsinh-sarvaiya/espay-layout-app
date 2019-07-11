/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Socket API
 */

//Sagas Effects..
import { call, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

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

function* webSocketAPI({ request_method, method, main_method, payload }) {
    const socket = new WebSocket('ws://172.20.65.131:8082/');

    //Request for socket
    let request = {
        m: 0,
        i: 0,
        n: method, //Method Name
        t: request_method, // get, post, put, patch ,delete
        r: main_method, //Main Method Section (Start to 0)
        o: payload
    }

    const socketChannel = yield call(watchMessages, socket, request);
    const response = yield take(socketChannel);
    return response;
}

export default webSocketAPI;