import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import { GET_TRANSFEROUT } from "Actions/types";
import { getTransferOutSuccess, getTransferOutFailure } from "Actions/TransferOut";

function* getTransferOutRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletConfiguration/GetTransferOut/' + request.Page + '/' + request.PageSize + '/' + request.WalletType + '?';
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
            yield put(getTransferOutSuccess(response));
        } else {
            yield put(getTransferOutFailure(response));
        }
    } catch (error) {
        yield put(getTransferOutFailure(error));
    }
}
function* getTransferOut() {
    yield takeEvery(GET_TRANSFEROUT, getTransferOutRequest);
}
export default function* rootSaga() {
    yield all([
        fork(getTransferOut)
    ]);
}
