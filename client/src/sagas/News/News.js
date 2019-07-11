/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 18-10-2018
    Description : News Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_NEWS,
} from 'Actions/types';

//import function from action
import {
    getNewsSuccess,
    getNewsFailure
} from 'Actions/News';

//Function check API call for News List..
const getNewsRequest = async () =>
    await api.get('/api/private/v1/news/getActiveNews')
        .then(response => response)
        .catch(error => error);

//Function for Get News List API
function* getNewsAPI() {
    try 
    {
        const response = yield call(getNewsRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getNewsSuccess(response.data.data));
        }else{
            yield put(getNewsFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getNewsFailure(error));
    }
}

//Get News
export function* getNews() {
    yield takeEvery(GET_NEWS, getNewsAPI);
}

//News Root Saga
export default function* rootSaga() {
    yield all([
        fork(getNews)
    ]);
}