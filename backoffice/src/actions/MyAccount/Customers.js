/**
 * Display Customers Actions
 */
import {
  //For Display Customers
  DISPALY_CUSTOMERS,
  DISPALY_CUSTOMERS_SUCCESS,
  DISPALY_CUSTOMERS_FAILURE,

  //For Delete Customers
  DELETE_CUSTOMERS,
  DELETE_CUSTOMERS_SUCCESS,
  DELETE_CUSTOMERS_FAILURE,

  //For Edit Customers
  EDIT_CUSTOMERS,
  EDIT_CUSTOMERS_SUCCESS,
  EDIT_CUSTOMERS_FAILURE,

  //For Add Customers
  ADD_CUSTOMERS,
  ADD_CUSTOMERS_SUCCESS,
  ADD_CUSTOMERS_FAILURE
} from "../types";

//For Display Customers
/**
 * Redux Action To Display Customers
 */

export const displayCustomers = () => ({
  type: DISPALY_CUSTOMERS
});

/**
 * Redux Action To Display Customers Success
 */
export const displayCustomersSuccess = response => ({
  type: DISPALY_CUSTOMERS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Display Customers Failure
 */
export const displayCustomersFailure = error => ({
  type: DISPALY_CUSTOMERS_FAILURE,
  payload: error
});

//For Delete Customers
/**
 * Redux Action To Delete Customers
 */
export const deleteCustomers = user => ({
  type: DELETE_CUSTOMERS,
  payload: user
});

/**
 * Redux Action To Delete Customers Success
 */
export const deleteCustomersSuccess = response => ({
  type: DELETE_CUSTOMERS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Delete Customers Failure
 */
export const deleteCustomersFailure = error => ({
  type: DELETE_CUSTOMERS_FAILURE,
  payload: error
});

//For Add Customers
/**
 * Redux Action To Add Customers
 */
export const addCustomers = user => ({
  type: ADD_CUSTOMERS,
  payload: user
});

/**
 * Redux Action To Add Customers Success
 */
export const addCustomersSuccess = data => ({
  type: ADD_CUSTOMERS_SUCCESS,
  payload: data
});

/**
 * Redux Action To Add Customers Failure
 */
export const addCustomersFailure = error => ({
  type: ADD_CUSTOMERS_FAILURE,
  payload: error
});

//For Edit Customers
/**
 * Redux Action To Edit Customers
 */
export const editCustomers = user => ({
  type: EDIT_CUSTOMERS,
  payload: user
});

/**
 * Redux Action To Edit Customers Success
 */
export const editCustomersSuccess = data => ({
  type: EDIT_CUSTOMERS_SUCCESS,
  payload: data
});

/**
 * Redux Action To Edit Customers Failure
 */
export const editCustomersFailure = error => ({
  type: EDIT_CUSTOMERS_FAILURE,
  payload: error
});
