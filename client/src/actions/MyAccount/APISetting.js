/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * API Setting Actions
 */

 //Import action types form type.js
 import {
    API_SETTING_CREATE,
    API_SETTING_CREATE_SUCCESS,
    API_SETTING_CREATE_FAILURE,
    API_SETTING_SAVE,
    API_SETTING_SAVE_SUCCESS,
    API_SETTING_SAVE_FAILURE,
    API_SETTING_EDIT,
    API_SETTING_EDIT_SUCCESS,
    API_SETTING_EDIT_FAILURE,
    API_SETTING_DELETE,
    API_SETTING_DELETE_SUCCESS,
    API_SETTING_DELETE_FAILURE
} from '../types';

/**
 * Redux Action API Setting Create Success
 */
export const apiSettingCreateSuccess = (new_api_key) => ({
    type: API_SETTING_CREATE_SUCCESS,
    payload: new_api_key
});

/**
 * Redux Action API Setting Create Failure
 */
export const apiSettingCreateFailure = (error) => ({
    type: API_SETTING_CREATE_FAILURE,
    payload: error
})

/**
 * Redux Action To API Setting Create
 */
export const apiSettingCreate = (new_api_key) => ({
    type: API_SETTING_CREATE,
    payload: new_api_key
})

/**
 * Redux Action API Setting Save Success
 */
export const apiSettingSaveSuccess = (data) => ({
    type: API_SETTING_SAVE_SUCCESS,
    payload: data
});

/**
 * Redux Action API Setting Save Failure
 */
export const apiSettingSaveFailure = (error) => ({
    type: API_SETTING_SAVE_FAILURE,
    payload: error
})

/**
 * Redux Action To API Setting Save
 */
export const apiSettingSave = (data) => ({
    type: API_SETTING_SAVE,
    payload: data
})

/**
 * Redux Action API Setting Edit Success
 */
export const apiSettingEditSuccess = (data) => ({
    type: API_SETTING_EDIT_SUCCESS,
    payload: data
});

/**
 * Redux Action API Setting Edit Failure
 */
export const apiSettingEditFailure = (error) => ({
    type: API_SETTING_EDIT_FAILURE,
    payload: error
})

/**
 * Redux Action To API Setting Edit
 */
export const apiSettingEdit = (data) => ({
    type: API_SETTING_EDIT,
    payload: data
})

/**
 * Redux Action API Setting Delete Success
 */
export const apiSettingDeleteSuccess = (data) => ({
    type: API_SETTING_DELETE_SUCCESS,
    payload: data
});

/**
 * Redux Action API Setting Delete Failure
 */
export const apiSettingDeleteFailure = (error) => ({
    type: API_SETTING_DELETE_FAILURE,
    payload: error
})

/**
 * Redux Action To API Setting Delete
 */
export const apiSettingDelete = (data) => ({
    type: API_SETTING_DELETE,
    payload: data
})
