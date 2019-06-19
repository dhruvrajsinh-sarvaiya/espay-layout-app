/**
 * Auther : Salim Deraiya
 * Created : 08/12/2018
 * Device Authorized Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { DEVICE_AUTHORIZE } from 'Actions/types';
//Action methods..
import { deviceAuthorizeSuccess, deviceAuthorizeFailure } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Email Confirmation
function* deviceAuthorizeAPI({payload}) { 
    const response = yield call(swaggerGetAPI,'api/Signin/DeviceAuthorize?authorizecode='+payload.authorizecode,{});
    
    try {
        //console.log('Email Res',response);
        if(response.ReturnCode === 0) {
            yield put(deviceAuthorizeSuccess(response));
        } else {
            yield put(deviceAuthorizeFailure(response));
        }
    } catch (error) {
        yield put(deviceAuthorizeFailure(error));
    }
}

/* Create Sagas method for Email Confirmation */
export function* deviceAuthorizeSagas() {
    yield takeEvery(DEVICE_AUTHORIZE, deviceAuthorizeAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(deviceAuthorizeSagas)
    ]);
}