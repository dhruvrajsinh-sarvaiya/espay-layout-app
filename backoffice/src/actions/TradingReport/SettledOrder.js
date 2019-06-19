/**
 * Auther : Nirmit
 * Created : 04/10/2018
 * settled Orders Actions
 */

// import neccessary action types
import {
  SETTLED_ORDERS,
  SETTLED_ORDERS_SUCCESS,
  SETTLED_ORDERS_FAILURE,
  SETTLED_ORDERS_REFRESH
} from "../types";

/**
 * Use: used to handle settled order action type
 * Input: settled order Request
 * Request contain start date, end date, order type,status
 */
export const settledOrders = settledOrdersRequest => ({
  type: SETTLED_ORDERS,
  payload: { settledOrdersRequest }
});

/**
 * Use: used to handle settled order success action type
 * Input: settled order List or response from API or sagas
 */
export const settledOrdersSuccess = response => ({
  type: SETTLED_ORDERS_SUCCESS,
  payload: response.Response
});

/**
 * Use: used to handle settled Orders success action type
 * Input: settled Orders List Error  or response from API or sagas
 */
export const settledOrdersFailure = error => ({
  type: SETTLED_ORDERS_FAILURE,
  payload: error
});

/**
 * Use: used to handle settled orders success action type
 * Input: settled Orders Request Error  or response from API or sagas
 * Request contain start date, end date, order type,status
 */
export const settleOrdersRefresh = settledOrdersRequest => ({
  type: SETTLED_ORDERS_REFRESH,
  payload: { settledOrdersRequest }
});
