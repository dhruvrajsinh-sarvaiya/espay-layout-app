
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { NEWSSECTION_FETCH } from '../actions/ActionTypes'
import { NewsSectionDataSuccess, NewsSectionDataFailure } from '../actions/CMS/NewsSectionAction';
import { WebPageUrlGetApi } from '../api/helper';
import { userAccessToken } from '../selector';

function* NewsSectionSaga() {
    // To register NewSectionFetchData method
    yield takeLatest(NEWSSECTION_FETCH, NewssectionFetchData)
}

function* NewssectionFetchData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token.replace('Bearer', 'JWT') };

        // To call New Section api
        const data = yield call(WebPageUrlGetApi, 'api/private/v1/news/getActiveNews', {}, headers);

        // To set New Section success response to reducer
        yield put(NewsSectionDataSuccess(data))
    } catch (e) {
        // To set New Section failure response to reducer
        yield put(NewsSectionDataFailure())
    }
}

export default NewsSectionSaga; 