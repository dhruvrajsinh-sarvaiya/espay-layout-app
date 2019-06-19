// import types
import {
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,
  // GET_PROVIDERS_LIST,
  // GET_PROVIDERS_LIST_SUCCESS,
  // GET_PROVIDERS_LIST_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  currencyList: [],
  providersList: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    // get Currency List
    case GET_CURRENCY_LIST:
      return { ...state, loading: true };

    // set Data Of  Currency List
    case GET_CURRENCY_LIST_SUCCESS:
      return { ...state, currencyList: action.payload, loading: false };

    // Display Error for Currency List failure
    case GET_CURRENCY_LIST_FAILURE:
      return { ...state, loading: false, currencyList: [] };

    default:
      return { ...state };
  }
};
