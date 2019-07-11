// Actions For Profit Data By Tejas

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
  
  //action for Profit Data List and set type for reducers
  export const getProfitDataList = Data => ({
    type: GET_PROFIT_DATA,
    payload: { Data }
  });
  
  //action for set Success and Profit Data List and set type for reducers
  export const getProfitDataListSuccess = response => ({
    type: GET_PROFIT_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Profit Data List and set type for reducers
  export const getProfitDataListFailure = error => ({
    type: GET_PROFIT_DATA_FAILURE,
    payload: error.message
  });
  
  //action for Profit Data Total List and set type for reducers
  export const getProfitTotalData = Data => ({
    type: GET_PROFIT_TOTAL_DATA,
    payload: { Data }
  });
  
  //action for set Success and Profit Data Total List and set type for reducers
  export const getProfitTotalDataSuccess = response => ({
    type: GET_PROFIT_TOTAL_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Profit Data Total List and set type for reducers
  export const getProfitTotalDataFailure = error => ({
    type: GET_PROFIT_TOTAL_DATA_FAILURE,
    payload: error.message
  });


  //action for Withdraw List and set type for reducers
  export const getWithdrawDataList = Data => ({
    type: GET_WITHDRAW_DATA,
    payload: { Data }
  });
  
  //action for set Success and Withdraw List and set type for reducers
  export const getWithdrawDataListSuccess = response => ({
    type: GET_WITHDRAW_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Withdraw List and set type for reducers
  export const getWithdrawDataListFailure = error => ({
    type: GET_WITHDRAW_DATA_FAILURE,
    payload: error.message
  });


  //action for Deposit List and set type for reducers
  export const getDepositDataList = Data => ({
    type: GET_DEPOSIT_DATA,
    payload: { Data }
  });
  
  //action for set Success and Deposit List and set type for reducers
  export const getDepositDataListSuccess = response => ({
    type: GET_DEPOSIT_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Deposit List and set type for reducers
  export const getDepositDataListFailure = error => ({
    type: GET_DEPOSIT_DATA_FAILURE,
    payload: error.message
  });

  //action for Buyer List and set type for reducers
  export const getBuyerDataList = Data => ({
    type: GET_BUYER_DATA,
    payload: { Data }
  });
  
  //action for set Success and Buyer List and set type for reducers
  export const getBuyerDataListSuccess = response => ({
    type: GET_BUYER_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Buyer List and set type for reducers
  export const getBuyerDataListFailure = error => ({
    type: GET_BUYER_DATA_FAILURE,
    payload: error.message
  });

  //action for Seller List and set type for reducers
  export const getSellerDataList = Data => ({
    type: GET_SELLER_DATA,
    payload: { Data }
  });
  
  //action for set Success and Seller List and set type for reducers
  export const getSellerDataListSuccess = response => ({
    type: GET_SELLER_DATA_SUCCESS,
    payload: response.data
  });
  
  //action for set failure and error to Seller List and set type for reducers
  export const getSellerDataListFailure = error => ({
    type: GET_SELLER_DATA_FAILURE,
    payload: error.message
  });
