/* 
    Developer : Kevin Ladani
    Date : 17-01-2019
    File Comment : MyAccount Password Policy Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    LIST_PROFILE_CONFIG_DASHBOARD,
    ADD_PROFILE_CONFIG_DASHBOARD,
    DELETE_PROFILE_CONFIG_DASHBOARD,
    UPDATE_PROFILE_CONFIG_DASHBOARD,
    GET_PROFILE_TYPE,
    GET_KYCLEVEL_LIST,
    GET_PROFILELEVEL_LIST,
    GET_PROFILEBY_ID,
    GET_LIST_CURRENCY,

} from "Actions/types";
// import functions from action
import {
    getProfileConfigDataSuccess,
    getProfileConfigDataFailure,
    addProfileConfigDataSuccess,
    addProfileConfigDataFailure,
    deleteProfileConfigDataSuccess,
    deleteProfileConfigDataFailure,
    updateProfileConfigDataSuccess,
    updateProfileConfigDataFailure,
    getProfileTypeSuccess,
    getProfileTypeFailure,
    getKYCLevelListSuccess,
    getKYCLevelListFailure,
    getProfileLevelListSuccess,
    getProfileLevelListFailure,
    getProfileByIdSuccess,
    getProfileByIdFailure,
    getCurrencyListSuccess,
    getCurrencyListFailure,

} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Policy Configuration Data API
function* getProfileConfigDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var swaggerUrl = 'api/ProfileConfiguration/GetProfileConfiguration?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;

    if (payload.hasOwnProperty("TypeId") && payload.TypeId !== "") {
        swaggerUrl += '&TypeId=' + payload.TypeId;
    }
    if (payload.hasOwnProperty("IsRecursive") && payload.IsRecursive !== "") {
        swaggerUrl += '&IsRecursive=' + payload.IsRecursive;
    }
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        swaggerUrl += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        swaggerUrl += '&ToDate=' + payload.ToDate;
    }

    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getProfileConfigDataSuccess(response));
        } else {
            yield put(getProfileConfigDataFailure(response));
        }
    } catch (error) {
        yield put(getProfileConfigDataFailure(error));
    }
}

//Function for Add Policy Configuration API
function* addProfileConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/ProfileConfiguration/AddProfileConfiguration', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addProfileConfigDataSuccess(response));
        }
        else {
            yield put(addProfileConfigDataFailure(response));
        }
    } catch (error) {
        yield put(addProfileConfigDataFailure(error));
    }
}

//Function for Delete Policy Configuration API
function* deleteProfileConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/ProfileConfiguration/DeleteProfileConfiguration', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(deleteProfileConfigDataSuccess(response));
        } else {
            yield put(deleteProfileConfigDataFailure(response));
        }
    } catch (error) {
        yield put(deleteProfileConfigDataFailure(error));
    }
}

//Function for Update  Policy Configuration API
function* updateProfileConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/ProfileConfiguration/UpdatProfileConfiguration', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateProfileConfigDataSuccess(response));
        } else {
            yield put(updateProfileConfigDataFailure(response));
        }
    } catch (error) {
        yield put(updateProfileConfigDataFailure(error));
    }
}

//Display Profile Type Dashbord Data
function* getProfileTypeAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Complaint/GetTypeMaster?Type=Profile', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getProfileTypeSuccess(response));
        } else {
            yield put(getProfileTypeFailure(response));
        }
    } catch (error) {
        yield put(getProfileTypeFailure(error));
    }
}

//Display KYC Level List Dashbord Data
function* getKYCLevelAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/KYCConfiguration/GetKYCLevelDropDownList', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getKYCLevelListSuccess(response));
        } else {
            yield put(getKYCLevelListFailure(response));
        }
    } catch (error) {
        yield put(getKYCLevelListFailure(error));
    }
}

//Display Profile Level List Dashbord Data
function* getProfileLevelAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/ProfileConfiguration/GetProfilelevelmasterDropDownList', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getProfileLevelListSuccess(response));
        } else {
            yield put(getProfileLevelListFailure(response));
        }
    } catch (error) {
        yield put(getProfileLevelListFailure(error));
    }
}

//Display Profile Level List Dashbord Data
function* getProfileByIdAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/ProfileConfiguration/GetProfileConfigurationById?Id=' + payload, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getProfileByIdSuccess(response));
        } else {
            yield put(getProfileByIdFailure(response));
        }
    } catch (error) {
        yield put(getProfileByIdFailure(error));
    }
}

//Display Currency Data
function* getCurrencyDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletConfiguration/ListAllWalletTypeMaster', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getCurrencyListSuccess(response));
        } else {
            yield put(getCurrencyListFailure(response));
        }
    } catch (error) {
        yield put(getCurrencyListFailure(error));
    }
}


//Display Policy Configuration Data
function* getProfileConfigValue() {
    yield takeEvery(LIST_PROFILE_CONFIG_DASHBOARD, getProfileConfigDataAPI);
}

/* Create Sagas method for Add Policy Configuration */
export function* addProfileConfigValue() {
    yield takeEvery(ADD_PROFILE_CONFIG_DASHBOARD, addProfileConfigAPI);
}

/* Create Sagas method for Delete Policy Configuration */
export function* deleteProfileConfigValue() {
    yield takeEvery(DELETE_PROFILE_CONFIG_DASHBOARD, deleteProfileConfigAPI);
}

/* Create Sagas method for Update Policy Configuration */
export function* updateProfileConfigValue() {
    yield takeEvery(UPDATE_PROFILE_CONFIG_DASHBOARD, updateProfileConfigAPI);
}

/* Create Sagas method for activity Profile Type */
export function* getProfileTypeDataValue() {
    yield takeEvery(GET_PROFILE_TYPE, getProfileTypeAPI);
}

/* Create Sagas method for activity KYC Level */
export function* getKYCLevelDataValue() {
    yield takeEvery(GET_KYCLEVEL_LIST, getKYCLevelAPI);
}

/* Create Sagas method for activity Profile Level List */
export function* getProfileLevelDataValue() {
    yield takeEvery(GET_PROFILELEVEL_LIST, getProfileLevelAPI);
}

/* Create Sagas method for activity Profile By ID */
export function* getProfileByIdValue() {
    yield takeEvery(GET_PROFILEBY_ID, getProfileByIdAPI);
}

/* Create Sagas method for activity Profile By ID */
export function* getCurrencyDataValue() {
    yield takeEvery(GET_LIST_CURRENCY, getCurrencyDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getProfileConfigValue),
        fork(addProfileConfigValue),
        fork(deleteProfileConfigValue),
        fork(updateProfileConfigValue),
        fork(getProfileTypeDataValue),
        fork(getKYCLevelDataValue),
        fork(getProfileLevelDataValue),
        fork(getProfileByIdValue),
        fork(getCurrencyDataValue),
    ]);
}