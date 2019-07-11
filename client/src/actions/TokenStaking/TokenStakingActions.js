/* 
    Developer : Nishant Vadgama
    Date : 21-09-2018
    File Comment : Token Staking action method  list
*/

import {
    //WALLET TYPE LIST 
    GETWALLETTYPELIST,
    GETWALLETTYPELIST_SUCCESS,
    GETWALLETTYPELIST_FAILURE,
    //get plan list
    GET_SLABLIST,
    GET_SLABLIST_SUCCESS,
    GET_SLABLIST_FAILURE,
    //get pre confirmation details...
    PRECONFIRMATIONDETAILS,
    PRECONFIRMATIONDETAILS_SUCCESS,
    PRECONFIRMATIONDETAILS_FAILURE,
    //stak request
    STAKREQUEST,
    STAKREQUEST_SUCCESS,
    STAKREQUEST_FAILURE
} from '../types';

//GET WALLET TYPE LIST ...
export const getWalletTypeList = () => ({
    type: GETWALLETTYPELIST
})
export const getWalletTypeListSuccess = (response) => ({
    type: GETWALLETTYPELIST_SUCCESS,
    payload: response
})
export const getWalletTypeListFailure = (error) => ({
    type: GETWALLETTYPELIST_FAILURE,
    error: error
})

// get plan list
export const getSlabList = (request) => ({
    type: GET_SLABLIST,
    request: request
})
export const getSlabListSuccess = (response) => ({
    type: GET_SLABLIST_SUCCESS,
    payload: response
})
export const getSlabListFailure = (error) => ({
    type: GET_SLABLIST_FAILURE,
    error: error
})

//Get pre confirmation details...
export const getPreConfirmationDetails = (request) => ({
    type: PRECONFIRMATIONDETAILS,
    request: request
})
export const getPreConfirmationDetailsSuccess = (response) => ({
    type: PRECONFIRMATIONDETAILS_SUCCESS,
    payload: response
})
export const getPreConfirmationDetailsFailure = (error) => ({
    type: PRECONFIRMATIONDETAILS_FAILURE,
    error: error
})

// post staking request...
export const postStackRequest = (request) => ({
    type: STAKREQUEST,
    request: request
})
export const postStackRequestSuccess = (response) => ({
    type: STAKREQUEST_SUCCESS,
    payload: response
})
export const postStackRequestFailure = (error) => ({
    type: STAKREQUEST_FAILURE,
    error: error
})