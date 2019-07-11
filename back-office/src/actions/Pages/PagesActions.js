/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 03-10-2018
    UpdatedDate : 03-10-2018
    Description : Function for Get PAGES Data Action
*/
import {
    GET_PAGES,
    GET_PAGES_SUCCESS,
    GET_PAGES_FAILURE,
    ADD_NEW_PAGE,
    ADD_NEW_PAGE_SUCCESS,
    ADD_NEW_PAGE_FAILURE,
    UPDATE_PAGE,
    UPDATE_PAGE_SUCCESS,
    UPDATE_PAGE_FAILURE,
    DELETE_PAGE,
    //For Get Edit Page By Id
    GET_PAGE_BY_ID,
    GET_PAGE_BY_ID_SUCCESS,
    GET_PAGE_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get Pages Data Action
 */
export const getPages = (pagetypeId) => ({
    type: GET_PAGES,
    payload:pagetypeId
});

/* 
* Function for Get Pages Data Success Action
*/
export const getPagesSuccess = (response) => ({
    type: GET_PAGES_SUCCESS,
    payload: response
});

/* 
*  Function for Get Pages Data Failure Action
*/
export const getPagesFailure = (error) => ({
    type: GET_PAGES_FAILURE,
    payload: error
});


/**
 * Add New pages
 */
export const addNewPage = (data) => ({
    type: ADD_NEW_PAGE,
    payload: data
});

/**
 * Add New page Success
 */
export const addNewPageSuccess = (response) => ({
    type: ADD_NEW_PAGE_SUCCESS,
    payload:response
});

/**
 * Add New page Failure
 */
export const addNewPageFailure = (error) => ({
    type: ADD_NEW_PAGE_FAILURE,
    payload: error
});

/**
 * Update page
 */
export const updatePage = (data) => ({
    type: UPDATE_PAGE,
    payload: data
});

/**
 * update page Success
 */
export const updatePageSuccess = (response) => ({
    type: UPDATE_PAGE_SUCCESS,
    payload:response
});

/**
 * Update page Failure
 */
export const updatePageFailure = (error) => ({
    type: UPDATE_PAGE_FAILURE,
    payload: error
});


/**
 * Redux Action To Get Page By Id
 */
export const getPageById = (page_id) => ({
    type: GET_PAGE_BY_ID,
    payload : page_id
});

/**
 * Redux Action To Get Page By Id Success
 */
export const getPageByIdSuccess = (data) => ({
    type: GET_PAGE_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Page By Id Failure
 */
export const getPageByIdFailure = (error) => ({
    type: GET_PAGE_BY_ID_FAILURE,
    payload: error
});

/**
 * delete Page
 */
export const deletePage = (pageid) => ({
    type: DELETE_PAGE
});