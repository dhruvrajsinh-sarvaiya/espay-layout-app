// Reducer for Active User Data By Tejas

import { NotificationManager } from "react-notifications";

import {
  GET_ACTIVE_USER_DATA,
  GET_ACTIVE_USER_DATA_SUCCESS,
  GET_ACTIVE_USER_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  activeUsers: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Active User
    case GET_ACTIVE_USER_DATA:
      return { ...state, loading: true };

    // set Data Of  Active User
    case GET_ACTIVE_USER_DATA_SUCCESS:
      return { ...state, activeUsers: action.payload, loading: false };

    // Display Error for Active User failure
    case GET_ACTIVE_USER_DATA_FAILURE:
      NotificationManager.error("Active User Data Not Found");
      return { ...state, loading: false, activeUsers: [] };

    default:
      return { ...state };
  }
};
