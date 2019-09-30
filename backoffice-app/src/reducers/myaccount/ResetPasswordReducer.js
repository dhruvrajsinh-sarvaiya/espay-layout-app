
import {
  //For Change Password
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,

  //clear data
  ACTION_LOGOUT
} from '../../actions/ActionTypes'

/**
 * initial Change Password
 */
const initialState = {
  // Change Password
  changepassword: [],
  loading: false
};

export default (state, action) => {

  // If state is undefine then return with initial state		
  if (typeof state === 'undefined')
    return initialState

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return initialState;

    // Handle Change Password method data
    case CHANGE_PASSWORD:
      return Object.assign({}, state, { loading: true })
    // Set Change Password success data
    case CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, { loading: false, changepassword: action.payload })
    // Set Change Password failure data
    case CHANGE_PASSWORD_FAILURE:
      return Object.assign({}, state, { loading: false })

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};