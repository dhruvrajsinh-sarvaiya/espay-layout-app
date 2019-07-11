/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : For Region Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_REGIONS,
    ADD_NEW_REGION,
    UPDATE_REGION,
    GET_REGION_BY_ID
} from 'Actions/types';

//import function from action
import {
    getRegionsSuccess,
    getRegionsFailure,
    addNewRegionSuccess,
    addNewRegionFailure,
    updateRegionSuccess,
    updateRegionFailure,
    getRegionByIdSuccess,
    getRegionByIdFailure,
} from 'Actions/Regions';


//Function check API call for Region List..
const getRegionsRequest = async () =>
    await api.get('/api/private/v1/regions')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Region Add..
const addNewRegionRequest = async (regiondata) =>
    await api.post('/api/private/v1/regions/addRegion', {regiondata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Region Edit..
const editRegionRequest = async (regiondata) =>
    await api.put('/api/private/v1/regions/editRegion', {regiondata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Region By Id..
const getRegionByIdRequest = async (regionId) =>
await api.get('/api/private/v1/regions/getregionbyid/'+regionId)
    .then(response => response)
    .catch(error => error);
        
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

//Function for Add Region API
function* addNewRegionAPI({payload}) {
    try {
        const response = yield call(addNewRegionRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(addNewRegionSuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addNewRegionFailure(response.data));
        }
    } catch (error) {
        yield put(addNewRegionFailure(error));
    }
}

//Function for Update Region API
function* updateRegionPI({payload}) {
    try {
        const response = yield call(editRegionRequest, payload); 
        if (response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(updateRegionSuccess(response.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(updateRegionFailure(response.data));
        }
    } catch (error) {
        yield put(updateRegionFailure(error));
    }
}

//Function for Get Region By ID API
function* getRegionByIdAPI({ payload }) {
    try {
        const response = yield call(getRegionByIdRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(getRegionByIdSuccess(response.data.data));
        }else {
            let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getRegionByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getRegionByIdFailure(error));
    }
}

// Get Regions
export function* getRegions() {
    yield takeEvery(GET_REGIONS, getRegionsAPI);
}

// add New Region 
export function* addNewRegion() {
    yield takeEvery(ADD_NEW_REGION, addNewRegionAPI);
}

// Edit Region
export function* updateRegion() {
    yield takeEvery(UPDATE_REGION, updateRegionPI);
}

//Edit Region by Id
export function* getRegionById() {
    yield takeEvery(GET_REGION_BY_ID, getRegionByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getRegions),
        fork(addNewRegion),
        fork(updateRegion),
        fork(getRegionById),
    ]);
}