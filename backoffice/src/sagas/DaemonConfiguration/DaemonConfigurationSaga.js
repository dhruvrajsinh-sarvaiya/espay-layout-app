// sagas For Daemon Configuration Data Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import {
    GET_DAEMON_CONFIGURE_DATA,
    ADD_DAEMON_CONFIGURE_DATA,
    EDIT_DAEMON_CONFIGURE_DATA
} from "Actions/types";

// action sfor set data or response
import {
    getDaemonSuccess,
    getDaemonFailure,
    addDaemonSuccess,
    addDaemonFailure,
    editDaemonSuccess,
    editDaemonFailure
} from "Actions/DaemonConfigure";

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI } from 'Helpers/helpers';

// Sagas Function for get Daemon Configuration Data by :Tejas
function* getDaemonData() {
    yield takeEvery(GET_DAEMON_CONFIGURE_DATA, getDaemonDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getDaemonDataDetail({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/GetAllDemonConfig', payload, headers);

    try {

      /* if(loginErrCode.includes(response.statusCode)){
          redirectToLogin();
      } else if(statusErrCodeList.includes(response.statusCode)){               
        // console.log("runn3",response)
          staticRes = staticResponse(response.statusCode);
          yield put(tradingledgerFailure(staticRes));
      } else  */if (response.statusCode === 200 && response.ReturnCode === 0) {
            yield put(getDaemonSuccess(response.Response));
        } else {
            yield put(getDaemonFailure(response));
        }

    } catch (error) {
        yield put(getDaemonFailure(error));
    }

}

// Sagas Function for get Daemon Configuration Data by :Tejas
function* addDaemonData() {
    yield takeEvery(ADD_DAEMON_CONFIGURE_DATA, addDaemonDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* addDaemonDataDetail({ payload }) {

    // console.log("payload",payload);
	var headers = { 'Authorization': AppConfig.authorizationToken };
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddDemonConfiguration', payload, headers);
    // console.log("response",response);
    try {

      /* if(loginErrCode.includes(response.statusCode)){
          redirectToLogin();
      } else if(statusErrCodeList.includes(response.statusCode)){               
        // console.log("runn3",response)
          staticRes = staticResponse(response.statusCode);
          yield put(tradingledgerFailure(staticRes));
      } else  */if (response.statusCode === 200 && response.ReturnCode === 0) {
            yield put(addDaemonSuccess(response));
        } else {
            yield put(addDaemonFailure(response));
        }

    } catch (error) {
        yield put(addDaemonFailure(error));
    }

}


function* editDaemonData() {
    yield takeEvery(EDIT_DAEMON_CONFIGURE_DATA, editDaemonDataDetail);
}


function* editDaemonDataDetail({ payload }) {

    // console.log("payload",payload);
	var headers = { 'Authorization': AppConfig.authorizationToken };
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateDemonConfiguration', payload, headers);
    // console.log("response",response);
    try {

      /* if(loginErrCode.includes(response.statusCode)){
          redirectToLogin();
      } else if(statusErrCodeList.includes(response.statusCode)){               
        // console.log("runn3",response)
          staticRes = staticResponse(response.statusCode);
          yield put(tradingledgerFailure(staticRes));
      } else  */if (response.statusCode === 200 && response.ReturnCode === 0) {
            yield put(editDaemonSuccess(response));
        } else {
            yield put(editDaemonFailure(response));
        }

    } catch (error) {
        yield put(editDaemonFailure(error));
    }

}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(getDaemonData),
        fork(addDaemonData),
        fork(editDaemonData),
    ]);
}
