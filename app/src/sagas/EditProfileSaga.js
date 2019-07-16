//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';

//Action Types..
import {
    EDIT_PROFILE,
    GET_PROFILE_BY_ID,
} from '../actions/ActionTypes';

//Action methods..
import {
    editProfileSuccess,
    editProfileFailure,
    getProfileByIDSuccess,
    getProfileByIDFailure,
} from '../actions/account/EditProfileActions';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerPostAPI, swaggerGetAPI } from '../api/helper';

//Function for Edit Profile
function* editProfileAPI(action) {
    try {
        const req = action.payload.data;

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Edit Profile api
        const response = yield call(swaggerPostAPI, Method.userinfo, req, headers);

        // To set Edit Profile api success response to reducer
        yield put(editProfileSuccess(response));
    } catch (error) {
        // To set Edit Profile api failure response to reducer
        yield put(editProfileFailure(error));
    }
}

//Function for Get Profile By ID
function* getProfileByIDAPI() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Profile By ID api
        const response = yield call(swaggerGetAPI, Method.userinfo, {}, headers);

        // To set Profile By ID success response to reducer
        yield put(getProfileByIDSuccess(response));
    } catch (error) {
        // To set Profile By ID failure response to reducer
        yield put(getProfileByIDFailure(error));
    }
}

/* Create Sagas method for Edit Profile */
export function* editProfileSagas() {
    yield takeLatest(EDIT_PROFILE, editProfileAPI);
}

/* Create Sagas method for Get Profile By ID */
export function* getProfileByIDSagas() {
    yield takeLatest(GET_PROFILE_BY_ID, getProfileByIDAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        // To register Edit Profile method
        fork(editProfileSagas),
        // To register Profile By ID method
        fork(getProfileByIDSagas),
    ]);
}