import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { GET_PAGE_CONTENTS, } from '../actions/ActionTypes';
import { getPageContentsSuccess, getPageContentsFailure } from '../actions/CMS/PageContentAppActions';
import { WebPageUrlGetApi } from '../api/helper';
import { userAccessToken } from '../selector';

// Generator for Page Content From Server
function* getPageContentsFromServer({ payload }) {
    try {

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID };

        // To call Page Content From Server api
        const response = yield call(WebPageUrlGetApi, 'api/private/v1/pages/' + payload, {}, headers);

        // To set Page Content success response to reducer
        yield put(getPageContentsSuccess(response));
    } catch (error) {
        // To set Page Content failure response to reducer
        yield put(getPageContentsFailure(error));
    }
}

export function* getPageContents() {
    yield takeEvery(GET_PAGE_CONTENTS, getPageContentsFromServer);
}

export default function* rootSaga() {
    // To register getPageContents method
    yield all([fork(getPageContents)]);
}