/**
 * Auther : Salim Deraiya
 * Created : 26/09/2018
 * Social Login Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { SOCIAL_LOGIN } from 'Actions/types';
//Action methods..
import { socialLoginSuccess, socialLoginFailure } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for socialLogin
function* socialLoginAPI({payload}) {
    var swapperUrl = '';
    if(payload.ProviderName === 'Facebook') {
        swapperUrl = 'api/Signin/ExternalLoginForFacebook';
    } else if(payload.ProviderName === 'Google') {
        swapperUrl = 'api/Signin/ExternalLoginForGoogle';
    }

    const response = yield call(swaggerPostAPI,swapperUrl,payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(socialLoginSuccess(response));
        } else {
            yield put(socialLoginFailure(response));
        }
    } catch (error) {
        yield put(socialLoginFailure(error));
    }
}

/* Create Sagas method for socialLogin */
export function* socialLoginSagas() {
    yield takeEvery(SOCIAL_LOGIN, socialLoginAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(socialLoginSagas)
    ]);
}