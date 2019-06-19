/**
 * Theme Configuration Reducers
 */
import {
    //For Get Language List
    GET_LANGUAGE_LIST,
    GET_LANGUAGE_LIST_SUCCESS,
    GET_LANGUAGE_LIST_FAILURE,
  
    //For Submit Theme Config 
    SUBMIT_THEME_CONFIG,
    SUBMIT_THEME_CONFIG_SUCCESS,
    SUBMIT_THEME_CONFIG_FAILURE,
  } from "Actions/types";
  
  /**
   * initial SMS Auth
   */
  const INIT_STATE = {
    ThemeConfigData: [],
    loading: false
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      //For Get Language List
      case GET_LANGUAGE_LIST:
        return { ...state, loading: true };
  
      case GET_LANGUAGE_LIST_SUCCESS:
        return { ...state, loading: false, ThemeConfigData: action.payload };
  
      case GET_LANGUAGE_LIST_FAILURE:
        return { ...state, loading: false };
  
      //For Submit Theme Config
      case SUBMIT_THEME_CONFIG:
        return { ...state, loading: true };
  
      case SUBMIT_THEME_CONFIG_SUCCESS:
        return { ...state, loading: false, success: action.payload };
  
      case SUBMIT_THEME_CONFIG_FAILURE:
        return { ...state, loading: false };
  
      default:
        return { ...state };
    }
  };
  