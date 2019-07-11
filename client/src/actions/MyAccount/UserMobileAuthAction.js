/**
 * Auth Actions
 */
import {

    //For Signup with Mobile
    SIGNUP_USERS_MOBILE,
    SIGNUP_USERS_MOBILE_SUCCESS,
    SIGNUP_USERS_MOBILE_FAILURE
  
  } from "../types";
    
  //For Signup User with Mobile
  /**
   * Redux Action To Signup User with Mobile
   */
  export const signupUserMobile = user => ({
    type: SIGNUP_USERS_MOBILE,
    payload:  user 
  });
  
  /**
   * Redux Action To Signup User Success with Mobile
   */
  export const signUpUserMobileSuccess = user => ({
    type: SIGNUP_USERS_MOBILE_SUCCESS,
    payload: user
  });
  
  /**
   * Redux Action To Signup User Failure with Mobile
   */
  export const signUpUserMobileFailure = error => ({
    type: SIGNUP_USERS_MOBILE_FAILURE,
    payload: error
  });
  
  
 