/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 20-09-2018
    UpdatedDate : 20-09-2018
    Description : Dispach Action from Component
*/
import {
    GET_ANNOUCEMENT,
    GET_ANNOUCEMENT_SUCCESS,
    GET_ANNOUCEMENT_FAILURE,
} from 'Actions/types';

/**
 * Redux Action for Get Announcement
 */
export const getAnnoucements = () => ({
    type: GET_ANNOUCEMENT
});

/**
 * Redux Action Get Annoucement Success
 */
export const getAnnoucementsSuccess = (response) => ({
    type: GET_ANNOUCEMENT_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Annoucement Failure
 */
export const getAnnoucementsFailure = (error) => ({
    type: GET_ANNOUCEMENT_FAILURE,
    payload: error
});