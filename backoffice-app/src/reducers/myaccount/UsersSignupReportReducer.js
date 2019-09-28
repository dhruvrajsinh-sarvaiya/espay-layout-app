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
  LIST_USER_SIGNUP_REPORT_FAILURE,

  //clear datas
  ACTION_LOGOUT,
  CLEAR_USER_SIGNUP_REPORT,
} from "../../actions/ActionTypes";

/**
 * initial auth user
 */
const INIT_STATE = {
  //user sign up report data
  UserRptData: null,
  Loading: false,
  //user sign up report count 
  CountData: null,
};

export default (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return INIT_STATE

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return INIT_STATE;

    //List  Users Signup Report Count..
    case USER_SIGNUP_DASHBOARD:
      return Object.assign({}, state, { loading: true, CountData: null })
    //List  Users Signup Report Count success
    case USER_SIGNUP_DASHBOARD_SUCCESS:
      return Object.assign({}, state, { loading: false, CountData: action.payload })
    //List  Users Signup Report Count Failure
    case USER_SIGNUP_DASHBOARD_FAILURE:
      return Object.assign({}, state, { loading: false, error: action.payload })

    //For Users Signup Report
    case LIST_USER_SIGNUP_REPORT:
      return Object.assign({}, state, { loading: true, UserRptData: null })
    //For Users Signup Report succeess
    case LIST_USER_SIGNUP_REPORT_SUCCESS:
      return Object.assign({}, state, { loading: false, UserRptData: action.payload })
    //For Users Signup Report failure
    case LIST_USER_SIGNUP_REPORT_FAILURE:
      return Object.assign({}, state, { loading: false, error: action.payload })

    //clear data
    case CLEAR_USER_SIGNUP_REPORT:
      return INIT_STATE;

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
