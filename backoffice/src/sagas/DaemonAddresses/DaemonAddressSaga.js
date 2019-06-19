/* 
    Developer : Nishant Vadgama
    Date : 19-09-2018
    FIle Comment : Daemon Address Listing saga 
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from 'axios';
import {
    swaggerPostAPI,
    swaggerGetAPI,
    redirectToLogin,
    loginErrCode,
    convertObjToFormData
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_DAEMON_ADDRESSES,
    IMPORT_ADDRESSES,
    EXPORT_ADDRESSES,
    CONFIRM_ADD_EXPORT,
} from "Actions/types";
// import functions from action
import {
    getDaemonAddressesSuccess,
    getDaemonAddressesFailure,
    importAddressesSuccess,
    importAddressesFailure,
    exportAddressesSuccess,
    exportAddressesFailure,
    // confirm address
    confirmAddExportSuccess,
    confirmAddExportFailure
} from "Actions/DaemonAddresses";

const lgnErrCode = loginErrCode();
// get daemon data from server
function* getDaemonAddressesData(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListAddressDetails/' + request.PageNo + '/' + request.PageSize + '?';
    if (request.hasOwnProperty("ServiceProviderID") && request.ServiceProviderID != "") {
        URL += '&ServiceProviderID=' + request.ServiceProviderID;
    }
    if (request.hasOwnProperty("UserID") && request.UserID != "") {
        URL += '&UserID=' + request.UserID;
    }
    if (request.hasOwnProperty("WalletTypeID") && request.WalletTypeID != "") {
        URL += '&WalletTypeID=' + request.WalletTypeID;
    }
    if (request.hasOwnProperty("Address") && request.Address != "") {
        URL += '&Address=' + request.Address;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(getDaemonAddressesSuccess(response));
            } else {
                yield put(getDaemonAddressesFailure(response));
            }
        }
    } catch (error) {
        yield put(getDaemonAddressesFailure(error));
    }
}
function* getDaemonAddresses() {
    yield takeEvery(GET_DAEMON_ADDRESSES, getDaemonAddressesData);
}
// import addresses request...
function* importAddressesRequest(payload) {
    const request = convertObjToFormData(payload.request);
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ImportAddress', request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(importAddressesSuccess(response));
            } else {
                yield put(importAddressesFailure(response));
            }
        }
    } catch (error) {
        yield put(importAddressesFailure(error));
    }
}
// import addresses...
function* importAddresses() {
    yield takeEvery(IMPORT_ADDRESSES, importAddressesRequest);
}
//export addresses request...
function* exportAddressesRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetExportAddressDetails', request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(exportAddressesSuccess(response));
            } else {
                yield put(exportAddressesFailure(response));
            }
        }
    } catch (error) {
        yield put(exportAddressesFailure(error));
    }
}
// export addresses
function* exportAddresses() {
    yield takeEvery(EXPORT_ADDRESSES, exportAddressesRequest);
}
// confirm export address 
const swaggerGetAPICustom = async (payload) => {
    var responseData = await axios.get(AppConfig.backofficeSwaggerUrl + 'api/WalletControlPanel/ConfirmAddExport?emailConfirmCode=' + payload.emailConfirmCode, {
        responseType: 'blob',
    })
    return responseData;
}
function* confirmAddressSagaAPI({ payload }) {
    const response = yield call(swaggerGetAPICustom, payload);
    try {
        if (response.status == 200 && response.data.size !== 0) {
            yield put(confirmAddExportSuccess(response));
        }
        else {
            yield put(confirmAddExportFailure(response));
        }
    }
    catch (error) {
        yield put(confirmAddExportFailure(error));
    }
}
export function* confirmAddressSaga() {
    yield takeEvery(CONFIRM_ADD_EXPORT, confirmAddressSagaAPI);
}
// link to root saga middleware
export default function* rootSaga() {
    yield all([
        fork(getDaemonAddresses),
        fork(importAddresses),
        fork(exportAddresses),
        fork(confirmAddressSaga)
    ]);
}
