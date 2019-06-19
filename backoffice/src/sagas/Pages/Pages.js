/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 03-10-2018
    UpdatedDate : 09-10-2018
    Description : For Pages Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_PAGES,
    ADD_NEW_PAGE,
    UPDATE_PAGE,
    GET_PAGE_BY_ID
} from 'Actions/types';

//import function from action
import {
    getPagesSuccess,
    getPagesFailure,
    addNewPageSuccess,
    addNewPageFailure,
    updatePageSuccess,
    updatePageFailure,
    getPageByIdSuccess,
    getPageByIdFailure,
} from 'Actions/Pages';


//Function check API call for Page List..
const getPagesRequest = async (pagetypeId) =>
    await api.get('/api/private/v1/pages/getallpages/'+pagetypeId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Page Add..
const addNewPageRequest = async (pagedata) =>
    await api.post('/api/private/v1/pages/addPage', {pagedata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Page Edit..
const editPageRequest = async (pagedata) =>
    await api.put('/api/private/v1/pages/editPage', {pagedata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Page By Id..
const getPageByIdRequest = async (pageId) =>
await api.get('/api/private/v1/pages/getpagebyid/'+pageId)
    .then(response => response)
    .catch(error => error);
        
//Function for Page List API
function* getPagesAPI({payload}) {
    try {
        const response = yield call(getPagesRequest,payload);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getPagesSuccess(response.data.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getPagesFailure(response.data));
        }
    } catch (error) {
        yield put(getPagesFailure(error));
    }
}

//Function for Add Page API
function* addNewPageAPI({payload}) {
    try {
        const response = yield call(addNewPageRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(addNewPageSuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addNewPageFailure(response.data));
        }
    } catch (error) {
        yield put(addNewPageFailure(error));
    }
}

//Function for Update Page API
function* updatePageAPI({payload}) {
    try {
        const response = yield call(editPageRequest, payload); 
        if (response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(updatePageSuccess(response.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(updatePageFailure(response.data));
        }
    } catch (error) {
        yield put(updatePageFailure(error));
    }
}

//Function for Get Page By ID API
function* getPageByIdAPI({ payload }) {
    try {
        const response = yield call(getPageByIdRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(getPageByIdSuccess(response.data.data));
        }else {
            let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getPageByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getPageByIdFailure(error));
    }
}

// Get Pages
export function* getPages() {
    yield takeEvery(GET_PAGES, getPagesAPI);
}

// add New page 
export function* addNewPage() {
    yield takeEvery(ADD_NEW_PAGE, addNewPageAPI);
}

// Edit Page
export function* updatePage() {
    yield takeEvery(UPDATE_PAGE, updatePageAPI);
}

//Edit Page by Id
export function* getPageById() {
    yield takeEvery(GET_PAGE_BY_ID, getPageByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getPages),
        fork(addNewPage),
        fork(updatePage),
        fork(getPageById),
    ]);
}