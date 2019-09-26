import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { PROFILE_CONFIG_LIST, PROFILE_CONFIG_DELETE, GET_PROFILE_TYPE, ADD_PROFILE_CONFIG_DASHBOARD, GET_KYCLEVEL_LIST, GET_PROFILELEVEL_LIST, UPDATE_PROFILE_CONFIG_DASHBOARD } from '../../actions/ActionTypes';
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import { getProfileTypeSuccess, getProfileTypeFailure, deleteProfileConfigSuccess, deleteProfileConfigFailure, getProfileConfigListSuccess, getProfileConfigListFailure, addProfileConfigDataSuccess, addProfileConfigDataFailure, getKYCLevelListSuccess, getKYCLevelListFailure, updateProfileConfigDataFailure, updateProfileConfigDataSuccess, getProfileLevelListSuccess, getProfileLevelListFailure } from "../../actions/account/ProfileConfigAction";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";

function* getProfileConfigListAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        var swaggerUrl = Method.GetProfileConfiguration + '?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;

        if (payload.hasOwnProperty("Typeid") && payload.Typeid !== "") {
            swaggerUrl += '&Typeid=' + payload.Typeid;
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

        // To call Profile config list Api
        const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

        // To set Profile config list success response to reducer
        yield put(getProfileConfigListSuccess(response));
    } catch (error) {

        // To set Profile config list failure response to reducer
        yield put(getProfileConfigListFailure(error));
    }
}

function* deleteProfileConfigAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Delete Profile config  Api
        const response = yield call(swaggerPostAPI, Method.DeleteProfileConfiguration, payload, headers);

        // To set Delete Profile config success response to reducer
        yield put(deleteProfileConfigSuccess(response));
    } catch (error) {

        // To set Delete Profile config failure response to reducer
        yield put(deleteProfileConfigFailure(error));
    }
}

function* getProfileTypeAPI() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Profile type Api
        const response = yield call(swaggerGetAPI, Method.GetTypeMaster + '?Type=Profile', {}, headers);

        // To set Profile type success response to reducer
        yield put(getProfileTypeSuccess(response));
    } catch (error) {

        // To set Profile type failure response to reducer
        yield put(getProfileTypeFailure(error));
    }
}

function* addProfileConfigAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call add profile config Api
        const response = yield call(swaggerPostAPI, Method.AddProfileConfiguration, payload, headers);

        // To set add profile config success response to reducer
        yield put(addProfileConfigDataSuccess(response));
    }
    catch (error) {

        // To set add profile config failure response to reducer
        yield put(addProfileConfigDataFailure(error));
    }
}

//Function for Update  Policy Configuration API
function* updateProfileConfigAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call update profile config Api
        const response = yield call(swaggerPostAPI, Method.UpdatProfileConfiguration, payload, headers);

        // To set update profile config success response to reducer
        yield put(updateProfileConfigDataSuccess(response));
    } catch (error) {

        // To set update profile config failure response to reducer 
        yield put(updateProfileConfigDataFailure(error));
    }
}

//Display KYC Level List Dashbord Data
function* getKYCLevelAPI() {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call kyc level Api
        const response = yield call(swaggerGetAPI, Method.GetKYCLevelDropDownList, {}, headers);

        // To set kyc level success response to reducer
        yield put(getKYCLevelListSuccess(response));
    } catch (error) {

        // To set kyc level failure response to reducer
        yield put(getKYCLevelListFailure(error));
    }
}

//Display Profile Level List Dashbord Data
function* getProfileLevelAPI() {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call profile type Api
        const response = yield call(swaggerGetAPI, Method.GetProfilelevelmasterDropDownList, {}, headers);

        // To set profile type success response to reducer
        yield put(getProfileLevelListSuccess(response));
    } catch (error) {

        // To set profile type failure response to reducer
        yield put(getProfileLevelListFailure(error));
    }
}

function* ProfileConfig() {
    yield takeEvery(PROFILE_CONFIG_LIST, getProfileConfigListAPI);
    yield takeEvery(PROFILE_CONFIG_DELETE, deleteProfileConfigAPI);
    yield takeEvery(GET_PROFILE_TYPE, getProfileTypeAPI);
    yield takeEvery(ADD_PROFILE_CONFIG_DASHBOARD, addProfileConfigAPI);
    yield takeEvery(UPDATE_PROFILE_CONFIG_DASHBOARD, updateProfileConfigAPI);
    yield takeEvery(GET_KYCLEVEL_LIST, getKYCLevelAPI);
    yield takeEvery(GET_PROFILELEVEL_LIST, getProfileLevelAPI);
}

//root saga middleware
export default function* rootSaga() {
    yield all([
        fork(ProfileConfig),
    ]);
}