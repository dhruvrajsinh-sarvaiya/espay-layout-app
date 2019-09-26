import {
    COUNTRIES_FETCH,
    COUNTRIES_FETCH_SUCCESS,
    COUNTRIES_FETCH_FAILURE,

    COUNTRIES_DELETE,
    COUNTRIES_DELETE_SUCCESS,
    COUNTRIES_DELETE_FAILURE,

    COUNTRIES_UPDATE,
    COUNTRIES_UPDATE_SUCCESS,
    COUNTRIES_UPDATE_FAILURE,

    COUNTRIES_ADD,
    COUNTRIES_ADD_SUCCESS,
    COUNTRIES_ADD_FAILURE,

    COUNTRIES_FILTER,
    COUNTRIES_FILTER_SUCCESS,
    COUNTRIES_FILTER_FAILURE,

    COUNTRIES_CLEAR_ADD,
    COUNTRIES_CLEAR_UPDATE,
    COUNTRIES_CLEAR_DELETE,
    COUNTRIES_CLEAR
    
} from '../ActionTypes'

export function countriesFatchData() {
    return {
        type: COUNTRIES_FETCH,
    }
}

export function countriesFatchDataSuccess(response) {
    return {
        type: COUNTRIES_FETCH_SUCCESS,
        payload: response
    }
}

export function countriesFatchDataFailure(error) {
    return {
        type: COUNTRIES_FETCH_FAILURE,
        payload: error
    }
}

export function countriesDeleteData() {
    return {
        type: COUNTRIES_DELETE,
    }
}
export function countriesDeleteDataSuccess(response) {
    return {
        type: COUNTRIES_DELETE_SUCCESS,
        payload: response
    }
}
export function countriesDeleteDataFailure(error) {
    return {
        type: COUNTRIES_DELETE_FAILURE,
        payload: error
    }
}

export function countriesAddData() {
    return {
        type: COUNTRIES_ADD,

    }
}
export function countriesAddDataSuccess(response) {
    return {
        type: COUNTRIES_ADD_SUCCESS,
        payload: response
    }
}
export function countriesAddDataFailure(error) {
    return {
        type: COUNTRIES_ADD_FAILURE,
        payload: error
    }
}

export function countriesUpdateData(data) {
    return {
        type: COUNTRIES_UPDATE,
        payload: data
    }
}
export function countriesUpdateDataSuccess(response) {
    return {
        type: COUNTRIES_UPDATE_SUCCESS,
        payload: response
    }
}
export function countriesUpdateDataFailure(error) {
    return {
        type: COUNTRIES_UPDATE_FAILURE,
        payload: error
    }
}

//Function for Countries filter Data Action
export const getFilterCountries = (data) => ({
    type: COUNTRIES_FILTER,
    payload: data
});

//Function for Get  Countries filter Data Action success
export const getFilterCountriesSuccess = (response) => ({
    type: COUNTRIES_FILTER_SUCCESS,
    payload: response
});
//Function for Get  Countries filter Data Action failure
export const getFilterCountriesFailure = (error) => ({
    type: COUNTRIES_FILTER_FAILURE,
    payload: error
});

//for clear add data
export const clearAdd = () => ({
    type: COUNTRIES_CLEAR_ADD,
});

//for clear update data
export const clearUpdate = () => ({
    type: COUNTRIES_CLEAR_UPDATE,
});

//for clear delete data
export const clearDelete = () => ({
    type: COUNTRIES_CLEAR_DELETE,
});

export const clearCountrisData = () => ({
    type: COUNTRIES_CLEAR,
});