/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 30-10-2018
    UpdatedDate : 30-10-2018
    Description : COIN LIST Action Method
*/
import {
    GET_COINLIST,
    GET_COINLIST_SUCCESS,
    GET_COINLIST_FAILURE,
} from 'Actions/types';

/**
 * Redux Action for Get Coinlist
 */
export const getCoinlist = () => ({
    type: GET_COINLIST
});

/**
 * Redux Action Get Coinlist Success
 */
export const getCoinlistSuccess = (response) => ({
    type: GET_COINLIST_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Coinlist Failure
 */
export const getCoinlistFailure = (error) => ({
    type: GET_COINLIST_FAILURE,
    payload: error
});