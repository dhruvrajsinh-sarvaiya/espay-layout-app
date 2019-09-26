import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import axios from 'axios';
import {
    swaggerPostAPI,
    swaggerGetAPI,
    convertObjToFormData
} from "../../api/helper";

import {
    GET_DAEMON_ADDRESSES,
    IMPORT_ADDRESSES,
    EXPORT_ADDRESSES,
    CONFIRM_ADD_EXPORT,
} from '../../actions/ActionTypes';

// import functions from action
import {
    getDaemonAddressesSuccess,
    getDaemonAddressesFailure,
    importAddressesSuccess,
    importAddressesFailure,
    exportAddressesSuccess,
    exportAddressesFailure,
    confirmAddExportSuccess,
    confirmAddExportFailure
} from '../../actions/Wallet/DaemonAddressAction';
import { AppConfig } from "../../controllers/AppConfig";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";

// get daemon data from server
function* getDaemonAddressesData({ payload }) {
    try {
        const request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.ListAddressDetails + '/' + request.PageNo + '/' + request.PageSize + '?';

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

        // To call daemon address Data Api
        const response = yield call(swaggerGetAPI, URL, request, headers);

        // To set daemon address success response to reducerF
        yield put(getDaemonAddressesSuccess(response));
    }
    catch (error) {
        // To set daemon addresse failure response to reducer
        yield put(getDaemonAddressesFailure(error));
    }
}

// To call daemon address Api
function* getDaemonAddresses() {
    yield takeEvery(GET_DAEMON_ADDRESSES, getDaemonAddressesData);
}

// import addresses request...
function* importAddressesRequest(payload) {

    try {
        const request = convertObjToFormData(payload.request);

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const response = yield call(swaggerPostAPI, Method.ImportAddress, request, headers);
        yield put(importAddressesSuccess(response));
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
    try {
        const request = payload.request;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const response = yield call(swaggerGetAPI, Method.GetExportAddressDetails, request, headers);
        yield put(exportAddressesSuccess(response));
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
    var responseData = await axios.get(AppConfig.baseURL + AppConfig.hostName + Method.ConfirmAddExport + '?emailConfirmCode=' + payload.emailConfirmCode, {
        responseType: 'blob',
    })
    return responseData;
}

function* confirmAddressSagaAPI({ payload }) {
    try {
        const response = yield call(swaggerGetAPICustom, payload);

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
        //fork(confirmAddressSaga)
    ]);
}
