/**
 * Auther : Nirmit Waghela
 * Created : 04/10/2018
 * Open Orders Reducers
 */

// import neccessary actions types
import {
  OPEN_ORDERS,
  OPEN_ORDERS_SUCCESS,
  OPEN_ORDERS_FAILURE,
  OPEN_ORDERS_REFRESH
} from "Actions/types";

// define intital state for open orders list
const INIT_STATE = {
  loading: false,
  openOrdersList: [],
  error: []
};

// this export is used to handle action types and its function based on Word which is define in
export default (state, action) => {
  if (typeof state === 'undefined') {
      return INIT_STATE
  }
  switch (action.type) {
    case OPEN_ORDERS:
      return { ...state, loading: true };

    case OPEN_ORDERS_REFRESH:
      return { ...state, loading: true, openOrdersList: [] };

    case OPEN_ORDERS_SUCCESS:
      return { ...state, loading: false, openOrdersList: action.payload, error: [] };

    case OPEN_ORDERS_FAILURE:
      return { ...state, loading: false, openOrdersList: [], error: action.payload };

    default:
      return { ...state };
  }
};
