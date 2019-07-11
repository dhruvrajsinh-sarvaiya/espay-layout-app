/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 04-10-2018
    UpdatedDate : 04-10-2018
    Description : Function for Get News Data Action
*/
import {
    GET_NEWS,
    GET_NEWS_SUCCESS,
    GET_NEWS_FAILURE,
    ADD_NEWS,
    ADD_NEWS_SUCCESS,
    ADD_NEWS_FAILURE,
    UPDATE_NEWS,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAILURE,
    DELETE_NEWS,
    DELETE_NEWS_SUCCESS,
    DELETE_NEWS_FAILURE,
    //For Get Edit News By Id
    GET_NEWS_BY_ID,
    GET_NEWS_BY_ID_SUCCESS,
    GET_NEWS_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get News Data Action
 */
export const getNews = () => ({
    type: GET_NEWS,
    payload:{}
});

/* 
* Function for Get News Data Success Action
*/
export const getNewsSuccess = (response) => ({
    type: GET_NEWS_SUCCESS,
    payload: response
});

/* 
*  Function for Get News Data Failure Action
*/
export const getNewsFailure = (error) => ({
    type: GET_NEWS_FAILURE,
    payload: error
});


/**
 * Add New News
 */
export const addNews = (data) => ({
    type: ADD_NEWS,
    payload: data
});

/**
 * Add News Success
 */
export const addNewsSuccess = (response) => ({
    type: ADD_NEWS_SUCCESS,
    payload:response
});

/**
 * Add News Failure
 */
export const addNewsFailure = (error) => ({
    type: ADD_NEWS_FAILURE,
    payload: error
});

/**
 * Update News
 */
export const updateNews = (data) => ({
    type: UPDATE_NEWS,
    payload: data
});

/**
 * update News Success
 */
export const updateNewsSuccess = (response) => ({
    type: UPDATE_NEWS_SUCCESS,
    payload:response
});

/**
 * Update News Failure
 */
export const updateNewsFailure = (error) => ({
    type: UPDATE_NEWS_FAILURE,
    payload: error
});

/**
 * Redux Action To Get News By Id
 */
export const getNewsById = (news_id) => ({
    type: GET_NEWS_BY_ID,
    payload : news_id
});

/**
 * Redux Action To Get News By Id Success
 */
export const getNewsByIdSuccess = (data) => ({
    type: GET_NEWS_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get News By Id Failure
 */
export const getNewsByIdFailure = (error) => ({
    type: GET_NEWS_BY_ID_FAILURE,
    payload: error
});


/**
 * Redux Action To Delete News By Id
 */
export const deleteNewsById = (news_id) => ({
    type: DELETE_NEWS,
    payload : news_id
});


/**
 * Redux Action To Delete News By Id Success
 */
export const deleteNewsByIdSuccess = (data) => ({
    type: DELETE_NEWS_SUCCESS,
    payload: data
});

/**
 * Redux Action To Delete News By Id Failure
 */
export const deleteNewsByIdFailure = (error) => ({
    type: DELETE_NEWS_FAILURE,
    payload: error
});