// Reducers for Get,add and Update Trade Route By : Tejas

// import action types for Trade Route
import {
  GET_TRADE_ROUTE_LIST,
  GET_TRADE_ROUTE_LIST_SUCCESS,
  GET_TRADE_ROUTE_LIST_FAILURE,

  ADD_TRADE_ROUTE_LIST,
  ADD_TRADE_ROUTE_LIST_SUCCESS,
  ADD_TRADE_ROUTE_LIST_FAILURE,

  UPDATE_TRADE_ROUTE_LIST,
  UPDATE_TRADE_ROUTE_LIST_SUCCESS,
  UPDATE_TRADE_ROUTE_LIST_FAILURE,

  GET_ORDER_TYPE_LIST,
  GET_ORDER_TYPE_LIST_SUCCESS,
  GET_ORDER_TYPE_LIST_FAILURE,

  GET_AVAILABLE_ROUTES_LIST,
  GET_AVAILABLE_ROUTES_LIST_SUCCESS,
  GET_AVAILABLE_ROUTES_LIST_FAILURE,
} from "Actions/types";

// set initial state
const INITIAL_STATE = {
  tradeRouteList: [],
  loading: false,
  error: [],
  addTradeRouteList: [],
  updateTradeRouteList: [],
  error: [],
  addError: [],
  updateError: [],
  updateLoading: false,
  addLoading: false,
  orderTypeList: [],
  orderTypeListLoading:false,
  routeList: []
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // get trade route list
    case GET_TRADE_ROUTE_LIST:

      return { ...state, loading: true };

    // set trade route list Success
    case GET_TRADE_ROUTE_LIST_SUCCESS:

      return { ...state, loading: false, tradeRouteList: action.payload, error: [] };

    // set trade route list failure
    case GET_TRADE_ROUTE_LIST_FAILURE:

      return { ...state, loading: false, tradeRouteList: [], error: action.payload };

    // add trade route list
    case ADD_TRADE_ROUTE_LIST:

      return { ...state, addLoading: true };
    // add trade route list Success
    case ADD_TRADE_ROUTE_LIST_SUCCESS:

      return { ...state, addLoading: false, addTradeRouteList: action.payload, addError: [] };
    // set trade route list failure
    case ADD_TRADE_ROUTE_LIST_FAILURE:

      return { ...state, addLoading: false, addTradeRouteList: [], addError: action.payload };

    // update trade route list
    case UPDATE_TRADE_ROUTE_LIST:

      return { ...state, updateLoading: true };

    // update trade route list Success
    case UPDATE_TRADE_ROUTE_LIST_SUCCESS:

      return { ...state, updateLoading: false, updateTradeRouteList: action.payload, updateError: [] };

    // update  trade route list failure
    case UPDATE_TRADE_ROUTE_LIST_FAILURE:

      return { ...state, updateLoading: false, updateTradeRouteList: [], updateError: action.payload };

    // get order types list
    case GET_ORDER_TYPE_LIST:

      return { ...state, orderTypeListLoading:true };
    // get order types list success
    case GET_ORDER_TYPE_LIST_SUCCESS:

      return { ...state,  orderTypeListLoading: false, orderTypeList: action.payload, error: [] };
    // get order types list failure
    case GET_ORDER_TYPE_LIST_FAILURE:

      return { ...state, orderTypeListLoading: false, orderTypeList: [], error: action.payload };

    // get available routes list
    case GET_AVAILABLE_ROUTES_LIST:

      return { ...state, routeListLoading: true };

    // get available routes list success
    case GET_AVAILABLE_ROUTES_LIST_SUCCESS:

      return { ...state, routeListLoading: false, routeList: action.payload, error: [] };

    // get available routes list failure
    case GET_AVAILABLE_ROUTES_LIST_FAILURE:

      return { ...state, routeListLoading: false, routeList: [], error: action.payload };

    default:
      return { ...state };
  }
};
