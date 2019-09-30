//  Language Sagas
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { GET_LANGUAGES, SET_LANGUAGES } from '../../actions/ActionTypes';

import {
    getLanguagesSuccess, getLanguagesFailure,
    setLanguagesSuccess, setLanguagesFailure
} from '../../actions/CMS/AppSettingsActions';
import { Method } from '../../controllers/Methods';
import { WebPageUrlGetApi, swaggerPostAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';

// Get Todos From Server
function* getLanguagesFromServer() {
    try {

        // to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call Get Language Data Api
        const response = yield call(WebPageUrlGetApi, Method.getActiveDefaultLanguages, {}, headers);

        // To set Get Language success response to reducer
        yield put(getLanguagesSuccess(response));
    } catch (error) {
        // To set Get Language failure response to reducer
        yield put(getLanguagesFailure(error));
    }
}

function* languageSetup(action) {
    try {
        let preferedLanguage = action.payload.preferedLanguage

        // to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Language Setup Data Api
        const response = yield call(swaggerPostAPI, Method.UpdateLanguagePreference + '/' + preferedLanguage, {}, headers);

        // To set Language success response to reducer
        yield put(setLanguagesSuccess(response));
    } catch (error) {
        // To set Language failure response to reducer
        yield put(setLanguagesFailure(error));
    }
}

// Get Language
export function* getLanguages() {
    yield takeLatest(GET_LANGUAGES, getLanguagesFromServer);
}

// Set Language
export function* setLanguages() {
    yield takeLatest(SET_LANGUAGES, languageSetup);
}

// Email Root Saga
export default function* rootSaga() {
    yield all([
        fork(getLanguages),
        fork(setLanguages),
    ]);
}