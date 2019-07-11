// Reducer For Handle Profit List  By Tejas
// import types
import {
  GET_PROFIT_DATA,
  GET_PROFIT_DATA_SUCCESS,
  GET_PROFIT_DATA_FAILURE,
  GET_PROFIT_TOTAL_DATA,
  GET_PROFIT_TOTAL_DATA_SUCCESS,
  GET_PROFIT_TOTAL_DATA_FAILURE,
  GET_WITHDRAW_DATA,
  GET_WITHDRAW_DATA_SUCCESS,
  GET_WITHDRAW_DATA_FAILURE,
  GET_DEPOSIT_DATA,
  GET_DEPOSIT_DATA_SUCCESS,
  GET_DEPOSIT_DATA_FAILURE,
  GET_BUYER_DATA,
  GET_BUYER_DATA_SUCCESS,
  GET_BUYER_DATA_FAILURE,
  GET_SELLER_DATA,
  GET_SELLER_DATA_SUCCESS,
  GET_SELLER_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  profitData: [],
  profitTotalData: [],
  withdrawData: [],
  depositData: [],
  buyerData: [],
  sellerData: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }

  switch (action.type) {

    // get Profit List
    case GET_PROFIT_DATA:
    case GET_PROFIT_TOTAL_DATA:
    case GET_WITHDRAW_DATA:
    case GET_DEPOSIT_DATA:
    case GET_BUYER_DATA:
    case GET_SELLER_DATA:
      return { ...state, loading: true };

    // set Data Of Profit List
    case GET_PROFIT_DATA_SUCCESS:
      return { ...state, profitData: action.payload, loading: false };

    // Display Error for Profit List failure
    case GET_PROFIT_DATA_FAILURE:

      return { ...state, loading: false, profitData: [] };

    // set Data Of Profit List Total
    case GET_PROFIT_TOTAL_DATA_SUCCESS:
      return { ...state, profitTotalData: action.payload, loading: false };

    // Display Error for Profit List Total failure
    case GET_PROFIT_TOTAL_DATA_FAILURE:

      return { ...state, loading: false, profitTotalData: [] };

    // set Data Of withdraw list
    case GET_WITHDRAW_DATA_SUCCESS:
      return { ...state, withdrawData: action.payload, loading: false };

    // Display Error for withdraw list failure
    case GET_WITHDRAW_DATA_FAILURE:

      return { ...state, loading: false, withdrawData: [] };

    // set Data Of Deposit List
    case GET_DEPOSIT_DATA_SUCCESS:
      return { ...state, depositData: action.payload, loading: false };

    // Display Error for Deposit List failure
    case GET_DEPOSIT_DATA_FAILURE:

      return { ...state, loading: false, depositData: [] };

    // set Data Of Buyer List
    case GET_BUYER_DATA_SUCCESS:
      return { ...state, buyerData: action.payload, loading: false };

    // Display Error for Buyer List failure
    case GET_BUYER_DATA_FAILURE:

      return { ...state, loading: false, buyerData: [] };

    // set Data Of Seller LIst
    case GET_SELLER_DATA_SUCCESS:
      return { ...state, sellerData: action.payload, loading: false };

    // Display Error for Seller LIst failure
    case GET_SELLER_DATA_FAILURE:

      return { ...state, loading: false, sellerData: [] };
    default:
      return { ...state };
  }
};
