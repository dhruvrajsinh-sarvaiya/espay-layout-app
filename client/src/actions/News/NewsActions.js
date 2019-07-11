/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 18-10-2018
    Description : News Action 
*/
import {
    GET_NEWS,
    GET_NEWS_SUCCESS,
    GET_NEWS_FAILURE,
    GET_NEWSDETAIL,
} from 'Actions/types';

/**
 * Redux Action Get News
 */
export const getNews = () => ({
    type: GET_NEWS
});

/**
 * Redux Action Get News Success
 */
export const getNewsSuccess = (response) => ({
    type: GET_NEWS_SUCCESS,
    payload: response
});

/**
 * Redux Action Get News Failure
 */
export const getNewsFailure = (error) => ({
    type: GET_NEWS_FAILURE,
    payload: error
});

/**
 * For Get Particular News Detail
 */
export const getNewsDetail = (id) => ({
    type: GET_NEWSDETAIL,
    id: id
});