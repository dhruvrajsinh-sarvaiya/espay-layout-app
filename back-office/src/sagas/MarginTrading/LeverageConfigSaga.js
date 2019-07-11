/* 
    Developer : Vishva Shah
    Date : 18-02-2019
    File Comment : LeverageConfig saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LISTLEVERAGE,
    REMOVELEVERAGE,
    INSERTUPDATELEVERAGE
} from 'Actions/types';
import {
    getListLeverageSuccess,
    getListLeverageFailure,
    removeLeverageSuccess,
    removeLeverageFailure,
    insertUpdateLeverageSuccess,
    insertUpdateLeverageFailure
} from 'Actions/MarginTrading/LeverageConfiguration';

//get Leverage list from API
function* getListLeverageAPI(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MarginWalletControlPanel/ListLeverage?';
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getListLeverageSuccess(response));
        } else {
            yield put(getListLeverageFailure(response));
        }
    } catch (error) {
        yield put(getListLeverageFailure(error));
    }
}

/* get Leverage list */
export function* getListLeverage() {
    yield takeEvery(LISTLEVERAGE, getListLeverageAPI);
}

/* remove Leverage Config request... */
function* removeLeverageAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/MarginWalletControlPanel/ChangeLeverageStatus/' + payload.Id + '/9', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(removeLeverageSuccess(response));
        } else {
            yield put(removeLeverageFailure(response));
        }
    } catch (error) {
        yield put(removeLeverageFailure(error));
    }
}

/* remove Leverage Config...  */
export function* removeLeverageConfig() {
    yield takeEvery(REMOVELEVERAGE, removeLeverageAPI);
}

/* insert & update Leverage Config... */
function* insertUpdateLeverageAPI(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/MarginWalletControlPanel/InserUpdateLeverage', request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(insertUpdateLeverageSuccess(response));
        } else {
            yield put(insertUpdateLeverageFailure(response));
        }
    } catch (error) {
        yield put(insertUpdateLeverageFailure(error));
    }
}

/* insert & update Leverage config...  */
export function* insertUpdateLeverageList() {
    yield takeEvery(INSERTUPDATELEVERAGE, insertUpdateLeverageAPI);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getListLeverage),
        fork(removeLeverageConfig),
        fork(insertUpdateLeverageList)
    ]);
}