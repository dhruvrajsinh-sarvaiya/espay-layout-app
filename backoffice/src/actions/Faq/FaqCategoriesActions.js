/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 24-09-2018
    UpdatedDate : 20-10-2018
    Description : Function for Get FAQ Categories Data Action
*/
import {
    GET_FAQ_CATEGORIES,
    GET_FAQ_CATEGORIES_SUCCESS,
    GET_FAQ_CATEGORIES_FAILURE,
    ADD_FAQ_CATEGORY,
    ADD_FAQ_CATEGORY_SUCCESS,
    ADD_FAQ_CATEGORY_FAILURE,
    UPDATE_FAQ_CATEGORY,
    UPDATE_FAQ_CATEGORY_SUCCESS,
    UPDATE_FAQ_CATEGORY_FAILURE,
    DELETE_FAQ_CATEGORY,
    DELETE_FAQ_CATEGORY_SUCCESS,
    DELETE_FAQ_CATEGORY_FAILURE,
    GET_FAQ_CATEGORY_BY_ID,
    GET_FAQ_CATEGORY_BY_ID_SUCCESS,
    GET_FAQ_CATEGORY_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get FAQ Categories Data Action
 */
export const getFaqcategories = () => ({
    type: GET_FAQ_CATEGORIES,
    payload:{}
});

/* 
* Function for Get FAQ Categories Data Success Action
*/
export const getFaqcategoriesSuccess = (response) => ({
    type: GET_FAQ_CATEGORIES_SUCCESS,
    payload: response
});

/* 
*  Function for Get FAQ Categories Data Failure Action
*/
export const getFaqcategoriesFailure = (error) => ({
    type: GET_FAQ_CATEGORIES_FAILURE,
    payload: error
});


/**
 * Add Faq Category
 */
export const addFaqCategory = (data) => ({
    type: ADD_FAQ_CATEGORY,
    payload: data
});

/**
 * Redux Action To Faq Category Success
 */
export const addFaqCategorySuccess = (response) => ({
    type: ADD_FAQ_CATEGORY_SUCCESS,
    payload: response
});

/**
 * Redux Action To Faq Category Failure
 */
export const addFaqCategoryFailure = (error) => ({
    type: ADD_FAQ_CATEGORY_FAILURE,
    payload: error
});

/**
 * Add Faq Category
 */
export const updateFaqCategory = (data) => ({
    type: UPDATE_FAQ_CATEGORY,
    payload: data
});

/**
 * Redux Action To Faq Category Success
 */
export const updateFaqCategorySuccess = (response) => ({
    type: UPDATE_FAQ_CATEGORY_SUCCESS,
    payload: response
});

/**
 * Redux Action To Faq Category Failure
 */
export const updateFaqCategoryFailure = (error) => ({
    type: UPDATE_FAQ_CATEGORY_FAILURE,
    payload: error
});


/**
 * Redux Action To Faq Category By Id
 */
export const getFaqCategoryById = (faq_category_id) => ({
    type: GET_FAQ_CATEGORY_BY_ID,
    payload : faq_category_id
});

/**
 * Redux Action To Get Faq Category By Id Success
 */
export const getFaqCategoryByIdSuccess = (data) => ({
    type: GET_FAQ_CATEGORY_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Faq Category By Id Failure
 */
export const getFaqCategoryByIdFailure = (error) => ({
    type: GET_FAQ_CATEGORY_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Delete Faq Category
 */
export const deleteFaqCategory = (faq_category_id) => ({
    type: DELETE_FAQ_CATEGORY,
    payload : faq_category_id
});

/**
 * Redux Action To Delete Faq Category Success
 */
export const deleteFaqCategorySuccess = (data) => ({
    type: DELETE_FAQ_CATEGORY_SUCCESS,
    payload: data
});

/**
 * Redux Action To Delete Faq Category Failure
 */
export const deleteFaqCategoryFailure = (error) => ({
    type: DELETE_FAQ_CATEGORY_FAILURE,
    payload: error
});