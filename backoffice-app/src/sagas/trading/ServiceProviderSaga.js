/**
 * Saga File For Service Provider CRUD Opration 
 */
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    LIST_SERVICE_PROVIDER,
    ADD_SERVICE_PROVIDER,
    UPDATE_SERVICE_PROVIDER
} from "../../actions/ActionTypes";

// import functions from action
import {
    listServiceProviderSuccess,
    listServiceProviderFailure,
    addServiceProviderSuccess,
    addServiceProviderFailure,
    updateServiceProviderSuccess,
    updateServiceProviderFailure
} from "../../actions/Trading/ServiceProviderActions";
import { userAccessToken } from "../../selector";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { Method } from "../../controllers/Constants";

//Display List Of API Method 
function* listServiceProviderAPI() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call provider list api
        const response = yield call(swaggerGetAPI, Method.GetProviderList, {}, headers);

        // To set provider list success response to reducer
        yield put(listServiceProviderSuccess(response));
    } catch (error) {

        // To set provider list failure response to reducer
        yield put(listServiceProviderFailure(error));
    }
}

//Add Api Method Data
function* addServiceProviderAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add serivce provider api
        const response = yield call(swaggerPostAPI, Method.AddServiceProvider, payload, headers);

        // To set add serivce provider success response to reducer
        yield put(addServiceProviderSuccess(response));
    } catch (error) {

        // To set add serivce provider failure response to reducer
        yield put(addServiceProviderFailure(error));
    }
}

//Update Api Method
function* updateServiceProviderAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call update service provider api
        const response = yield call(swaggerPostAPI, Method.UpdateServiceProvider, payload, headers);

        // To set update service provider success response to reducer
        yield put(updateServiceProviderSuccess(response));
    } catch (error) {

        // To set update service provider failure response to reducer
        yield put(updateServiceProviderFailure(error));
    }
}

//call api's
function* listServiceProvider() {
    // To register List Service Provider method
    yield takeEvery(LIST_SERVICE_PROVIDER, listServiceProviderAPI);
}
function* addServiceProviderData() {
    // To register Add Service Provider method
    yield takeEvery(ADD_SERVICE_PROVIDER, addServiceProviderAPI);
}
function* updateServiceProviderData() {
    // To register Udpate Service Provider method
    yield takeEvery(UPDATE_SERVICE_PROVIDER, updateServiceProviderAPI);
}

//root sagaF
export default function* rootSaga() {
    yield all([
        fork(listServiceProvider),
        fork(addServiceProviderData),
        fork(updateServiceProviderData)
    ]);
}