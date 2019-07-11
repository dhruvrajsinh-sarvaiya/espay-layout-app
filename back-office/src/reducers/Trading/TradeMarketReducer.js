// Reducer For Handle Markets List  By Tejas
// import types
import {
  GET_MARKETS,
  GET_MARKETS_SUCCESS,
  GET_MARKETS_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  marketsData: [],
  loading: false

};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {

    // get Markets List
    case GET_MARKETS:
      return { ...state, loading: true };

    // set Data Of Markets List
    case GET_MARKETS_SUCCESS:
      return { ...state, marketsData: action.payload, loading: false };

    // Display Error for Markets List failure
    case GET_MARKETS_FAILURE:

      return { ...state, loading: false, marketsData: [] };

    default:
      return { ...state };
  }
};
