/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 28-12-2018
    UpdatedDate : 28-12-2018
    Description : Function for Get Region Data Action
*/

import {
    GET_REGIONS,
    GET_REGIONS_SUCCESS,
    GET_REGIONS_FAILURE,
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