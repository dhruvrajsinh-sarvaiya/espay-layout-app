/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 24-09-2018
    UpdatedDate : 20-10-2018
    Description : For Get Faq Category Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_FAQ_CATEGORIES,
    ADD_FAQ_CATEGORY,
    UPDATE_FAQ_CATEGORY,
    GET_FAQ_CATEGORY_BY_ID,
    DELETE_FAQ_CATEGORY,
} from 'Actions/types';

//import function from action
import {
    getFaqcategoriesSuccess,
    getFaqcategoriesFailure,
    addFaqCategorySuccess,
    addFaqCategoryFailure,
    updateFaqCategorySuccess,
    updateFaqCategoryFailure,
    deleteFaqCategorySuccess,
    deleteFaqCategoryFailure,
    getFaqCategoryByIdSuccess,
    getFaqCategoryByIdFailure
} from 'Actions/Faq';

//Function check API call for Faq Category List..
const getFaqCategoryRequest = async () =>
    await api.get('/api/private/v1/faqcategory')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Faq Category Add..
const addFaqCategoryRequest = async (faqcategorydata) =>
    await api.post('/api/private/v1/faqcategory/addFaqCategory', { faqcategorydata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Faq Category Edit..
const editFaqCategoryRequest = async (faqcategorydata) =>
    await api.put('/api/private/v1/faqcategory/editFaqCategory', { faqcategorydata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Faq Category By Id..
const getFaqCategoryByIdRequest = async (faqcategoryid) =>
    await api.get('/api/private/v1/faqcategory/getFaqCategoryById/' + faqcategoryid)
        .then(response => response)
        .catch(error => error);

// Function check API call for Delete Faq Category By Id..
const deleteFaqCategoryRequest = async (faqcategoryid) =>
    await api.delete('/api/private/v1/faqcategory/deleteFaqCategory/' + faqcategoryid)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function for Get Faq Category List API
function* getFaqCategoriesAPI() {
    try {
        const response = yield call(getFaqCategoryRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getFaqcategoriesSuccess(response.data.data));
        } else {
            yield put(getFaqcategoriesFailure(response.data));
        }
    } catch (error) {
        yield put(getFaqcategoriesFailure(error));
    }
}

//Function for Add Faq Categoery API
function* addFaqCategoryAPI({ payload }) {
    try {
        const response = yield call(addFaqCategoryRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(addFaqCategorySuccess(response.data));
        }
        else {
            yield put(addFaqCategoryFailure(response.data));
        }
    } catch (error) {
        yield put(addFaqCategoryFailure(error));
    }
}

//Function for Update Faq Categoery API
function* updateFaqCategoryAPI({ payload }) {
    try {
        const response = yield call(editFaqCategoryRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateFaqCategorySuccess(response.data));
        } else {
            yield put(updateFaqCategoryFailure(response.data));
        }
    } catch (error) {
        yield put(updateFaqCategoryFailure(error));
    }
}


//Function for Get Faq Category By ID API
function* getFaqCategoryByIdAPI({ payload }) {
    try {
        const response = yield call(getFaqCategoryByIdRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getFaqCategoryByIdSuccess(response.data.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(getFaqCategoryByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getFaqCategoryByIdFailure(error));
    }
}


//Function for Delete FaqCategory API
function* deleteFaqCategoryAPI({ payload }) {
    try {
        const response = yield call(deleteFaqCategoryRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(deleteFaqCategorySuccess(response.data));
        } else {
            yield put(deleteFaqCategoryFailure(response.data));
        }
    } catch (error) {
        yield put(deleteFaqCategoryFailure(error));
    }
}

// Get Faq Category
export function* getFaqcategories() {
    yield takeEvery(GET_FAQ_CATEGORIES, getFaqCategoriesAPI);
}

// add Faq Category
export function* addFaqCategory() {
    yield takeEvery(ADD_FAQ_CATEGORY, addFaqCategoryAPI);
}

// Edit Faq Category
export function* updateFaqCategory() {
    yield takeEvery(UPDATE_FAQ_CATEGORY, updateFaqCategoryAPI);
}

// Edit Faq Category by Id
export function* getFaqCategoryById() {
    yield takeEvery(GET_FAQ_CATEGORY_BY_ID, getFaqCategoryByIdAPI);
}

// Delete Faq Category by Id
export function* deleteFaqCategory() {
    yield takeEvery(DELETE_FAQ_CATEGORY, deleteFaqCategoryAPI);
}

// Faq Root Saga
export default function* rootSaga() {
    yield all([
        fork(getFaqcategories),
        fork(addFaqCategory),
        fork(updateFaqCategory),
        fork(getFaqCategoryById),
        fork(deleteFaqCategory)
    ]);
}