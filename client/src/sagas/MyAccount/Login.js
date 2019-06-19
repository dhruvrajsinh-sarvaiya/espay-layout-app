/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * 2FA Authentication Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    LOGIN,
    LOGIN_BLOCKCHAIN
} from 'Actions/types';

//Action methods..
import {
    loginSuccess,
    loginFailure,
    loginBlockchainSuccess,
    loginBlockchainFailure
} from 'Actions/MyAccount';

//Function check API call for Login..
const getLoginAPIRequest = async (request) =>
    await api.get('transHistory.js')
        .then(response => response)
        .catch(error => error);

//Function check API call for Login Blockchain..
const getLoginBlockchainAPIRequest = async (request) =>
    await api.get('transHistory.js')
        .then(response => response)
        .catch(error => error);

const response = {
    status: 200,
    data: {
        message: 'Code not match',
    }
};

//Function for Login
function* loginAPI({ payload }) {

    try {
        //const response = yield call(getLoginAPIRequest,payload);        
        if (response.status === 200) {
            yield put(loginSuccess(response));
        } else {
            yield put(loginFailure(data.message));
        }
    } catch (error) {
        yield put(loginFailure(error));
    }
}

//Function for Login Blockchain
function* loginBlockchainAPI({ payload }) {
    try {
        //const response = yield call(getLoginBlockchainAPIRequest,payload);

        if (response.status === 200) {
            yield put(loginBlockchainSuccess(response));
        } else {
            yield put(loginBlockchainFailure(data.message));
        }
    } catch (error) {
        yield put(loginBlockchainFailure(error));
    }
}


/* Create Sagas method for login */
export function* loginSagas() {
    yield takeEvery(LOGIN, loginAPI);
}

/* Create Sagas method for loginBlockchain */
export function* loginBlockchainSagas() {
    yield takeEvery(LOGIN_BLOCKCHAIN, loginBlockchainAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(loginSagas),
        fork(loginBlockchainSagas)
    ]);
}
