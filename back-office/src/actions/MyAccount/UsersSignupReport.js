/**
 * Auther : Kevin Ladani
 * Created : 01/01/2019
 * User Signup Report Actions
 */
import {

  //Count Total User Signup Count
  USER_SIGNUP_DASHBOARD,
  USER_SIGNUP_DASHBOARD_SUCCESS,
  USER_SIGNUP_DASHBOARD_FAILURE,

  //For Users Signup Report
  LIST_USER_SIGNUP_REPORT,
  LIST_USER_SIGNUP_REPORT_SUCCESS,
  LIST_USER_SIGNUP_REPORT_FAILURE
} from "../types";


//For Display Users Signup Report Count
/* Redux Action To Display Users Signup Report Count Data */
export const getUserSignupData = () => ({
  type: USER_SIGNUP_DASHBOARD
});

/* Redux Action To Display Users Signup Report Count Success */
export const getUserSignupDataSuccess = (response) => ({
  type: USER_SIGNUP_DASHBOARD_SUCCESS,
  payload: response
});

/* Redux Action To Display Users Signup Report Count Data Failure */
export const getUserSignupDataFailure = (error) => ({
  type: USER_SIGNUP_DASHBOARD_FAILURE,
  payload: error
});


//For Display Users Signup Report
//Redux Action To Display Users Signup Report
export const getUserSignupRptData = data => ({
  type: LIST_USER_SIGNUP_REPORT,
  payload: data
});

//Redux Action To Display Users Signup Report Success
export const getUserSignupRptDataSuccess = response => ({
  type: LIST_USER_SIGNUP_REPORT_SUCCESS,
  payload: response
});

//Redux Action To Display Users Signup Report Failure
export const getUserSignupRptDataFailure = error => ({
  type: LIST_USER_SIGNUP_REPORT_FAILURE,
  payload: error
});
