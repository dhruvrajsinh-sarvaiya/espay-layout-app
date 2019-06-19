// Reducer For Handle Manage MArkets By Tejas
// import types
import {
  GET_MARKET_LIST,
  GET_MARKET_LIST_SUCCESS,
  GET_MARKET_LIST_FAILURE,
  ADD_MARKET_LIST,
  ADD_MARKET_LIST_SUCCESS,
  ADD_MARKET_LIST_FAILURE,
  UPDATE_MARKET_LIST,
  UPDATE_MARKET_LIST_SUCCESS,
  UPDATE_MARKET_LIST_FAILURE,
  DELETE_MARKET_LIST,
  DELETE_MARKET_LIST_SUCCESS,
  DELETE_MARKET_LIST_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  marketList: [],
  addMarketList: [],
  updateMarketList: [],
  deleteMarketList: [],
  loading: false,
  error: [],
  addError: [],
  updateError: [],
  updateLoading: false,
  addLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Market List
    case GET_MARKET_LIST:
      return { ...state, loading: true };

    // set Data Of Market List
    case GET_MARKET_LIST_SUCCESS:
      return { ...state, marketList: action.payload, loading: false, error: [] };

    // Display Error for Market List failure
    case GET_MARKET_LIST_FAILURE:

      return { ...state, loading: false, marketList: [], error: action.payload };

    // Add Market List
    case ADD_MARKET_LIST:
      return { ...state, addLoading: true };

    // set Data Of Add Market List
    case ADD_MARKET_LIST_SUCCESS:
      return { ...state, addMarketList: action.payload, addLoading: false, addError: [] };

    // Display Error for Add Market List failure
    case ADD_MARKET_LIST_FAILURE:
      return { ...state, addLoading: false, addMarketList: [], addError: action.payload };

    // update Market List
    case UPDATE_MARKET_LIST:
      return { ...state, updateLoading: true };

    // set Data Of update Market List
    case UPDATE_MARKET_LIST_SUCCESS:
      return { ...state, updateMarketList: action.payload, updateLoading: false, updateError: [] };

    // Display Error for update Market List failure
    case UPDATE_MARKET_LIST_FAILURE:

      return { ...state, updateLoading: false, updateMarketList: [], updateError: action.payload };

    // delete Market List
    case DELETE_MARKET_LIST:
      return { ...state, loading: true };

    // set Data Of delete Market List
    case DELETE_MARKET_LIST_SUCCESS:
      return { ...state, deleteMarketList: action.payload, loading: false };

    // Display Error for delete Market List failure
    case DELETE_MARKET_LIST_FAILURE:

      return { ...state, loading: false, deleteMarketList: [] };

    default:
      return { ...state };
  }
};
