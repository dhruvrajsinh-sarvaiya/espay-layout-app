import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI } from "../../api/helper";
import { REINVITE_USER, TWO_FA_DISABLE, UNLOCK_USER } from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import { reinviteUserApiSuccess, reinviteUserApiFailure, unlockUserApiSuccess, unlockUserApiFailure, disableTwoFaApiSuccess, disableTwoFaApiFailure } from "../../actions/account/UserListActions";

// Generator for reinvite user
function* reinviteUserDataApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call reinvite user Api
        const response = yield call(swaggerPostAPI, Method.ReInviteUser, payload, headers);

        // To set reinvite user success response to reducer
        yield put(reinviteUserApiSuccess(response));
    } catch (error) {

        // To set reinvite user failure response to reducer
        yield put(reinviteUserApiFailure(error));
    }
}

// Generator for unlock user
function* unlockUserDataApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call unlock user Api
        const response = yield call(swaggerPostAPI, Method.UnLockUser, payload, headers);

        // To set unlock user success response to reducer
        yield put(unlockUserApiSuccess(response));
    } catch (error) {

        // To set unlock user failure response to reducer
        yield put(unlockUserApiFailure(error));
    }
}

// Generator for twofa disable user
function* twofaDisableApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call twofa disable Api
        const response = yield call(swaggerPostAPI, Method.Disable2faUserwise, payload, headers);

        // To set twofa disable success response to reducer
        yield put(disableTwoFaApiSuccess(response));
    } catch (error) {

        // To set twofa disable failure response to reducer
        yield put(disableTwoFaApiFailure(error));
    }
}

//call Apis
export default function* UserListSaga() {

    // To register reinvite user Set method
    yield takeEvery(REINVITE_USER, reinviteUserDataApi);
    // To register unlock user Set method
    yield takeEvery(UNLOCK_USER, unlockUserDataApi);
    // To register disable twofa status user Set method
    yield takeEvery(TWO_FA_DISABLE, twofaDisableApiData);
}

