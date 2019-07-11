/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * API Setting Sagas
 */

//Sagas Effects..
import { all, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    API_SETTING_CREATE,
    API_SETTING_SAVE,
    API_SETTING_EDIT,
    API_SETTING_DELETE
} from 'Actions/types';

//Action methods..
import {
    apiSettingCreateSuccess,
    apiSettingCreateFailure,
    apiSettingSaveSuccess,
    apiSettingSaveFailure,
    apiSettingEditSuccess,
    apiSettingEditFailure,
    apiSettingDeleteSuccess,
    apiSettingDeleteFailure
} from 'Actions/MyAccount';

const response = {
    status: 200,
    new_api_key: 'Done',
    message: 'Data not found'
};

const response1 = {
    status: 200,
    new_api_key: 'Done',
    message: 'Data not found'
};

//Function for API Setting Create
function* apiSettingCreateAPI({ payload }) {
    try {
        if (response.status === 200) {
            yield put(apiSettingCreateSuccess(response.new_api_key));
        } else {
            yield put(apiSettingCreateFailure(response.message));
        }
    } catch (error) {
        yield put(apiSettingCreateFailure(error));
    }
}

//Function for API Setting Save
function* apiSettingSaveAPI({ payload }) {
    try {
        if (response1.status === 200) {
            yield put(apiSettingSaveSuccess(response1));
        } else {
            yield put(apiSettingSaveFailure(response1.message));
        }
    } catch (error) {
        yield put(apiSettingSaveFailure(error));
    }
}

//Function for API Setting Edit
function* apiSettingEditAPI({ payload }) {
    try {
        if (response1.status === 200) {
            yield put(apiSettingEditSuccess(response1));
        } else {
            yield put(apiSettingEditFailure(response1.message));
        }
    } catch (error) {
        yield put(apiSettingEditFailure(error));
    }
}

//Function for API Setting Delete
function* apiSettingDeleteAPI({ payload }) {
    try {
        if (response1.status === 200) {
            yield put(apiSettingDeleteSuccess(response1));
        } else {
            yield put(apiSettingDeleteFailure(response1.message));
        }
    } catch (error) {
        yield put(apiSettingDeleteFailure(error));
    }
}

/* Create Sagas method for apiSettingCreate */
export function* apiSettingCreateSagas() {
    yield takeEvery(API_SETTING_CREATE, apiSettingCreateAPI);
}

/* Create Sagas method for apiSettingSave */
export function* apiSettingSaveSagas() {
    yield takeEvery(API_SETTING_SAVE, apiSettingSaveAPI);
}

/* Create Sagas method for apiSettingEdit */
export function* apiSettingEditSagas() {
    yield takeEvery(API_SETTING_EDIT, apiSettingEditAPI);
}

/* Create Sagas method for apiSettingDelete */
export function* apiSettingDeleteSagas() {
    yield takeEvery(API_SETTING_DELETE, apiSettingDeleteAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(apiSettingCreateSagas),
        fork(apiSettingSaveSagas),
        fork(apiSettingEditSagas),
        fork(apiSettingDeleteSagas)
    ]);
}
