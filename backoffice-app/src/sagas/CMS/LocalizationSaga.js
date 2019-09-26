import { call, put, takeEvery, select } from "redux-saga/effects";
import { WebPageUrlGetApi, WebPageUrlPostAPI, WebPageUrlPutAPI } from "../../api/helper";
import {
    LIST_COUNTRY, ADD_COUNTRY, EDIT_COUNTRY, ACTIVE_LANGAUGES,
    LIST_STATE, ADD_STATE, EDIT_STATE,
    LIST_CITY, ADD_CITY, EDIT_CITY, GET_STATE_BY_COUNTRY_ID, LIST_ZIP_CODE, ADD_ZIP_CODE, EDIT_ZIP_CODE, GET_CITY_BY_STATE_ID
} from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import {
    getListCountryApiSuccess, getListCountryApiFailure, addCountryApiFailure,
    editCountryApiSuccess, editCountryApiFailure, addCountryApiSuccess, getActiveLangaugesSuccess, getActiveLangaugesFailure,
    getListStateApiSuccess, getListStateApiFailure,
    addStateApiSuccess, addStateApiFailure, editStateApiSuccess, editStateApiFailure, getListCityApiSuccess, getListCityApiFailure, addCityApiSuccess, addCityApiFailure, editCityApiSuccess, editCityApiFailure, getStateByCountryIdApiSuccess, getStateByCountryIdApiFailure, getListZipcodeApiSuccess, getListZipcodeApiFailure, addZipCodeApiSuccess, addZipCodeApiFailure, editZipCodeApiSuccess, editZipCodeApiFailure, getCityByStateIdApiSuccess, getCityByStateIdApiFailure
} from "../../actions/CMS/LocalizationActions";

//call Apis
export default function* LocalizationSaga() {
    // To register country list method
    yield takeEvery(LIST_COUNTRY, getCountryListApiData);
    // To register country add method
    yield takeEvery(ADD_COUNTRY, addCountryApiData);
    // To register country edit method
    yield takeEvery(EDIT_COUNTRY, editCountryApiData);
    // To register active language method
    yield takeEvery(ACTIVE_LANGAUGES, getActiveLanguagesConfigApiData);

    // To register state method
    yield takeEvery(LIST_STATE, getStateApiData);
    // To register state add method
    yield takeEvery(ADD_STATE, addStateApiData);
    // To register state edit method
    yield takeEvery(EDIT_STATE, editStateApiData);

    // To register city method
    yield takeEvery(LIST_CITY, getCityListApiData);
    // To register city add method
    yield takeEvery(ADD_CITY, addCityApiData);
    // To register city edit method
    yield takeEvery(EDIT_CITY, editCityApiData);
    // To register city edit method
    yield takeEvery(GET_STATE_BY_COUNTRY_ID, getStateByCountryIdApiData);

    // To register zip code method
    yield takeEvery(LIST_ZIP_CODE, getZipCodeListApiData);
    // To register zip code add method
    yield takeEvery(ADD_ZIP_CODE, addZipCodeApiData);
    // To register zip code edit method
    yield takeEvery(EDIT_ZIP_CODE, editZipCodeApiData);
    // To register zip code edit method
    yield takeEvery(GET_CITY_BY_STATE_ID, getCityByStateIdApiData);
}

// Generator for country list
function* getCountryListApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        let url
        if (payload.all)
            url = Method.listCountry + '/' + payload.all
        else
            url = Method.listCountry + '/' + payload.PageIndex + '/' + payload.PageSize + '/' + null + '/' + 'countryName' + '/' + 1

        // To call country list Api
        const response = yield call(WebPageUrlGetApi, url, {}, headers);

        // To set country list success response to reducer
        yield put(getListCountryApiSuccess(response));
    } catch (error) {
        // To set country list failure response to reducer
        yield put(getListCountryApiFailure(error));
    }
}

// Generator for country add
function* addCountryApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call country add Api
        const response = yield call(WebPageUrlPostAPI, Method.addCountry, payload, headers);

        // To set country add success response to reducer
        yield put(addCountryApiSuccess(response));
    } catch (error) {
        // To set country add failure response to reducer
        yield put(addCountryApiFailure(error));
    }
}

// Generator for country edit
function* editCountryApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call country edit Api
        const response = yield call(WebPageUrlPutAPI, Method.updateCountry, payload, headers);

        // To set country edit success response to reducer
        yield put(editCountryApiSuccess(response));
    } catch (error) {
        // To set country edit failure response to reducer
        yield put(editCountryApiFailure(error));
    }
}

// Generator for country edit
function* getActiveLanguagesConfigApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call country edit Api
        const response = yield call(WebPageUrlGetApi, Method.getActiveLanguagesConfig, {}, headers);

        // To set country edit success response to reducer
        yield put(getActiveLangaugesSuccess(response));
    } catch (error) {
        // To set country edit failure response to reducer
        yield put(getActiveLangaugesFailure(error));
    }
}

// Generator for country list
function* getStateApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        let url = Method.listState + '/' + payload.PageIndex + '/' + payload.PageSize + '/' + null + '/' + 'stateId' + '/' + 1

        // To call state list Api
        const response = yield call(WebPageUrlGetApi, url, {}, headers);

        // To set state list success response to reducer
        yield put(getListStateApiSuccess(response));
    } catch (error) {
        // To set state list failure response to reducer
        yield put(getListStateApiFailure(error));
    }
}

// Generator for country add
function* addStateApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call state add Api
        const response = yield call(WebPageUrlPostAPI, Method.addState, payload, headers);

        // To set state add success response to reducer
        yield put(addStateApiSuccess(response));
    } catch (error) {
        // To set state add failure response to reducer
        yield put(addStateApiFailure(error));
    }
}

// Generator for state edit
function* editStateApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call state edit Api
        const response = yield call(WebPageUrlPutAPI, Method.updateState, payload, headers);

        // To set state edit success response to reducer
        yield put(editStateApiSuccess(response));
    } catch (error) {
        // To set state edit failure response to reducer
        yield put(editStateApiFailure(error));
    }
}

// Generator for city list
function* getCityListApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        let url
        if (payload.all)
            url = Method.listCity + '/' + payload.all
        else
            url = Method.listCity + '/' + payload.PageIndex + '/' + payload.PageSize + '/' + null + '/' + 'cityId' + '/' + 1

        // To call city list Api
        const response = yield call(WebPageUrlGetApi, url, {}, headers);

        // To set city list success response to reducer
        yield put(getListCityApiSuccess(response));
    } catch (error) {
        // To set city list failure response to reducer
        yield put(getListCityApiFailure(error));
    }
}

// Generator for city add
function* addCityApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call city add Api
        const response = yield call(WebPageUrlPostAPI, Method.addCity, payload, headers);

        // To set city add success response to reducer
        yield put(addCityApiSuccess(response));
    } catch (error) {
        // To set city add failure response to reducer
        yield put(addCityApiFailure(error));
    }
}

// Generator for city edit
function* editCityApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call city edit Api
        const response = yield call(WebPageUrlPutAPI, Method.updateCity, payload, headers);

        // To set city edit success response to reducer
        yield put(editCityApiSuccess(response));
    } catch (error) {
        // To set city edit failure response to reducer
        yield put(editCityApiFailure(error));
    }
}

// Generator for state by country id list
function* getStateByCountryIdApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call state by country id list Api
        const response = yield call(WebPageUrlGetApi, Method.getStateByCountryId + '/' + payload.countryId, {}, headers);

        // To set state by country id list success response to reducer
        yield put(getStateByCountryIdApiSuccess(response));
    } catch (error) {
        // To set state by country id list failure response to reducer
        yield put(getStateByCountryIdApiFailure(error));
    }
}

// Generator for city list
function* getZipCodeListApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        let url
        if (payload.all)
            url = Method.listZipcodes + '/' + payload.all
        else
            url = Method.listZipcodes + '/' + payload.PageIndex + '/' + payload.PageSize + '/' + null + '/' + 'zipcodesId' + '/' + 1

        // To call city list Api
        const response = yield call(WebPageUrlGetApi, url, {}, headers);

        // To set city list success response to reducer
        yield put(getListZipcodeApiSuccess(response));
    } catch (error) {
        // To set city list failure response to reducer
        yield put(getListZipcodeApiFailure(error));
    }
}

// Generator for city add
function* addZipCodeApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call city add Api
        const response = yield call(WebPageUrlPostAPI, Method.addZipcode, payload, headers);

        // To set city add success response to reducer
        yield put(addZipCodeApiSuccess(response));
    } catch (error) {
        // To set city add failure response to reducer
        yield put(addZipCodeApiFailure(error));
    }
}

// Generator for city edit
function* editZipCodeApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call city edit Api
        const response = yield call(WebPageUrlPutAPI, Method.updateZipcode, payload, headers);

        // To set city edit success response to reducer
        yield put(editZipCodeApiSuccess(response));
    } catch (error) {
        // To set city edit failure response to reducer
        yield put(editZipCodeApiFailure(error));
    }
}

// Generator for city by state id list
function* getCityByStateIdApiData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call city by state id list Api
        const response = yield call(WebPageUrlGetApi, Method.getCityByStateId + '/' + payload.stateId, {}, headers);

        // To set city by state id list success response to reducer
        yield put(getCityByStateIdApiSuccess(response));
    } catch (error) {
        // To set city by state id list failure response to reducer
        yield put(getCityByStateIdApiFailure(error));
    }
}




