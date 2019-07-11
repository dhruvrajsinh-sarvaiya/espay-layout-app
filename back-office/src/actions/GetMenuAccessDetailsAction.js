// actios fro get menu access details by Tejas 29/4/2019

// import types
import {
    
    //GET Menu Access
    GET_MENU_ACCESS,
    GET_MENU_ACCESS_SUCCESS,
    GET_MENU_ACCESS_FAILURE,

    //Added by salim dt:06/05/2019
    //Update Module Permission Access
    UPDATE_MODULE_PERMISSION_ACCESS,
    UPDATE_MODULE_PERMISSION_ACCESS_SUCCESS,
    UPDATE_MODULE_PERMISSION_ACCESS_FAILURE,

    //Update Module Field Access
    UPDATE_MODULE_FIELD_ACCESS,
    UPDATE_MODULE_FIELD_ACCESS_SUCCESS,
    UPDATE_MODULE_FIELD_ACCESS_FAILURE,

} from "Actions/types";


/**
 * Redux Action GET Menu Access
 */
export const getMenuAccess = (data) => ({
    type: GET_MENU_ACCESS,
    payload: data
});

/**
 * Redux Action GET Menu Access Success
 */
export const getMenuAccessSuccess = (data) => ({
    type: GET_MENU_ACCESS_SUCCESS,
    payload: data.Result
});

/**
 * Redux Action GET Menu Access Failure
 */
export const getMenuAccessFailure = (error) => ({
    type: GET_MENU_ACCESS_FAILURE,
    payload: error
});

//Added by salim dt:06/05/2019
/**
 * Redux Action Update Module Access Permission  */
export const updateModuleAccessPermission = (data) => ({
    type: UPDATE_MODULE_PERMISSION_ACCESS,
    payload: data
});

/**
 * Redux Action Update Module Access Permission Success
 */
export const updateModuleAccessPermissionSuccess = (data) => ({
    type: UPDATE_MODULE_PERMISSION_ACCESS_SUCCESS,
    payload: data
});

/**
 * Redux Action Update Module Access Permission Failure
 */
export const updateModuleAccessPermissionFailure = (error) => ({
    type: UPDATE_MODULE_PERMISSION_ACCESS_FAILURE,
    payload: error
});


/**
 * Redux Action Update Module Field Access Permission
 */
export const updateModuleFieldAccess = (data) => ({
    type: UPDATE_MODULE_FIELD_ACCESS,
    payload: data
});

/**
 * Redux Action Update Module Field Access Permission Success
 */
export const updateModuleFieldAccessSuccess = (data) => ({
    type: UPDATE_MODULE_FIELD_ACCESS_SUCCESS,
    payload: data
});

/**
 * Redux Action Update Module Field Access Permission Failure
 */
export const updateModuleFieldAccessFailure = (error) => ({
    type: UPDATE_MODULE_FIELD_ACCESS_FAILURE,
    payload: error
});