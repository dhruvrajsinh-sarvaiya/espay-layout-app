import {
    //country list
    LIST_COUNTRY,
    LIST_COUNTRY_SUCCESS,
    LIST_COUNTRY_FAILURE,

    //country add
    ADD_COUNTRY,
    ADD_COUNTRY_SUCCESS,
    ADD_COUNTRY_FAILURE,

    //country Edit
    EDIT_COUNTRY,
    EDIT_COUNTRY_SUCCESS,
    EDIT_COUNTRY_FAILURE,

    //active langauge
    ACTIVE_LANGAUGES,
    ACTIVE_LANGAUGES_SUCCESS,
    ACTIVE_LANGAUGES_FAILURE,

    //STATE list
    LIST_STATE,
    LIST_STATE_SUCCESS,
    LIST_STATE_FAILURE,

    //state add
    ADD_STATE,
    ADD_STATE_SUCCESS,
    ADD_STATE_FAILURE,

    //state Edit
    EDIT_STATE,
    EDIT_STATE_SUCCESS,
    EDIT_STATE_FAILURE,

    //STATE list
    LIST_CITY,
    LIST_CITY_SUCCESS,
    LIST_CITY_FAILURE,

    //state add
    ADD_CITY,
    ADD_CITY_SUCCESS,
    ADD_CITY_FAILURE,

    //state Edit
    EDIT_CITY,
    EDIT_CITY_SUCCESS,
    EDIT_CITY_FAILURE,

    //state by country id list
    GET_STATE_BY_COUNTRY_ID,
    GET_STATE_BY_COUNTRY_ID_SUCCESS,
    GET_STATE_BY_COUNTRY_ID_FAILURE,

    //Zipcode list 
    LIST_ZIP_CODE,
    LIST_ZIP_CODE_SUCCESS,
    LIST_ZIP_CODE_FAILURE,

    //Zipcode add
    ADD_ZIP_CODE,
    ADD_ZIP_CODE_SUCCESS,
    ADD_ZIP_CODE_FAILURE,

    //Zipcode Edit
    EDIT_ZIP_CODE,
    EDIT_ZIP_CODE_SUCCESS,
    EDIT_ZIP_CODE_FAILURE,

    //city by state id list
    GET_CITY_BY_STATE_ID,
    GET_CITY_BY_STATE_ID_SUCCESS,
    GET_CITY_BY_STATE_ID_FAILURE,

    //clear data
    CLEAR_LIST_COUNTRY_DATA
} from "../ActionTypes";

//Redux action country list 
export const getListCountryApi = (request) => ({
    type: LIST_COUNTRY,
    payload: request
});
//Redux action country list success
export const getListCountryApiSuccess = (response) => ({
    type: LIST_COUNTRY_SUCCESS,
    payload: response
});
//Redux action country list Faillure
export const getListCountryApiFailure = (error) => ({
    type: LIST_COUNTRY_FAILURE,
    payload: error
});

//Redux action country add 
export const addCountryApi = (request) => ({
    type: ADD_COUNTRY,
    payload: request
});
//Redux action country add success
export const addCountryApiSuccess = (response) => ({
    type: ADD_COUNTRY_SUCCESS,
    payload: response
});
//Redux action country add Faillure
export const addCountryApiFailure = (error) => ({
    type: ADD_COUNTRY_FAILURE,
    payload: error
});

//Redux action country edit 
export const editCountryApi = (request) => ({
    type: EDIT_COUNTRY,
    payload: request
});
//Redux action country edit success
export const editCountryApiSuccess = (response) => ({
    type: EDIT_COUNTRY_SUCCESS,
    payload: response
});
//Redux action country edit Faillure
export const editCountryApiFailure = (error) => ({
    type: EDIT_COUNTRY_FAILURE,
    payload: error
});

//Redux action country edit 
export const getActiveLangauges = (request) => ({
    type: ACTIVE_LANGAUGES,
    payload: request
});
//Redux action country edit success
export const getActiveLangaugesSuccess = (response) => ({
    type: ACTIVE_LANGAUGES_SUCCESS,
    payload: response
});
//Redux action country edit Faillure
export const getActiveLangaugesFailure = (error) => ({
    type: ACTIVE_LANGAUGES_FAILURE,
    payload: error
});

//Redux action State list 
export const getListStateApi = (request) => ({
    type: LIST_STATE,
    payload: request
});
//Redux action State list success
export const getListStateApiSuccess = (response) => ({
    type: LIST_STATE_SUCCESS,
    payload: response
});
//Redux action State list Faillure
export const getListStateApiFailure = (error) => ({
    type: LIST_STATE_FAILURE,
    payload: error
});

//Redux action  for clear response
export const ClearListCountryData = () => ({
    type: CLEAR_LIST_COUNTRY_DATA,
});

//Redux action state add 
export const addStateApi = (request) => ({
    type: ADD_STATE,
    payload: request
});
//Redux action state add success
export const addStateApiSuccess = (response) => ({
    type: ADD_STATE_SUCCESS,
    payload: response
});
//Redux action state add Faillure
export const addStateApiFailure = (error) => ({
    type: ADD_STATE_FAILURE,
    payload: error
});

//Redux action state edit 
export const editStateApi = (request) => ({
    type: EDIT_STATE,
    payload: request
});
//Redux action state edit success
export const editStateApiSuccess = (response) => ({
    type: EDIT_STATE_SUCCESS,
    payload: response
});
//Redux action state edit Faillure
export const editStateApiFailure = (error) => ({
    type: EDIT_STATE_FAILURE,
    payload: error
});

//Redux action city list 
export const getListCityApi = (request) => ({
    type: LIST_CITY,
    payload: request
});
//Redux action city list success
export const getListCityApiSuccess = (response) => ({
    type: LIST_CITY_SUCCESS,
    payload: response
});
//Redux action city list Faillure
export const getListCityApiFailure = (error) => ({
    type: LIST_CITY_FAILURE,
    payload: error
});

//Redux action city add 
export const addCityApi = (request) => ({
    type: ADD_CITY,
    payload: request
});
//Redux action city add success
export const addCityApiSuccess = (response) => ({
    type: ADD_CITY_SUCCESS,
    payload: response
});
//Redux action city add Faillure
export const addCityApiFailure = (error) => ({
    type: ADD_CITY_FAILURE,
    payload: error
});

//Redux action city edit 
export const editCityApi = (request) => ({
    type: EDIT_CITY,
    payload: request
});
//Redux action city edit success
export const editCityApiSuccess = (response) => ({
    type: EDIT_CITY_SUCCESS,
    payload: response
});
//Redux action city edit Faillure
export const editCityApiFailure = (error) => ({
    type: EDIT_CITY_FAILURE,
    payload: error
});

//Redux action state by country id list 
export const getStateByCountryIdApi = (request) => ({
    type: GET_STATE_BY_COUNTRY_ID,
    payload: request
});
//Redux action state by country id list success
export const getStateByCountryIdApiSuccess = (response) => ({
    type: GET_STATE_BY_COUNTRY_ID_SUCCESS,
    payload: response
});
//Redux action state by country id list Faillure
export const getStateByCountryIdApiFailure = (error) => ({
    type: GET_STATE_BY_COUNTRY_ID_FAILURE,
    payload: error
});

//Redux action Zipcode list 
export const getListZipcodeApi = (request) => ({
    type: LIST_ZIP_CODE,
    payload: request
});
//Redux action Zipcode list success
export const getListZipcodeApiSuccess = (response) => ({
    type: LIST_ZIP_CODE_SUCCESS,
    payload: response
});
//Redux action Zipcode list Faillure
export const getListZipcodeApiFailure = (error) => ({
    type: LIST_ZIP_CODE_FAILURE,
    payload: error
});

//Redux action Zipcode add 
export const addZipCodeApi = (request) => ({
    type: ADD_ZIP_CODE,
    payload: request
});
//Redux action Zipcode add success
export const addZipCodeApiSuccess = (response) => ({
    type: ADD_ZIP_CODE_SUCCESS,
    payload: response
});
//Redux action Zipcode add Faillure
export const addZipCodeApiFailure = (error) => ({
    type: ADD_ZIP_CODE_FAILURE,
    payload: error
});

//Redux action Zipcode edit 
export const editZipCodeApi = (request) => ({
    type: EDIT_ZIP_CODE,
    payload: request
});
//Redux action Zipcode edit success
export const editZipCodeApiSuccess = (response) => ({
    type: EDIT_ZIP_CODE_SUCCESS,
    payload: response
});
//Redux action Zipcode edit Faillure
export const editZipCodeApiFailure = (error) => ({
    type: EDIT_ZIP_CODE_FAILURE,
    payload: error
});

//Redux action city by state id list 
export const getCityByStateIdApi = (request) => ({
    type: GET_CITY_BY_STATE_ID,
    payload: request
});
//Redux action city by state id list success
export const getCityByStateIdApiSuccess = (response) => ({
    type: GET_CITY_BY_STATE_ID_SUCCESS,
    payload: response
});
//Redux action city by state id list Faillure
export const getCityByStateIdApiFailure = (error) => ({
    type: GET_CITY_BY_STATE_ID_FAILURE,
    payload: error
});

