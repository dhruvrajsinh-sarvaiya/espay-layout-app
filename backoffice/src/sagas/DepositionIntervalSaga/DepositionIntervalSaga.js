/**
 *   Developer : Parth Andhariya
 *   Date : 22-03-2019
 *    Deposition Interval Saga
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from "Helpers/helpers";
import AppConfig from "Constants/AppConfig";
import {
    GET_DEPOSIT_INTERVAL,
    ADD_UPDATE_DEPOSIT_INTERVAL
} from "Actions/types";
import {
    ListDepositionIntervalSuccess,
    ListDepositionIntervalFailure,
    AddUpdateDepositionIntervalSuccess,
    AddUpdateDepositionIntervalFailure
} from "Actions/DepositionInterval";

//Get charge configuration Api Call
function* ListDepositionIntervalApi(payload) {
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/ListDepositionInterval";
    const response = yield call(swaggerGetAPI, URL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(ListDepositionIntervalSuccess(response));
        } else {
            yield put(ListDepositionIntervalFailure(response));
        }
    } catch (error) {
        yield put(ListDepositionIntervalFailure(error));
    }
}
//calling list api 
function* ListDepositionInterval() {
    yield takeEvery(GET_DEPOSIT_INTERVAL, ListDepositionIntervalApi);
}
//add Change Configuration
function* AddUpdateDepositionIntervalApi({ payload }) {
    var headers = { Authorization: AppConfig.authorizationToken };
    const response = yield call(
        swaggerPostAPI,
        "api/WalletControlPanel/AddDepositionInterval",
        payload,
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(AddUpdateDepositionIntervalSuccess(response));
        } else {
            yield put(AddUpdateDepositionIntervalFailure(response));
        }
    } catch (error) {
        yield put(AddUpdateDepositionIntervalFailure(error));
    }
}
//calling add api 
function* AddUpdateDepositionInterval() {
    yield takeEvery(ADD_UPDATE_DEPOSIT_INTERVAL, AddUpdateDepositionIntervalApi);
}
export default function* rootSaga() {
    yield all([
        fork(ListDepositionInterval),
        fork(AddUpdateDepositionInterval),
    ]);
}
