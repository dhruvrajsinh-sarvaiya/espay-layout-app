/**
 * Auth Actions
 */
import {

    //For Signup with Mobile
    SIGNUP_USERS_BLOCKCHAIN,
    SIGNUP_USERS_BLOCKCHAIN_SUCCESS,
    SIGNUP_USERS_BLOCKCHAIN_FAILURE
  
  } from "../types";
    
  //For Signup User with Blockchain
  /**
   * Redux Action To Signup User with Blockchain
   */
  export const signupUserBlockchain = user => ({
    type: SIGNUP_USERS_BLOCKCHAIN,
    payload:  user 
  });
  
  /**
   * Redux Action To Signup User Success with Blockchain
   */
  export const signUpUserBlockchainSuccess = user => ({
    type: SIGNUP_USERS_BLOCKCHAIN_SUCCESS,
    payload: user
  });
  
  /**
   * Redux Action To Signup User Failure with Blockchain
   */
  export const signUpUserBlockchainFailure = error => ({
    type: SIGNUP_USERS_BLOCKCHAIN_FAILURE,
    payload: error
  });
  
  
 