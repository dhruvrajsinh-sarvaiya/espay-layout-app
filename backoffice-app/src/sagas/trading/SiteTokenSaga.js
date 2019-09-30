// sagas For Site Token Actions
// effects for redux-saga
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
// types for set actions and reducers
import {
    GET_SITE_TOKEN_LIST,
    ADD_SITE_TOKEN_LIST,
    UPDATE_SITE_TOKEN_LIST,
    GET_RATE_TYPE
} from "../../actions/ActionTypes";
// action sfor set data or response
import {
    getSiteTokenListSuccess,
    getSiteTokenListFailure,
    addSiteTokenSuccess,
    addSiteTokenFailure,
    updateSiteTokenSuccess,
    updateSiteTokenFailure,
    getRateTypeListSuccess,
    getRateTypeListFailure
} from "../../actions/Trading/SiteTokenAction";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";

// Sagas Function for get site token
function* getSiteTokenList() {
    yield takeEvery(GET_SITE_TOKEN_LIST, getSiteTokenListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenListDetail({ payload }) {

    // get request from payload
    const { request } = payload;

    try {
        // check for margin trading module
        var IsMargin = '';
        if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
            IsMargin += "?IsMargin=" + request.IsMargin;
        }

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call all site token api
        const response = yield call(swaggerGetAPI, Method.GetAllSiteToken + IsMargin, request, headers);

        // To set all site token success response to reducer
        yield put(getSiteTokenListSuccess(response));
    } catch (error) {

        // To set all site token failure response to reducer
        yield put(getSiteTokenListFailure(error));
    }
}

// Sagas Function for Add site token 
function* addSiteToken() {
    yield takeEvery(ADD_SITE_TOKEN_LIST, addSiteTokenDetail);
}

// Function for set response to data and Call Function for Api Call
function* addSiteTokenDetail({ payload }) {

    // get request from payload
    const { request } = payload;

    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add site token api
        const response = yield call(swaggerPostAPI, Method.AddSiteToken, request, headers);

        // To set add site token success response to reducer
        yield put(addSiteTokenSuccess(response));
    } catch (error) {

        // To set add site token failure response to reducer
        yield put(addSiteTokenFailure(error));
    }
}

// Sagas Function for Update site token 
function* updateSiteToken() {
    yield takeEvery(UPDATE_SITE_TOKEN_LIST, updateSiteTokenDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateSiteTokenDetail({ payload }) {

    // get request from payload
    const { request } = payload;
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call update site token api
        const response = yield call(swaggerPostAPI, Method.UpdateSiteToken, request, headers);

        // To set update site token success response to reducer
        yield put(updateSiteTokenSuccess(response));
    } catch (error) {

        // To set update site token failure response to reducer
        yield put(updateSiteTokenFailure(error));
    }
}

// Sagas Function for get Rate type 
function* getRateTypeList() {
    yield takeEvery(GET_RATE_TYPE, getRateTypeListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getRateTypeListDetail({ payload }) {

    //Get request from payload
    const { request } = payload;

    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call site token rate type api
        const response = yield call(swaggerGetAPI, Method.GetSiteTokenRateType, request, headers);

        // To set site token rate type success response to reducer
        yield put(getRateTypeListSuccess(response));
    } catch (error) {

        // To set site token rate type failure response to reducer
        yield put(getRateTypeListFailure(error));
    }
}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(getSiteTokenList),
        fork(addSiteToken),
        fork(updateSiteToken),
        fork(getRateTypeList),
    ]);
}
