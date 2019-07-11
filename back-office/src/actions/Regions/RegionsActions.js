/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : Function for Get Region Data Action
*/
import {
    GET_REGIONS,
    GET_REGIONS_SUCCESS,
    GET_REGIONS_FAILURE,
    ADD_NEW_REGION,
    ADD_NEW_REGION_SUCCESS,
    ADD_NEW_REGION_FAILURE,
    UPDATE_REGION,
    UPDATE_REGION_SUCCESS,
    UPDATE_REGION_FAILURE,
    GET_REGION_BY_ID,
    GET_REGION_BY_ID_SUCCESS ,
    GET_REGION_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get Regions Data Action
 */
export const getRegions = () => ({
    type: GET_REGIONS,
    payload:{}
});

/* 
* Function for Get Regions Data Success Action
*/
export const getRegionsSuccess = (response) => ({
    type: GET_REGIONS_SUCCESS,
    payload: response
});

/* 
*  Function for Get Regions Data Failure Action
*/
export const getRegionsFailure = (error) => ({
    type: GET_REGIONS_FAILURE,
    payload: error
});


/**
 * Add New Region
 */
export const addNewRegion = (data) => ({
    type: ADD_NEW_REGION,
    payload: data
});

/**
 * Add New Region Success
 */
export const addNewRegionSuccess = (response) => ({
    type: ADD_NEW_REGION_SUCCESS,
    payload:response
});

/**
 * Add New Region Failure
 */
export const addNewRegionFailure = (error) => ({
    type: ADD_NEW_REGION_FAILURE,
    payload: error
});

/**
 * Update Region
 */
export const updateRegion = (data) => ({
    type: UPDATE_REGION,
    payload: data
});

/**
 * update Region Success
 */
export const updateRegionSuccess = (response) => ({
    type: UPDATE_REGION_SUCCESS,
    payload:response
});

/**
 * Update Region Failure
 */
export const updateRegionFailure = (error) => ({
    type: UPDATE_REGION_FAILURE,
    payload: error
});


/**
 * Redux Action To Get Region By Id
 */
export const getRegionById = (region_id) => ({
    type: GET_REGION_BY_ID,
    payload : region_id
});

/**
 * Redux Action To Get Region By Id Success
 */
export const getRegionByIdSuccess = (data) => ({
    type: GET_REGION_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Region By Id Failure
 */
export const getRegionByIdFailure = (error) => ({
    type: GET_REGION_BY_ID_FAILURE,
    payload: error
});