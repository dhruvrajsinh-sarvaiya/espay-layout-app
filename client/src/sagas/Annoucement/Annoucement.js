/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 18-09-2018
    Description : Annoucement Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    GET_ANNOUCEMENT,
} from 'Actions/types';

import {
    getAnnoucementsSuccess,
    getAnnoucementsFailure
} from 'Actions/Announcement';

//Function check API call for Announcement List..
const getAnnoucementRequest = async () =>
await api.get('/api/private/v1/news/getActiveAnnouncement')
    .then(response => response)
    .catch(error => error);

//Function for Get Annoucement List API
function* getAnnoucementAPI() {
    try 
    {
        const response = yield call(getAnnoucementRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getAnnoucementsSuccess(response.data.data));
        }else{
            yield put(getAnnoucementsFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getAnnoucementsFailure(error));
    }
}


//Get Annoucement
export function* getAnnoucements() {
    yield takeEvery(GET_ANNOUCEMENT, getAnnoucementAPI);
}

/**
 * Annoucement Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getAnnoucements)
    ]);
}