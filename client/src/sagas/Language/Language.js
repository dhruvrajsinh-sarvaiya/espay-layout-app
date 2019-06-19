/**
 * Language Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    GET_LANGUAGES,
} from 'Actions/types';

import {
    getLanguagesSuccess,
    getLanguagesFailure
} from 'Actions';

/**
 * Send Todos Request To Server
 */
const getLanguagesRequest = async () =>
    await api.get('/api/private/v1/languages/getActiveDefaultLanguages')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

/**
 * Get Todos From Server
 */
function* getLanguagesFromServer() {
    try {
        const response = yield call(getLanguagesRequest);
        
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getLanguagesSuccess(response.data));
        } else {
            yield put(getLanguagesFailure(response.data));
        }

    } catch (error) {
        yield put(getLanguagesFailure(error));
    }
}

/**
 * Ger Emails
 */
export function* getLanguages() {
    yield takeEvery(GET_LANGUAGES, getLanguagesFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getLanguages)
    ]);
}