import {
  GET_TRADING_FEES,
  GET_TRADING_FEES_SUCCESS,
  GET_TRADING_FEES_FAILURE,
  UPDATE_TRADING_FEES,
  UPDATE_TRADING_FEES_SUCCESS,
  UPDATE_TRADING_FEES_FAILURE,
  ADD_TRADING_FEES,
  ADD_TRADING_FEES_SUCCESS,
  ADD_TRADING_FEES_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  tradingFees: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TRADING_FEES:
      return { ...state, Loading: true };

    case GET_TRADING_FEES_SUCCESS:
      return {
        ...state,
        Loading: false,
        tradingFees: action.payload
      };

    case GET_TRADING_FEES_FAILURE:
      return { ...state, Loading: false };

    case UPDATE_TRADING_FEES:
      return { ...state, loading: true, success: action.payload };

    case UPDATE_TRADING_FEES_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case UPDATE_TRADING_FEES_FAILURE:
      return { ...state, loading: false };

    case ADD_TRADING_FEES:
      return { ...state, loading: true, success: action.payload };

    case ADD_TRADING_FEES_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case ADD_TRADING_FEES_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
