/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * User Profile Details Sagas
 */

//Sagas Effects..
import { all, call,fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    EDIT_PROFILE,
    GET_PROFILE_BY_ID,
} from 'Actions/types';

//Action methods..
import {
    editProfileSuccess,
    editProfileFailure,
    getProfileByIDSuccess,
    getProfileByIDFailure,
} from 'Actions/MyAccount';

import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Edit Profile
function* editProfileAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Manage/userinfo',payload,1);
    
    try {
        if(response.ReturnCode === 0) {
            yield put(editProfileSuccess(response));
        } else {
            yield put(editProfileFailure(response));
        }
    } catch (error) {
        yield put(editProfileFailure(error));
    }
}

//Function for Get Profile By ID
function* getProfileByIDAPI() {
    const response = yield call(swaggerGetAPI,'api/Manage/userinfo',{},1);
    
    try {
        if(response.ReturnCode === 0) {
            yield put(getProfileByIDSuccess(response));
        } else {
            yield put(getProfileByIDFailure(response));
        }
    } catch (error) {
        yield put(getProfileByIDFailure(error));
    }
}

/* Create Sagas method for Edit Profile */
export function* editProfileSagas() {
    yield takeEvery(EDIT_PROFILE, editProfileAPI);
}

/* Create Sagas method for Get Profile By ID */
export function* getProfileByIDSagas() {
    yield takeEvery(GET_PROFILE_BY_ID, getProfileByIDAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(editProfileSagas),
        fork(getProfileByIDSagas),
    ]);
}