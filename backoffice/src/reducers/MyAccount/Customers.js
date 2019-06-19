/**
 * Reset Password Reducer
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

  //For Edit Customers
  ADD_CUSTOMERS,
  ADD_CUSTOMERS_SUCCESS,
  ADD_CUSTOMERS_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  displayCustomersData: [],
  data: {},
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Display Customers
    case DISPALY_CUSTOMERS:
      return { ...state, loading: true };

    case DISPALY_CUSTOMERS_SUCCESS:
      return { ...state, loading: false, displayCustomersData: action.payload };

    case DISPALY_CUSTOMERS_FAILURE:
      return { ...state, loading: false };

    //For Delete Customers
    case DELETE_CUSTOMERS:
      return { ...state, loading: true };

    case DELETE_CUSTOMERS_SUCCESS:
      return { ...state, loading: false, displayCustomersData: action.payload };

    case DELETE_CUSTOMERS_FAILURE:
      return { ...state, loading: false };

    //For Add Customers
    case ADD_CUSTOMERS:
      return { ...state, loading: true, data: {} };

    case ADD_CUSTOMERS_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case ADD_CUSTOMERS_FAILURE:
      return { ...state, loading: false, data: action.payload };

    //For Edit Customers
    case EDIT_CUSTOMERS:
      return { ...state, loading: true };

    case EDIT_CUSTOMERS_SUCCESS:
      return { ...state, loading: false, displayCustomersData: action.payload };

    case EDIT_CUSTOMERS_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
