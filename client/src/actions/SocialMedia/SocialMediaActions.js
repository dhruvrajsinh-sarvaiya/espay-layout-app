/* 
    Created By : Megha Kariya
    Date : 13-02-2019
    Description : Social Media Action 
*/
import {
    GET_SOCIAL_MEDIA_DETAIL,
    GET_SOCIAL_MEDIA_DETAIL_SUCCESS,
    GET_SOCIAL_MEDIA_DETAIL_FAILURE,
} from 'Actions/types';

/**
 * Redux Action Get Social Media
 */
export const getSocialMedia = (mediatypeId) => ({
    type: GET_SOCIAL_MEDIA_DETAIL,
    payload:mediatypeId
});

/**
 * Redux Action Get Social Media Success
 */
export const getSocialMediaSuccess = (response) => ({
    type: GET_SOCIAL_MEDIA_DETAIL_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Social Media Failure
 */
export const getSocialMediaFailure = (error) => ({
    type: GET_SOCIAL_MEDIA_DETAIL_FAILURE,
    payload: error
});
