// Actions For Expense Data By Tejas

// import types
import {
    GET_EXPENSE_DATA,
    GET_EXPENSE_DATA_SUCCESS,
    GET_EXPENSE_DATA_FAILURE
  } from "Actions/types";
  
  //action for Expense Data List and set type for reducers
  export const getExpenseDataList = Data => ({
    type: GET_EXPENSE_DATA,
    payload: { Data }
  });
  
  //action for set Success and Expense Data List and set type for reducers
  export const getExpenseDataListSuccess = response => ({
    type: GET_EXPENSE_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Expense Data List and set type for reducers
  export const getExpenseDataListFailure = error => ({
    type: GET_EXPENSE_DATA_FAILURE,
    payload: error.message
  });
  