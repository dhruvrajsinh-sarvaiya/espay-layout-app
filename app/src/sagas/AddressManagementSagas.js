import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";
import { userAccessToken } from '../selector';

// import types for dispatch puropse
import {
    GET_PREFERENCE,
    SET_PREFERENCE,
    FETCH_WITHDRAWALADDRESS,
    SUBMIT_WITHDRAWALADDRESSES,
    ADDTO_WHITELIST,
    REMOVE_WHITELIST,
    DELETE_ADDRESSES,
    VERIFY_2FA
} from "../actions/ActionTypes";

// import functions from action
import {
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
    deleteAddressFailure,
    twoFAGoogleAuthenticationSuccess,
    twoFAGoogleAuthenticationFailure
} from "../actions/Wallet/AddressManagementAction";
import { Method } from "../controllers/Constants";
import { swaggerGetAPI, swaggerPostAPI } from "../api/helper";


/* GET PREFERENCE */
function* getPreferenceSocket() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Preference socket api
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetUserPreferences, {}, headers);

        // To set Preference Socket success response to reducer
        yield put(getPreferenceSuccess(responseFromSocket));
    } catch (error) {
        // To set Preference Socket failure response to reducer
        yield put(getPreferenceFailure(error));
    }
}
// dispatch action for get DepositHistory
function* getPreference() {
    yield takeLatest(GET_PREFERENCE, getPreferenceSocket);
}

/* set PREFERENCE */
function* setPreferenceSocket({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Set Preference socket api
        const responseFromSocket = yield call(swaggerPostAPI, Method.SetUserPreferences + '/' + payload.GlobalBit, payload, headers);
        
        // To set Preference Socket success response to reducer
        yield put(setPreferenceSuccess(responseFromSocket));
    } catch (error) {
        // To set Preference Socket failure response to reducer
        yield put(setPreferenceFailure(error));
    }
}

// dispatch action for get DepositHistory
function* setPreference() {
    yield takeLatest(SET_PREFERENCE, setPreferenceSocket);
}

// fetch deposti history data from API
function* getWithdrwalAddressSocket() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Withdrawal Address Socket api
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetAllBeneficiaries, {}, headers);

        // To set Withdrawal Address Socket success response to reducer
        yield put(getAllWhithdrawalAddressSuccess(responseFromSocket));
    } catch (error) {
        // To set Withdrawal Address Socket failure response to reducer
        yield put(getAllWhithdrawalAddressFail(error));
    }
}
// dispatch action for get DepositHistory
function* getAllWhithdrawalAddress() {
    yield takeLatest(FETCH_WITHDRAWALADDRESS, getWithdrwalAddressSocket);
}

/* Add to whitelist form */
function* addWithdrawalAddressSocket({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Add Withdrawal Address Socket api
        const responseFromSocket = yield call(
            swaggerPostAPI,
            Method.AddBeneficiary + '/' + payload.CoinName + '/' + payload.BeneficiaryAddress + '/' + payload.BeneficiaryName + '/' + payload.WhitelistingBit,
            payload,
            headers
        );

        // To set Add Withdrawal Address Socket success response to reducer
        yield put(onSubmitWhithdrawalAddressSuccess(responseFromSocket));
    } catch (error) {
        // To set Add Withdrawal Address Socket failure response to reducer
        yield put(onSubmitWhithdrawalAddressFail(error));
    }
}

export function* onSubmitWhithdrawalAddress() {
    yield takeLatest(SUBMIT_WITHDRAWALADDRESSES, addWithdrawalAddressSocket);
}

/* Add bulk to whitelist  */
function* addToWhitelistSocket({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Add to Whitelist Socket api
        const responseFromSocket = yield call(
            swaggerPostAPI,
            Method.WhitelistBeneficiary,
            payload,
            headers
        );

        // To set Add to Whitelist Socket success response to reducer
        yield put(addToWhitelistSuccess(responseFromSocket));
    } catch (error) {
        // To set Add to Whitelist Socket failure response to reducer
        yield put(addToWhitelistFailure(error));
    }
}
function* addToWhitelist() {
    yield takeLatest(ADDTO_WHITELIST, addToWhitelistSocket)
}

/* Remove bulk from whitelist  */
function* removeWhitelistSocket({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call remove whitelist to socket api
        const responseFromSocket = yield call(
            swaggerPostAPI,
            Method.WhitelistBeneficiary,
            payload,
            headers
        );

        // To set remove from Whitelist Socket success response to reducer
        yield put(removeWhitelistSuccess(responseFromSocket));
    } catch (error) {
        // To set remove from Whitelist Socket failure response to reducer
        yield put(removeWhitelistFailure(error));
    }
}

function* removeWhitelist() {
    yield takeLatest(REMOVE_WHITELIST, removeWhitelistSocket)
}

/* delete bulk to whitelist  */
function* deleteAddressSocket({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Delete Address Socket api
        const responseFromSocket = yield call(
            swaggerPostAPI,
            Method.WhitelistBeneficiary,
            payload,
            headers
        );

        // To set Delete Address success response to reducer
        yield put(deleteAddressSuccess(responseFromSocket));
    } catch (error) {
        // To set Delete Address failure response to reducer
        yield put(deleteAddressFailure(error));
    }
}

function* deleteAddress() {
    yield takeLatest(DELETE_ADDRESSES, deleteAddressSocket)
}

function* verifyGoogleAuthCode(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Verify Google Auth api
        const response = yield call(swaggerPostAPI, Method.TwoFAVerifyCode, payload.verifyCodeRequest, headers);

        // To set Verify Google Auth success response to reducer
        yield put(twoFAGoogleAuthenticationSuccess(response));
    } catch (error) {
        // To set Verify Google Auth failure response to reducer
        yield put(twoFAGoogleAuthenticationFailure(error));
    }
}

function* Verify2fa() {
    yield takeLatest(VERIFY_2FA, verifyGoogleAuthCode)
}


// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        // To register getPreference method 
        fork(getPreference),
        // To register setPreference method 
        fork(setPreference),
        // To register getAllWhithdrawalAddress method 
        fork(getAllWhithdrawalAddress),
        // To register onSubmitWhithdrawalAddress method 
        fork(onSubmitWhithdrawalAddress),
        // To register addToWhitelist method 
        fork(addToWhitelist),
        // To register removeWhitelist method 
        fork(removeWhitelist),
        // To register deleteAddress method 
        fork(deleteAddress),
        // To register Verify2fa method 
        fork(Verify2fa),
    ]);
}
