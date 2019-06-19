// Reducer For Handle Expense List  By Tejas
// import types
import {
  GET_EXPENSE_DATA,
  GET_EXPENSE_DATA_SUCCESS,
  GET_EXPENSE_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  expenseData: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // get Expense List
    case GET_EXPENSE_DATA:
      return { ...state, loading: true };

    // set Data Of Expense List
    case GET_EXPENSE_DATA_SUCCESS:
      return { ...state, expenseData: action.payload, loading: false };

    // Display Error for Expense List failure
    case GET_EXPENSE_DATA_FAILURE:

      return { ...state, loading: false, expenseData: [] };

    default:
      return { ...state };
  }
};
