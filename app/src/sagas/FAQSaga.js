import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';


//import action types
import {
    GET_FAQ,
    GET_FAQ_CATEGORIES,
    GET_FAQ_QUESTIONS,
} from '../actions/ActionTypes';

//import function from action
import {
    getFaqcategoriesSuccess,
    getFaqcategoriesFailure,
    getFaqquestionsSuccess,
    getFaqquestionsFailure,
    getFaqSuccess,
    getFaqFailure
} from '../actions/CMS/FAQsScreenAction';
import { userAccessToken } from '../selector';
import { WebPageUrlGetApi } from '../api/helper';
import { Method } from '../controllers/Constants';

//Function for Get Faq Category List API
function* getFaqCategoriesAPI() {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID };

        // To call FAQ Category Request api
        const response = yield call(WebPageUrlGetApi, Method.getActiveFaqCategory, {}, headers);

        // To set FQA Category List success response to reducer
        yield put(getFaqcategoriesSuccess(response.data));
    } catch (error) {
        // To set FQA Category List failure response to reducer
        yield put(getFaqcategoriesFailure(error));
    }
}

//Function for Get Faq Question List API
function* getFaqQuestionsAPI() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID };

        // To call FAQ Question Request api
        const response = yield call(WebPageUrlGetApi, Method.getActiveFaqQuestion, {}, headers);

        // To set FQA Question success response to reducer
        yield put(getFaqquestionsSuccess(response.data));
    } catch (error) {
        // To set FQA Question failure response to reducer
        yield put(getFaqquestionsFailure(error));
    }
}

function* getFaqFromServer() {
    try {
        // To call FAQ From Server Request api
        const response = yield call(WebPageUrlGetApi, 'faqs.js', {}, {});

        // To set FQA From Server success response to reducer
        yield put(getFaqSuccess(response.data));
    } catch (error) {
        // To set FQA From Server failure response to reducer
        yield put(getFaqFailure(error));
    }
}

// Get Faq Category
export function* getFaqcategories() {
    yield takeLatest(GET_FAQ_CATEGORIES, getFaqCategoriesAPI);
}

// Get Faq Questions
export function* getFaqquestions() {
    yield takeLatest(GET_FAQ_QUESTIONS, getFaqQuestionsAPI);
}

export function* getFaq() {
    yield takeLatest(GET_FAQ, getFaqFromServer);
}

export default function* rootSaga() {
    yield all([
        // To register getFaqcategories method
        fork(getFaqcategories),
        // To register getFaqquestions method
        fork(getFaqquestions),
        // To register getFaq method
        fork(getFaq)
    ]);
}