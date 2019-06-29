/* 
    Created By : Megha Kariya
    Date : 13-02-2019
    Description : Social Media Saga file 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
// api
import api from 'Api';
//import action types
import {
    GET_SOCIAL_MEDIA_DETAIL,
} from 'Actions/types';

//import function from action
import {
    getSocialMediaSuccess,
    getSocialMediaFailure
} from 'Actions/SocialMedia';

//Function check API call for Social Media List..
const getSocialMediaRequest = async (mediatypeId) =>
    await api.get('/api/private/v1/socialMedia/getAllSocialMedia/'+mediatypeId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Get Social Media List API
function* getSocialMediaAPI({payload}) {
    try 
    {
        const response = yield call(getSocialMediaRequest,payload);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getSocialMediaSuccess(response.data.data));
        }else{
            yield put(getSocialMediaFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getSocialMediaFailure(error));
    }
}

//Get Social Media
export function* getSocialMedia() {
    yield takeEvery(GET_SOCIAL_MEDIA_DETAIL, getSocialMediaAPI);
}

//Social Media Root Saga
export default function* rootSaga() {
    yield all([
        fork(getSocialMedia)
    ]);
}