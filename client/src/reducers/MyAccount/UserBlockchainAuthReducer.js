/**
 * Auth User Reducers
 */
import {
  //For Signup with blockchain
  SIGNUP_USERS_BLOCKCHAIN,
  SIGNUP_USERS_BLOCKCHAIN_SUCCESS,
  SIGNUP_USERS_BLOCKCHAIN_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  userblockchain: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }

  switch (action.type) {
    //For Signup User with Blockchain
    case SIGNUP_USERS_BLOCKCHAIN:
      return { ...state, loading: true };

    case SIGNUP_USERS_BLOCKCHAIN_SUCCESS:
      return { ...state, loading: false, userblockchain: action.payload };

    case SIGNUP_USERS_BLOCKCHAIN_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
