import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import { GET_TRANSFERIN } from "Actions/types";
import { getTransferInSuccess, getTransferInFailure } from "Actions/TransferIn";

function* getTransferInRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletConfiguration/GetTransferIn/' + request.Page + '/' + request.PageSize + '/' + request.WalletType + '?';
    if (request.hasOwnProperty("UserId") && request.UserId !== "") {
        URL += '&UserId=' + request.UserId;
    }
    if (request.hasOwnProperty("OrgId") && request.OrgId !== "") {
        URL += '&OrgId=' + request.OrgId;
    }
    if (request.hasOwnProperty("Address") && request.Address !== "") {
        URL += '&Address=' + request.Address;
    }
    if (request.hasOwnProperty("TrnID") && request.TrnID !== "") {
        URL += '&TrnID=' + request.TrnID;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.BizResponseObj.ReturnCode === 0) {
            yield put(getTransferInSuccess(response));
        } else {
            yield put(getTransferInFailure(response));
        }
    } catch (error) {
        yield put(getTransferInFailure(error));
    }
}
function* getTransferIn() {
    yield takeEvery(GET_TRANSFERIN, getTransferInRequest);
}
export default function* rootSaga() {
    yield all([
        fork(getTransferIn)
    ]);
}
