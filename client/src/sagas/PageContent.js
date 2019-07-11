/**
 * Page Content Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    GET_PAGE_CONTENTS,
} from 'Actions/types';

import {
    getPageContentsSuccess,
    getPageContentsFailure
} from 'Actions';

/**
 * Send PAGE_CONTENTS Request To Server
 */
const getPageContentsRequest = async (pageId) =>
    await api.get('/api/private/v1/pages/'+pageId)
        .then(response => response)
        .catch(error => error);

/**
 * Get PAGE_CONTENTS From Server
 */
function* getPageContentsFromServer({ payload }) {
    try {
            const response = yield call(getPageContentsRequest, payload);
            
            yield put(getPageContentsSuccess(response));
        } catch (error) {
            yield put(getPageContentsFailure(error));
        }
}

/**
 * Get PageContent
 */
export function* getPageContents() {
    yield takeEvery(GET_PAGE_CONTENTS, getPageContentsFromServer);
}

/**
 * Page Content Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getPageContents)
    ]);
}