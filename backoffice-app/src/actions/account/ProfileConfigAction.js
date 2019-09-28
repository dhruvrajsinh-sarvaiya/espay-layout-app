import {
    //profile config List
    PROFILE_CONFIG_LIST,
    PROFILE_CONFIG_LIST_SUCCESS,
    PROFILE_CONFIG_LIST_FAILURE,

    //profile config Delete 
    PROFILE_CONFIG_DELETE,
    PROFILE_CONFIG_DELETE_SUCCESS,
    PROFILE_CONFIG_DELETE_FAILURE,

    //profileType
    GET_PROFILE_TYPE,
    GET_PROFILE_TYPE_SUCCESS,
    GET_PROFILE_TYPE_FAILURE,

    //kyc list
    GET_KYCLEVEL_LIST,
    GET_KYCLEVEL_LIST_SUCCESS,
    GET_KYCLEVEL_LIST_FAILURE,

    //Profile level list
    GET_PROFILELEVEL_LIST,
    GET_PROFILELEVEL_LIST_SUCCESS,
    GET_PROFILELEVEL_LIST_FAILURE,

    //add profile config
    ADD_PROFILE_CONFIG_DASHBOARD,
    ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    ADD_PROFILE_CONFIG_DASHBOARD_FAILURE,

    //update profile config
    UPDATE_PROFILE_CONFIG_DASHBOARD,
    UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE,

    //clear data
    PROFILE_CONFIG_CLEAR,
} from '../ActionTypes';

//Redux Action To Display Profile Config Data
export const getProfileConfigList = data => ({
    type: PROFILE_CONFIG_LIST,
    payload: data
});

//Redux Action To Display Profile Config Data Success
export const getProfileConfigListSuccess = response => ({
    type: PROFILE_CONFIG_LIST_SUCCESS,
    payload: response
});

//Redux Action To Display Profile Config Data Failure
export const getProfileConfigListFailure = error => ({
    type: PROFILE_CONFIG_LIST_FAILURE,
    payload: error
});

//Redux Action To Delete Profile Config Data
export const deleteProfileConfig = data => ({
    type: PROFILE_CONFIG_DELETE,
    payload: data
});

//Redux Action To Delete Profile Config Data Success
export const deleteProfileConfigSuccess = data => ({
    type: PROFILE_CONFIG_DELETE_SUCCESS,
    payload: data
});

//Redux Action To Delete Profile Config Data Failure
export const deleteProfileConfigFailure = error => ({
    type: PROFILE_CONFIG_DELETE_FAILURE,
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

//for clear data
export const clearProfileConfig = () => ({
    type: PROFILE_CONFIG_CLEAR,
});



