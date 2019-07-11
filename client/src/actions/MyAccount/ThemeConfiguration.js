/**
 * Auther : Kevin Ladani
 * Created : 11/10/2018
 * Theme Configuration Actions
 */

 //Import action types form type.js
 import {
    GET_LANGUAGE_LIST,
    GET_LANGUAGE_LIST_SUCCESS,
    GET_LANGUAGE_LIST_FAILURE,

     //For Submit Theme Config 
     SUBMIT_THEME_CONFIG,
     SUBMIT_THEME_CONFIG_SUCCESS,
     SUBMIT_THEME_CONFIG_FAILURE,

} from '../types';


/**
 * Redux Action To Get Language List List
 */
export const getLanguageList = () => ({
    type: GET_LANGUAGE_LIST
})
/**
 * Redux Action Get Language List Success
 */
export const getLanguageListSuccess = (list) => ({
    type: GET_LANGUAGE_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Get Language List Failure
 */
export const getLanguageListFailure = (error) => ({
    type: GET_LANGUAGE_LIST_FAILURE,
    payload: error
})


//For Submit Theme Configuartion
/**
 * Redux Action To Submit Theme Configuartion
 */
export const submitThemeConfig = user => ({
    type: SUBMIT_THEME_CONFIG,
    payload: user
  });
  
  /**
   * Redux Action To Submit Theme Configuartion Success
   */
  export const submitThemeConfigSuccess = user => ({
    type: SUBMIT_THEME_CONFIG_SUCCESS,
    payload: user
  });
  
  /**
   * Redux Action To Submit Theme Configuartion Failure
   */
  export const submitThemeConfigFailure = error => ({
    type: SUBMIT_THEME_CONFIG_FAILURE,
    payload: error
  });
  
