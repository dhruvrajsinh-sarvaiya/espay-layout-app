/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 28-12-2018
    UpdatedDate : 28-12-2018
    Description : For Region Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_REGIONS,
} from 'Actions/types';

//import function from action
import {
    getRegionsSuccess,
    getRegionsFailure,
} from 'Actions/Regions';


//Function check API call for Region List..
const getRegionsRequest = async () =>
    await api.get('/api/private/v1/regions/getallActiveregion')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Region List API
function* getRegionsAPI() {
    try {
        const response = yield call(getRegionsRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getRegionsSuccess(response.data.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getRegionsFailure(response.data));
        }
    } catch (error) {
        yield put(getRegionsFailure(error));
    }
}

// Get Regions
export function* getRegions() {
    yield takeEvery(GET_REGIONS, getRegionsAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getRegions),
    ]);
}