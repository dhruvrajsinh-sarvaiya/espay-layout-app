/**
 * Create By Sanjay 
 * Created Date 30--05--2019
 * Saga File Image Sliders 
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import api from "Api";

import {

    GET_IMAGESLIDERS,
    ADD_IMAGE_SLIDER,
    EDIT_IMAGE_SLIDER

} from "Actions/types";

import {
    getImageSlidersSuccess,
    getImageSlidersFailure,
    addImageSlidersSuccess,
    addImageSlidersFailure,
    editImageSlidersSuccess,
    editImageSlidersFailure
} from "Actions/ImageSliders";

//Function check API call for ImageSliders List..
const getImageSlidersRequest = async () =>
    await api.get('/api/private/v1/imageSliders')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for ImageSliders Add..
const addImageSliderRequest = async (imageSliderData) =>
    await api.post('/api/private/v1/imageSliders/addImageSlider', imageSliderData)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for ImageSlider Edit..
const editImageSliderRequest = async (imageSliderData) =>
    await api.put('/api/private/v1/imageSliders/editImageSlider', imageSliderData)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Get ImageSliders List API
function* getImageSlidersAPI() {
    try {
        const response = yield call(getImageSlidersRequest);
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(getImageSlidersSuccess(response.data));
        } else {
            yield put(getImageSlidersFailure(response.data));
        }
    } catch (error) {
        yield put(getImageSlidersFailure(error));
    }
}

//Function for Add ImageSliders API
function* addImageSliderAPI({ payload }) {
    const formData = new FormData();
    payload.imageslist.map((lst, key) => {
        return formData.append(`Image${key}`, lst.image);
    })
    formData.append('data', JSON.stringify(payload));
    try {
        const response = yield call(addImageSliderRequest, formData);
        if (response.data !== undefined && response.data.responseCode === 0) {
            yield put(addImageSlidersSuccess(response.data));
        }
        else {
            yield put(addImageSlidersFailure(response.data));
        }
    } catch (error) {
        yield put(addImageSlidersFailure(error));
    }
}

//Function for Update ImageSliders API
function* updateImageSliderAPI({ payload }) {
    const formData = new FormData();
    payload.imageslist.map((lst, key) => {
        return formData.append(`Image${key}`, lst.image);
    })
    formData.append('data', JSON.stringify(payload));
    try {
        const response = yield call(editImageSliderRequest, formData);        
        if (response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(editImageSlidersSuccess(response.data));
        } else {
            yield put(editImageSlidersFailure(response.data));
        }
    } catch (error) {
        yield put(editImageSlidersFailure(error));
    }
}

export function* getImageSliders() {
    yield takeEvery(GET_IMAGESLIDERS, getImageSlidersAPI);
}

export function* addImageSlider() {
    yield takeEvery(ADD_IMAGE_SLIDER, addImageSliderAPI);
}

export function* updateImageSlider() {
    yield takeEvery(EDIT_IMAGE_SLIDER, updateImageSliderAPI);
}

//ImageSliders Root Saga
export default function* rootSaga() {
    yield all([
        fork(getImageSliders),
        fork(addImageSlider),
        fork(updateImageSlider)
    ]);
}