/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 11-10-2018
    UpdatedDate : 27-10-2018
    Description : For SiteSetting Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import api from "Api";

import {
    GET_SITESETTINGINFO,
    POST_SITESETTINGINFO,
} from "Actions/types";

// import functions from action
import {
    getSiteSettingInfoSuccess,
    getSiteSettingInfoFailure,
    postSiteSettingInfoSuccess,
    postSiteSettingInfoFailure
} from "Actions/SiteSetting";

//Function check API call for Sitesetting Update..
const postSiteSettingInfoRequest = async (settingdata) =>
    await api.post('/api/private/v1/sitesetting/updateSiteSetting', settingdata)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// get sitesetting server request
const getSiteSettingInfoRequest = async (siteId) =>
    await api.get('/api/private/v1/sitesetting/getSiteSettingById/' + siteId)
        .then(response => response)
        .catch(error => error);

// post sitesetting data server request
function* postSiteSettingInfoAPI({ payload }) {
    const formData = new FormData();
    formData.append('logo', payload.image.logo);
    formData.append('fevicon', payload.image.fevicon);
    formData.append('data', JSON.stringify(payload));
    try {
        const response = yield call(postSiteSettingInfoRequest, formData);
        //validate if data found in response 
        if (response.data !== undefined && response.data.responseCode == 0) {
            yield put(postSiteSettingInfoSuccess(response.data));
        } else {
            yield put(postSiteSettingInfoFailure(response.data));
        }
    } catch (error) {
        yield put(postSiteSettingInfoFailure(error));
    }
}

//Function for SiteSetting Info  API
function* getSiteSettingInfoAPI({ payload }) {
    try {
        const response = yield call(getSiteSettingInfoRequest, payload);
        //validate if data found in response 
        if (typeof response.data.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getSiteSettingInfoSuccess(response.data.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(getSiteSettingInfoFailure(errorObject.response));
        }
    } catch (error) {
        yield put(getSiteSettingInfoFailure(error));
    }
}

// for post sitesetting data
function* postSiteSettingInfo() {
    yield takeEvery(POST_SITESETTINGINFO, postSiteSettingInfoAPI)
}

// Get SiteSetting Info
function* getSiteSettingInfo() {
    yield takeEvery(GET_SITESETTINGINFO, getSiteSettingInfoAPI)
}

export default function* rootSaga() {
    yield all([
        fork(getSiteSettingInfo),
        fork(postSiteSettingInfo)
    ]);
}