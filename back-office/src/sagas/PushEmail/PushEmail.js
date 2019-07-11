import {all, call, fork, put, takeEvery} from "redux-saga/effects";

import {
    EMAIL_PUSH,
}from 'Actions/types';

import {
    PushEmailSuccess,
    PushEmailFail
} from "Actions/PushEmail";

import { swaggerPostAPI } from 'Helpers/helpers';


function* pushEmailRequest({payload}){

    try{
        const response = yield call(swaggerPostAPI, 'api/GlobalNotification/PushEmail', payload.request,1);
        if (response != null && response.ReturnCode === 0) {
            yield put(PushEmailSuccess(response));
        }else{
            yield put(PushEmailFail(response));
        }
    }catch(error)
    {
        yield put(PushEmailFail(error));
    }

}


function* pushEmailSaga(){
    yield takeEvery(EMAIL_PUSH,pushEmailRequest);
}

export default function* rootSaga(){
    yield all([
        fork(pushEmailSaga)
    ]);
}
