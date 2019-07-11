/*
 * Created By : Megha Kariya
 * Date : 17-01-2019
 * Comment : Push Message reducer file
 */
/**
 * Push Message Reducer
 */

import {
  //For Display User List
  DISPALY_USER_LIST,
  DISPALY_USER_LIST_SUCCESS,
  DISPALY_USER_LIST_FAILURE,
  SEND_MSG,
  SEND_MSG_SUCCESS,
  SEND_MSG_FAILURE,

} from "Actions/types";

/**
 * initial auth Message
 */
const INIT_STATE = {

  loading: false,
  displayUserDara: [],
  error: [],
  sendData: {}
};


export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }
  switch (action.type) {
    //For Display Users List
    case DISPALY_USER_LIST:
      return { ...state, loading: true };

    case DISPALY_USER_LIST_SUCCESS:
      return { ...state, loading: false, displayUserDara: action.payload };

    case DISPALY_USER_LIST_FAILURE:
      return { ...state, loading: false, displayUserDara: [], error: action.payload };

    case SEND_MSG:
      return { ...state, loading: true };

    case SEND_MSG_SUCCESS:
      return { ...state, loading: false, sendData: action.payload };

    case SEND_MSG_FAILURE:
      return { ...state, loading: false, sendData: [], error: action.payload };

    default:
      return { ...state };
  }
};
