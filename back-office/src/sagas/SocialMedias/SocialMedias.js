/* 
    Created By : Megha Kariya
    Date : 12-02-2019
    Description : CMS Social Media saga file
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_SOCIAL_MEDIAS,
    ADD_NEW_SOCIAL_MEDIA,
    UPDATE_SOCIAL_MEDIA,
    
} from 'Actions/types';

//import function from action
import {
    getSocialMediasSuccess,
    getSocialMediasFailure,
    addNewSocialMediaSuccess,
    addNewSocialMediaFailure,
    updateSocialMediaSuccess,
    updateSocialMediaFailure,
   
} from 'Actions/SocialMedias';


//Function check API call for SocialMedia List..
const getSocialMediasRequest = async (mediatypeId) =>
    await api.get('/api/private/v1/socialMedia/getAllSocialMedia/'+mediatypeId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for SocialMedia Add..
const addNewSocialMediaRequest = async (mediaData) =>
    await api.post('/api/private/v1/socialMedia/addMedia', {mediaData})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for SocialMedia Edit..
const editSocialMediaRequest = async (mediaData) =>
    await api.put('/api/private/v1/socialMedia/editMedia', {mediaData})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));
 
//Function for SocialMedia List API
function* getSocialMediasAPI({payload}) {
    try {
        const response = yield call(getSocialMediasRequest,payload);
        
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getSocialMediasSuccess(response.data.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getSocialMediasFailure(response.data));
        }
    } catch (error) {
        yield put(getSocialMediasFailure(error));
    }
}

//Function for Add SocialMedia API
function* addNewSocialMediaAPI({payload}) {
    try {
        const response = yield call(addNewSocialMediaRequest, payload);
        
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(addNewSocialMediaSuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addNewSocialMediaFailure(response.data));
        }
    } catch (error) {
        yield put(addNewSocialMediaFailure(error));
    }
}

//Function for Update SocialMedia API
function* updateSocialMediaAPI({payload}) {
    try {
        const response = yield call(editSocialMediaRequest, payload); 
        
        if (response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(updateSocialMediaSuccess(response.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(updateSocialMediaFailure(response.data));
        }
    } catch (error) {
        yield put(updateSocialMediaFailure(error));
    }
}

// Get SocialMedias
export function* getSocialMedias() {
    yield takeEvery(GET_SOCIAL_MEDIAS, getSocialMediasAPI);
}

// add New SocialMedia 
export function* addNewSocialMedia() {
    yield takeEvery(ADD_NEW_SOCIAL_MEDIA, addNewSocialMediaAPI);
}

// Edit SocialMedia
export function* updateSocialMedia() {
    yield takeEvery(UPDATE_SOCIAL_MEDIA, updateSocialMediaAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getSocialMedias),
        fork(addNewSocialMedia),
        fork(updateSocialMedia),
    ]);
}