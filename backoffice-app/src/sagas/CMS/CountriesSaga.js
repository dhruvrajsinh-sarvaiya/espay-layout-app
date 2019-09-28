import {
    put, takeLatest, call
} from 'redux-saga/effects';

import {
    COUNTRIES_ADD,
    COUNTRIES_ADD_SUCCESS,
    COUNTRIES_ADD_FAILURE,

    COUNTRIES_DELETE,
    COUNTRIES_DELETE_FAILURE,
    COUNTRIES_DELETE_SUCCESS,

    COUNTRIES_FETCH,
    COUNTRIES_FETCH_FAILURE,
    COUNTRIES_FETCH_SUCCESS,

    COUNTRIES_UPDATE,
    COUNTRIES_UPDATE_FAILURE,
    COUNTRIES_UPDATE_SUCCESS,
    COUNTRIES_FILTER,

} from '../../actions/ActionTypes';
import { getFilterCountriesSuccess, getFilterCountriesFailure } from '../../actions/CMS/CountriesAction';


function* countriesFatchData() {
    try {

        const data = yield call(countriesFetchAPI)

        yield put({ type: COUNTRIES_FETCH_SUCCESS, data })

    } catch (e) {
        yield put({ type: COUNTRIES_FETCH_FAILURE, e })
    }
}

export function countriesFetchAPI() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "RESPTYPE": "COUNTRIES",
                "ReturnCode": 0, "ReturnMsg": "Success",
                "statusCode": 200, "countriesData": [
                    {
                        "id": '1',
                        "countryName": 'Australia', "countryCode": '+61',
                        "status": 'Active'
                    },
                    {
                        "id": '2',
                        "countryName": 'Brazil',
                        "countryCode": '+55',"status": 'Inactive'
                    },
                    {
                        "id": '3',
                        "countryName": 'China',
                        "countryCode": '+86',
                        "status": 'Active'
                    },
                    {
                        "id": '4',"countryName": 'Denmark',
                        "countryCode": '+45',
                        "status": 'Active'
                    },
                    {
                        "id": '5',
                        "countryName": 'Egypt',
                        "countryCode": '+20',
                        "status": 'Inactive'
                    },
                    {
                        "id": '6',
                        "countryName": 'France',"countryCode": '+33',"status": 'Active'
                    },
                    {
                        "id": '7',"countryName": 'Germany',
                        "countryCode": '+49', "status": 'Active'
                    },
                    {
                        "id": '8',
                        "countryName": 'Hungary',"countryCode": '+36',
                        "status": 'Inactive'
                    },
                    {
                        "id": '9', "countryName": 'India',
                        "countryCode": '+91',"status": 'Active'
                    },
                    {
                        "id": '10',"countryName": 'Japan',"countryCode": '+81',"status": 'Active'
                    }
                ]
            })
        }, 200)
    })
}
function* countriesDeleteData() {
    try {

        const data = yield call(countriesDeleteAPI)
        yield put({ type: COUNTRIES_DELETE_SUCCESS, data })

    } catch (e) {
        yield put({ type: COUNTRIES_DELETE_FAILURE, e })
    }
}

export function countriesDeleteAPI() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "RESPTYPE": "DELETECOUNTRIES",
                "statusCode": 200,"ReturnCode": 0,
                "ReturnMsg": "Delete Successfully",
            })
        }, 200)
    })
}

function* countriesAddData() {
    try {

        const data = yield call(countriesAddAPI)
        yield put({ type: COUNTRIES_ADD_SUCCESS, data })

    } catch (e) {
        yield put({ type: COUNTRIES_ADD_FAILURE, e })
    }
}

export function countriesAddAPI() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "RESPTYPE": "ADDCOUNTRIES", "ReturnCode": 0,
                "ReturnMsg": "Successfully Added",
                "statusCode": 200
            })
        }, 200)
    })
}

function* countriesUpdateData() {
    try {
        const data = yield call(countriesUpdateAPI)
        yield put({ type: COUNTRIES_UPDATE_SUCCESS, data })

    } catch (e) {
        yield put({ type: COUNTRIES_UPDATE_FAILURE, e })
    }
}

export function countriesUpdateAPI() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "RESPTYPE": "UPDATECOUNTRIES",
                "ReturnCode": 0,
                "ReturnMsg": "Successfully Update", "statusCode": 200
            })
        }, 200)
    })
}

function* CountriesFilterData() {
    try {
        const data = yield call(countriesFetchAPI)
        yield put(getFilterCountriesSuccess(data));
    } catch (e) {
        yield put(getFilterCountriesFailure(e))
    }
}

function* CountriesSaga() {
    yield takeLatest(COUNTRIES_FETCH, countriesFatchData)
    yield takeLatest(COUNTRIES_DELETE, countriesDeleteData)
    yield takeLatest(COUNTRIES_ADD, countriesAddData)
    yield takeLatest(COUNTRIES_UPDATE, countriesUpdateData)
    yield takeLatest(COUNTRIES_FILTER, CountriesFilterData)
}
export default CountriesSaga;
