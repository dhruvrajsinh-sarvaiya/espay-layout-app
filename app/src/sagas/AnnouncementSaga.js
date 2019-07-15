
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { ANNOUCEMENT_FETCH } from '../actions/ActionTypes';
import { announcementDataSuccess, announcementDataFailure } from '../actions/CMS/AnnouncementAction';
import { userAccessToken } from '../selector';
import { WebPageUrlGetApi } from '../api/helper';

//Function check API call for Announcement List..
function* AnnouncementSaga() {
    // To register AnnouncementFatchData method
    yield takeLatest(ANNOUCEMENT_FETCH, AnnouncementFatchData)
}

function* AnnouncementFatchData() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token.replace('Bearer', 'JWT') };

        // To call Announcement api
        const data = yield call(WebPageUrlGetApi, 'api/private/v1/news/getActiveAnnouncement', {}, headers)

        // To set Announcement success response to reducer
        yield put(announcementDataSuccess(data))
    } catch (e) {
        // To set Announcement failure response to reducer
        yield put(announcementDataFailure())
    }
}

export default AnnouncementSaga;