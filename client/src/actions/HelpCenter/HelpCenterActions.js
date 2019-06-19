/* 
    Createdby : Jayesh Pathak
    Updateby : Kushal Parekh
    CreatedDate : 08-01-2019
    UpdatedDate : 11-01-2019
    Description : Function for Get HelpCenter Data Action
*/
import {
    GET_HELPMANUALMODUALS,
    GET_HELPMANUALMODUALS_SUCCESS,
    GET_HELPMANUALMODUALS_FAILURE,
    GET_HELPMANUALS_BY_ID,
    GET_HELPMANUALS_BY_ID_SUCCESS,
    GET_HELPMANUALS_BY_ID_FAILURE,
    UPDATE_SEARCH_HELP,
    ON_SEARCH_HELP,
    SHOW_HELP_LOADING_INDICATOR
} from 'Actions/types';


/**
 * Function for Get Help Manual Modules Data Action
 */
export const getHelpManualModules = () => ({
    type: GET_HELPMANUALMODUALS,
    payload:{}
});

/* 
* Function for Get Help Manual Modules Data Success Action
*/
export const getHelpManualModulesSuccess = (response) => ({
    type: GET_HELPMANUALMODUALS_SUCCESS,
    payload: response
});

/* 
*  Function for Get Help Manual Modules Data Failure Action
*/
export const getHelpManualModulesFailure = (error) => ({
    type: GET_HELPMANUALMODUALS_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Help Manual By Id
 */
export const getHelpManualById = (data) => ({
    type: GET_HELPMANUALS_BY_ID,
    payload : data
});

/**
 * Redux Action To Get Help Manual By Id Success
 */
export const getHelpManualByIdSuccess = (data) => ({
    type: GET_HELPMANUALS_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Help Manual By Id Failure
 */
export const getHelpManualByIdFailure = (error) => ({
    type: GET_HELPMANUALS_BY_ID_FAILURE,
    payload: error
});

/**
 * Show Help Loading Indicator
 */
export const showHelpLoadingIndicator = () => ({
    type: SHOW_HELP_LOADING_INDICATOR
});

/**
 * Update Search Help
 */
export const updateSearchHelp = (value) => ({
    type: UPDATE_SEARCH_HELP,
    payload: value
});

/**
 * On Search HELP
 */
export const onSearchHelp = (value) => ({
    type: ON_SEARCH_HELP,
    payload: value
});