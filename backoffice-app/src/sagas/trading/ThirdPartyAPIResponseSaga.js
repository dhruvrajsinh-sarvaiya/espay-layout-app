import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
    GET_THIRD_PARTY_API_RESPONSE_LIST,
    GET_THIRD_PARTY_API_RESPONSE_BYID,
    ADD_THIRD_PARTY_API_RESPONSE,
    UPDATE_THIRD_PARTY_API_RESPONSE
} from '../../actions/ActionTypes';
import {
    getThirdPartyAPIResponseBOSuccess,
    getThirdPartyAPIResponseBOFailure,
    getThirdPartyAPIResponseByIDBOSuccess,
    getThirdPartyAPIResponseByIDBOFailure,
    addThirdPartyAPIResponseBOSuccess,
    addThirdPartyAPIResponseBOFailure,
    updateThirdpartyAPIResponseBOSuccess,
    updateThirdpartyAPIResponseBOFailure
} from '../../actions/Trading/ThirdPartyAPIResponseActions';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* thirdPartyAPIResponseBOSaga() {

    //For get third party response api
    yield takeEvery(GET_THIRD_PARTY_API_RESPONSE_LIST, getThirdPartyAPIResponse);

    //For get third party response api by id
    yield takeEvery(GET_THIRD_PARTY_API_RESPONSE_BYID, getThirdPartyAPIResponseByID);

    //For Add third party response api 
    yield takeEvery(ADD_THIRD_PARTY_API_RESPONSE, addThirdPartyAPIResponse);

    //For Update third party response api 
    yield takeEvery(UPDATE_THIRD_PARTY_API_RESPONSE, updateThirdPartyAPIResponse);
}

function* getThirdPartyAPIResponse() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call all third party api response list api
        const response = yield call(swaggerGetAPI, Method.GetAllThirdPartyAPIRespose, {}, headers);

        // To set all third party api response list success response to reducer
        yield put(getThirdPartyAPIResponseBOSuccess(response))
    } catch (e) {

        // To set all third party api response list failure response to reducer
        yield put(getThirdPartyAPIResponseBOFailure())
    }
}

function* getThirdPartyAPIResponseByID({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call third party api response by id api
        const response = yield call(swaggerGetAPI, Method.GetThirdPartyAPIResposeById + '/' + payload.Id, {}, headers);

        // To set third party api response by id success response to reducer
        yield put(getThirdPartyAPIResponseByIDBOSuccess(response))
    } catch (e) {

        // To set third party api response by id failure response to reducer
        yield put(getThirdPartyAPIResponseByIDBOFailure())
    }
}

function* addThirdPartyAPIResponse({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call third party api response add api
        const response = yield call(swaggerPostAPI, Method.AddThirdPartyAPIRespose, { ...payload }, headers);

        // To set third party api response add success response to reducer
        yield put(addThirdPartyAPIResponseBOSuccess(response))
    } catch (e) {

        // To set third party api response add failure response to reducer
        yield put(addThirdPartyAPIResponseBOFailure())
    }
}

function* updateThirdPartyAPIResponse({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call third party api response edit api
        const response = yield call(swaggerPostAPI, Method.UpdateThirdPartyAPIResponse, { ...payload }, headers);

        // To set third party api response edit success response to reducer
        yield put(updateThirdpartyAPIResponseBOSuccess(response))
    } catch (e) {

        // To set third party api response edit failure response to reducer
        yield put(updateThirdpartyAPIResponseBOFailure())
    }
}