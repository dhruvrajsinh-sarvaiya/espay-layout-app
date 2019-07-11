/**
 * Users Signup Report Reducer
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
} from "Actions/types";

/**
 * initial auth user
 */
const INITIAL_STATE = {
  UserRptData: [],
  countRptData: [],
  Loading: false,
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    //List  Users Signup Report Count..
    case USER_SIGNUP_DASHBOARD:
    case LIST_USER_SIGNUP_REPORT:
      return { ...state, loading: true };

    case USER_SIGNUP_DASHBOARD_SUCCESS:
      return { ...state, loading: false, countRptData: action.payload };

    case USER_SIGNUP_DASHBOARD_FAILURE:
    case LIST_USER_SIGNUP_REPORT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //For Users Signup Report
    case LIST_USER_SIGNUP_REPORT_SUCCESS:
      return { ...state, loading: false, UserRptData: action.payload };

    default:
      return { ...state };
  }
};
