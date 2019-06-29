import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
// import types for dispatch puropse
import {
    GET_COIN_LIST,
    GET_PREFERENCE,
    SET_PREFERENCE,
    FETCH_WITHDRAWALADDRESS,
    SUBMIT_WITHDRAWALADDRESSES,
    ADDTO_WHITELIST,
    REMOVE_WHITELIST,
    DELETE_ADDRESSES
} from "Actions/types";
// import functions from action
import {
    getCurrencySuccess,
    getCurrencyFailure,
    getPreferenceSuccess,
    getPreferenceFailure,
    setPreferenceSuccess,
    setPreferenceFailure,
    getAllWhithdrawalAddressSuccess,
    getAllWhithdrawalAddressFail,
    onSubmitWhithdrawalAddressSuccess,
    onSubmitWhithdrawalAddressFail,
    addToWhitelistSuccess,
    addToWhitelistFailure,
    removeWhitelistSuccess,
    removeWhitelistFailure,
    deleteAddressSuccess,
    deleteAddressFailure
} from "Actions/AddressWhitelist";
const lgnErrCode = loginErrCode();
/* SERVER REQUEST */

/* GET COIN LIST */
function* getCurrencySocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllServiceConfiguration', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.statusCode == 200 && responseFromSocket.ReturnCode == 0) // success
                yield put(getCurrencySuccess(responseFromSocket.Response));
            else if (responseFromSocket.statusCode == 200 && responseFromSocket.ReturnCode == 1) // failure
                yield put(getCurrencySuccess({}));
        }
    } catch (error) {
        yield put(getCurrencyFailure(error));
    }
}
function* getCurrency() {
    yield takeEvery(GET_COIN_LIST, getCurrencySocket);
}
/* GET PREFERENCE */
function* getPreferenceSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOperations/GetUserPreferences', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.statusCode == 200 && responseFromSocket.BizResponse.ReturnCode == 0) // success
                yield put(getPreferenceSuccess(responseFromSocket.IsWhitelisting));
            else if (responseFromSocket.statusCode == 200 && responseFromSocket.BizResponse.ReturnCode == 1) // failure
                yield put(getPreferenceFailure(responseFromSocket.BizResponse.ReturnMsg));
        }
    } catch (error) {
        yield put(getPreferenceFailure(error));
    }
}
// dispatch action for get DepositHistory
function* getPreference() {
    yield takeEvery(GET_PREFERENCE, getPreferenceSocket);
}
/* set PREFERENCE */
function* setPreferenceSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOperations/SetUserPreferences/' + payload.preference, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.statusCode == 200) // success
                yield put(setPreferenceSuccess(responseFromSocket.BizResponse));
        }
    } catch (error) {
        yield put(setPreferenceFailure(error));
    }
}
// dispatch action for get DepositHistory
function* setPreference() {
    yield takeEvery(SET_PREFERENCE, setPreferenceSocket);
}
// fetch deposti history data from API
function* getWithdrwalAddressSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOperations/GetAllBeneficiaries', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.statusCode == 200 && responseFromSocket.BizResponse.ReturnCode == 0) // success
                yield put(getAllWhithdrawalAddressSuccess(responseFromSocket.Beneficiaries));
            else if (responseFromSocket.statusCode == 200 && responseFromSocket.BizResponse.ReturnCode == 1) // failure
                yield put(getAllWhithdrawalAddressFail(responseFromSocket.BizResponse.ReturnMsg));
        }
    } catch (error) {
        yield put(getAllWhithdrawalAddressFail(error));
    }
}
// dispatch action for get DepositHistory
function* getAllWhithdrawalAddress() {
    yield takeEvery(FETCH_WITHDRAWALADDRESS, getWithdrwalAddressSocket);
}
/* Add to whitelist form */
function* addWithdrawalAddressSocket(payloadValue) {
    var payload = payloadValue.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(
        swaggerPostAPI,
        'api/WalletOperations/AddBeneficiary/' + payload.CoinName + '/' + payload.BeneficiaryAddress + '/' + payload.BeneficiaryName + '/' + payload.WhitelistingBit,
        payload,
        headers
    );
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode == 200) {
            yield put(onSubmitWhithdrawalAddressSuccess(responseFromSocket.BizResponse));
        } else {
            yield put(onSubmitWhithdrawalAddressFail(responseFromSocket));
        }
    } catch (error) {
        yield put(onSubmitWhithdrawalAddressFail(error));
    }
}
export function* onSubmitWhithdrawalAddress() {
    yield takeEvery(SUBMIT_WITHDRAWALADDRESSES, addWithdrawalAddressSocket);
}
/* Add bulk to whitelist  */
function* addToWhitelistSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(
        swaggerPostAPI,
        'api/WalletOperations/WhitelistBeneficiary',
        { "ID": payload.request, "WhitelistingBit": 1 },
        headers
    );
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode == 200) {
            yield put(addToWhitelistSuccess(responseFromSocket.BizResponse));
        } else {
            yield put(addToWhitelistFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(addToWhitelistFailure(error));
    }
}
function* addToWhitelist() {
    yield takeEvery(ADDTO_WHITELIST, addToWhitelistSocket)
}
/* Remove bulk from whitelist  */
function* removeWhitelistSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(
        swaggerPostAPI,
        'api/WalletOperations/WhitelistBeneficiary',
        { "ID": payload.request, "WhitelistingBit": 0 },
        headers
    );
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode == 200) {
            yield put(removeWhitelistSuccess(responseFromSocket.BizResponse));
        } else {
            yield put(removeWhitelistFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(removeWhitelistFailure(error));
    }
}
function* removeWhitelist() {
    yield takeEvery(REMOVE_WHITELIST, removeWhitelistSocket)
}
/* delete bulk to whitelist  */
function* deleteAddressSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(
        swaggerPostAPI,
        'api/WalletOperations/WhitelistBeneficiary',
        { "ID": payload.request, "WhitelistingBit": 9 },
        headers
    );
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode == 200) {
            yield put(deleteAddressSuccess(responseFromSocket.BizResponse));
        } else {
            yield put(deleteAddressFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(deleteAddressFailure(error));
    }
}
function* deleteAddress() {
    yield takeEvery(DELETE_ADDRESSES, deleteAddressSocket)
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getCurrency),
        fork(getPreference),
        fork(setPreference),
        fork(getAllWhithdrawalAddress),
        fork(onSubmitWhithdrawalAddress),
        fork(addToWhitelist),
        fork(removeWhitelist),
        fork(deleteAddress),
    ]);
}
