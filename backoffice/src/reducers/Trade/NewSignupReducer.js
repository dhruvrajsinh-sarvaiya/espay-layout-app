// Reducer for New SignUp Data By Tejas

import { NotificationManager } from "react-notifications";

import {
  GET_NEW_SIGNUP_DATA,
  GET_NEW_SIGNUP_DATA_SUCCESS,
  GET_NEW_SIGNUP_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  newSignup: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get New SignUp
    case GET_NEW_SIGNUP_DATA:
      return { ...state, loading: true };

    // set Data Of  New SignUp
    case GET_NEW_SIGNUP_DATA_SUCCESS:
      return { ...state, newSignup: action.payload, loading: false };

    // Display Error for New SignUp failure
    case GET_NEW_SIGNUP_DATA_FAILURE:
      NotificationManager.error("New Signup Data Not Found");
      return { ...state, loading: false, newSignup: [] };

    default:
      return { ...state };
  }
};
