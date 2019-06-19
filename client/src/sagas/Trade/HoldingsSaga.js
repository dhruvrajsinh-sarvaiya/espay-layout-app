// sagas For Holding List Actions By Tejas Date : 14/9/2018

// for call api call or API Call
import api from 'Api';

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import { GET_HOLDING_LIST } from 'Actions/types';

// action sfor set data or response
import { getHoldingListSuccess, getHoldingListFailure } from 'Actions/Trade';

// Sagas Function for get Holdings list data by :Tejas Date : 14/9/2018
function* getHoldingList() {
    yield takeEvery(GET_HOLDING_LIST, getHoldingListData)
}

// Function for set response to data and Call Function for Api Call
function* getHoldingListData({payload}) {
    const { Pair } = payload;
   // console.log(Pair)
    try {
        const response = yield call(getHoldingListRequest,Pair)

        // set response if its available else set error message
        if (response && response != null && response != undefined) {
            yield put(getHoldingListSuccess(response))
        } else {
            yield put(getHoldingListFailure(error))
        }
    } catch (error) {
        yield put(getHoldingListFailure(error))
    }
}

// function for Call api and set response 
const getHoldingListRequest = async (holdingListRequest) =>
    await api.get('Holdinglist.js')
    //.then(console.log('API',holdingListRequest))   
        .then(response => response)
        .catch(error => error)


// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getHoldingList),
    ]);
}