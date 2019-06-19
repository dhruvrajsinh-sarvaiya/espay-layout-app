/**
 * Auther : Nirmit Waghela
 * Created : 04/10/2018
 * Settled Orders Reducers
 */
import { NotificationManager } from "react-notifications";

// import neccessary actions types
import {
  SETTLED_ORDERS,
  SETTLED_ORDERS_SUCCESS,
  SETTLED_ORDERS_FAILURE,
  SETTLED_ORDERS_REFRESH
} from "Actions/types";

// define intital state for settled orders list
const INIT_STATE = {
  loading: false,
  settledOrdersList: [],
  error: []
};

// this export is used to handle action types and its function based on Word which is define in
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SETTLED_ORDERS:
      return { ...state, loading: true };

    case SETTLED_ORDERS_REFRESH:
      return { ...state, loading: true, settledOrdersList: [] };

    case SETTLED_ORDERS_SUCCESS:

      return { ...state, loading: false, settledOrdersList: action.payload, error: [] };

    case SETTLED_ORDERS_FAILURE:

      return { ...state, loading: false, settledOrdersList: [], error: action.payload };

    default:
      return { ...state };
  }
};
