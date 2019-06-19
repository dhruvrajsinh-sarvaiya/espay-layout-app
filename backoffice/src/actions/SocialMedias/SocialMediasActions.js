/* 
    Created By : Megha Kariya
    Date : 13-02-2019
    Description : Function for Get Social Media Data Action
*/
import {
    GET_SOCIAL_MEDIAS,
    GET_SOCIAL_MEDIAS_SUCCESS,
    GET_SOCIAL_MEDIAS_FAILURE,
    ADD_NEW_SOCIAL_MEDIA,
    ADD_NEW_SOCIAL_MEDIA_SUCCESS,
    ADD_NEW_SOCIAL_MEDIA_FAILURE,
    UPDATE_SOCIAL_MEDIA,
    UPDATE_SOCIAL_MEDIA_SUCCESS,
    UPDATE_SOCIAL_MEDIA_FAILURE,
    
} from 'Actions/types';

/**
 * Function for Get Social Medias Data Action
 */
export const getSocialMedias = (mediatypeId) => ({
    type: GET_SOCIAL_MEDIAS,
    payload:mediatypeId
});

/* 
* Function for Get Social Medias Data Success Action
*/
export const getSocialMediasSuccess = (response) => ({
    type: GET_SOCIAL_MEDIAS_SUCCESS,
    payload: response
});

/* 
*  Function for Get Social Medias Data Failure Action
*/
export const getSocialMediasFailure = (error) => ({
    type: GET_SOCIAL_MEDIAS_FAILURE,
    payload: error
});


/**
 * Add New Social Media
 */
export const addNewSocialMedia = (data) => ({
    type: ADD_NEW_SOCIAL_MEDIA,
    payload: data
});

/**
 * Add New Social Media Success
 */
export const addNewSocialMediaSuccess = (response) => ({
    type: ADD_NEW_SOCIAL_MEDIA_SUCCESS,
    payload:response
});

/**
 * Add New Social Media Failure
 */
export const addNewSocialMediaFailure = (error) => ({
    type: ADD_NEW_SOCIAL_MEDIA_FAILURE,
    payload: error
});

/**
 * Update Social Media
 */
export const updateSocialMedia = (data) => ({
    type: UPDATE_SOCIAL_MEDIA,
    payload: data
});

/**
 * update Social Media Success
 */
export const updateSocialMediaSuccess = (response) => ({
    type: UPDATE_SOCIAL_MEDIA_SUCCESS,
    payload:response
});

/**
 * Update Social Media Failure
 */
export const updateSocialMediaFailure = (error) => ({
    type: UPDATE_SOCIAL_MEDIA_FAILURE,
    payload: error
});

