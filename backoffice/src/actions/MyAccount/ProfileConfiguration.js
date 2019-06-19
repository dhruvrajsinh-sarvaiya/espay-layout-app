/* 
    Developer : Kevin Ladani
    Date : 23-01-2019
    File Comment : MyAccount Profile Configuration Dashboard Actions
*/
import {
    LIST_PROFILE_CONFIG_DASHBOARD,
    LIST_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    LIST_PROFILE_CONFIG_DASHBOARD_FAILURE,

    ADD_PROFILE_CONFIG_DASHBOARD,
    ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    ADD_PROFILE_CONFIG_DASHBOARD_FAILURE,

    DELETE_PROFILE_CONFIG_DASHBOARD,
    DELETE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    DELETE_PROFILE_CONFIG_DASHBOARD_FAILURE,

    UPDATE_PROFILE_CONFIG_DASHBOARD,
    UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE,

    GET_PROFILE_TYPE,
    GET_PROFILE_TYPE_SUCCESS,
    GET_PROFILE_TYPE_FAILURE,

    GET_KYCLEVEL_LIST,
    GET_KYCLEVEL_LIST_SUCCESS,
    GET_KYCLEVEL_LIST_FAILURE,

    GET_PROFILELEVEL_LIST,
    GET_PROFILELEVEL_LIST_SUCCESS,
    GET_PROFILELEVEL_LIST_FAILURE,

    GET_PROFILEBY_ID,
    GET_PROFILEBY_ID_SUCCESS,
    GET_PROFILEBY_ID_FAILURE,

    GET_LIST_CURRENCY,
    GET_LIST_CURRENCY_SUCCESS,
    GET_LIST_CURRENCY_FAILURE,

} from "../types";

//For Display List Profile Config Data

//Redux Action To Display Profile Config Data
export const getProfileConfigData = data => ({
    type: LIST_PROFILE_CONFIG_DASHBOARD,
    payload: data
});

//Redux Action To Display Profile Config Data Success
export const getProfileConfigDataSuccess = response => ({
    type: LIST_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    payload: response
});

//Redux Action To Display Profile Config Data Failure
export const getgetProfileConfigDataFailure = error => ({
    type: LIST_PROFILE_CONFIG_DASHBOARD_FAILURE,
    payload: error
});


//For Add Profile Config Data

//Redux Action To Add Profile Config Data
export const addProfileConfigData = data => ({
    type: ADD_PROFILE_CONFIG_DASHBOARD,
    payload: data
});

//Redux Action To Add Profile Config Data Success
export const addProfileConfigDataSuccess = data => ({
    type: ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Add Profile Config Data Failure
export const addProfileConfigDataFailure = data => ({
    type: ADD_PROFILE_CONFIG_DASHBOARD_FAILURE,
    payload: data
});

//For DeleteProfile Config Data

//Redux Action To Delete Profile Config Data
export const deleteProfileConfigData = data => ({
    type: DELETE_PROFILE_CONFIG_DASHBOARD,
    payload: data
});

//Redux Action To Delete Profile Config Data Success
export const deleteProfileConfigDataSuccess = data => ({
    type: DELETE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Delete Profile Config Data Failure
export const deleteProfileConfigDataFailure = error => ({
    type: DELETE_PROFILE_CONFIG_DASHBOARD_FAILURE,
    payload: error
});

//For Edit Password Profile Config Data

//Redux Action To Edit Password Profile Config Data
export const updateProfileConfigData = data => ({
    type: UPDATE_PROFILE_CONFIG_DASHBOARD,
    payload: data
});

//Redux Action To Edit Profile Config Data Success
export const updateProfileConfigDataSuccess = data => ({
    type: UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Edit Profile Config Data Failure
export const updateProfileConfigDataFailure = error => ({
    type: UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE,
    payload: error
});

//Redux Action To Get Profile Type
export const getProfileType = () => ({
    type: GET_PROFILE_TYPE
})

// Redux Action To Get Profile Type Success
export const getProfileTypeSuccess = (data) => ({
    type: GET_PROFILE_TYPE_SUCCESS,
    payload: data
});

// Redux Action To Get Profile Type Failure
export const getProfileTypeFailure = (error) => ({
    type: GET_PROFILE_TYPE_FAILURE,
    payload: error
});

//Redux Action To Get KYC Level List
export const getKYCLevelList = () => ({
    type: GET_KYCLEVEL_LIST
})

// Redux Action To Get KYC Level List Success
export const getKYCLevelListSuccess = (data) => ({
    type: GET_KYCLEVEL_LIST_SUCCESS,
    payload: data
});

// Redux Action To Get KYC Level List Failure
export const getKYCLevelListFailure = (error) => ({
    type: GET_KYCLEVEL_LIST_FAILURE,
    payload: error
});

//Redux Action To Get Profile Level List
export const getProfileLevelList = () => ({
    type: GET_PROFILELEVEL_LIST
})

// Redux Action To Get Profile Level List Success
export const getProfileLevelListSuccess = (data) => ({
    type: GET_PROFILELEVEL_LIST_SUCCESS,
    payload: data
});

// Redux Action To Get Profile Level List Failure
export const getProfileLevelListFailure = (error) => ({
    type: GET_PROFILELEVEL_LIST_FAILURE,
    payload: error
});

//Redux Action To Get Profile BY Id List
export const getProfileById = (profileId) => ({
    type: GET_PROFILEBY_ID,
    payload: profileId
})

// Redux Action To Get Profile By Id Success
export const getProfileByIdSuccess = (data) => ({
    type: GET_PROFILEBY_ID_SUCCESS,
    payload: data
});

// Redux Action To Get Profile By Id Failure
export const getProfileByIdFailure = (error) => ({
    type: GET_PROFILEBY_ID_FAILURE,
    payload: error
});

//Redux Action To Get Currency List
export const getCurrencyList = () => ({
    type: GET_LIST_CURRENCY
})

// Redux Action To Get Currency List Success
export const getCurrencyListSuccess = (data) => ({
    type: GET_LIST_CURRENCY_SUCCESS,
    payload: data
});

// Redux Action To Get Currency List Failure
export const getCurrencyListFailure = (error) => ({
    type: GET_LIST_CURRENCY_FAILURE,
    payload: error
});

