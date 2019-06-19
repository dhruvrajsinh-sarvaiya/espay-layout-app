/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : For Get Faq Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_FAQ,
    GET_FAQ_CATEGORIES,
    GET_FAQ_QUESTIONS,
} from 'Actions/types';

//import function from action
import {
    getFaqcategoriesSuccess,
    getFaqcategoriesFailure,
    getFaqquestionsSuccess,
    getFaqquestionsFailure,
    getFaqSuccess,
    getFaqFailure
} from 'Actions/Faq';

//Function check API call for Faq Category List..
const getFaqCategoryRequest = async () =>
await api.get('/api/private/v1/faqcategory/getActiveFaqCategory')
    .then(response => response)
    .catch(error => error);

//Function check API call for Faq Question List..
const getFaqQuestionRequest = async () =>
await api.get('/api/private/v1/faqquestion/getActiveFaqQuestion')
    .then(response => response)
    .catch(error => error);

/**
 * Send Faq Request To Server
 */
const getFaqRequest = async () =>
    await api.get('faqs.js')
        .then(response => response.data)
        .catch(error => error);


//Function for Get Faq Category List API
function* getFaqCategoriesAPI() {
    try {
        const response = yield call(getFaqCategoryRequest);
        //console.log("API Category",response);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getFaqcategoriesSuccess(response.data.data));
        }else{
            yield put(getFaqcategoriesFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getFaqcategoriesFailure(error));
    }
}

//Function for Get Faq Question List API
function* getFaqQuestionsAPI() {
    try {
        const response = yield call(getFaqQuestionRequest);
    
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getFaqquestionsSuccess(response.data.data));
        }else{
            yield put(getFaqquestionsFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getFaqquestionsFailure(error));
    }
}

/**
 * Get Faq data From Server
 */
function* getFaqFromServer() {
    try {
        const response = yield call(getFaqRequest);
        //console.log("responsefaq",response);
        yield put(getFaqSuccess(response));
    } catch (error) {
        yield put(getFaqFailure(error));
    }
}

// Get Faq Category
export function* getFaqcategories() {
    yield takeEvery(GET_FAQ_CATEGORIES, getFaqCategoriesAPI);
}

// Get Faq Questions
export function* getFaqquestions() {
    yield takeEvery(GET_FAQ_QUESTIONS, getFaqQuestionsAPI);
}

/**
 * Get Faq
 */
export function* getFaq() {
    //console.log("faqtest");
    yield takeEvery(GET_FAQ, getFaqFromServer);
}

/**
 * Faq Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getFaqcategories),
        fork(getFaqquestions),
        fork(getFaq)
    ]);
}