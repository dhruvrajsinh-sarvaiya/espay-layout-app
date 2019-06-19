/**
 * Added By Devang Parekh
 * reducer for handle pair configuration events or actions
 * used to pass data between component to saga and saga to component
 *
 */

import {
  GET_PAIR_CONFIGURATION_LIST,
  GET_PAIR_CONFIGURATION_LIST_SUCCESS,
  GET_PAIR_CONFIGURATION_LIST_FAILURE,
  GET_MARKET_CURRENCY,
  GET_MARKET_CURRENCY_SUCCESS,
  GET_MARKET_CURRENCY_FAILURE,
  GET_PAIR_CURRENCY,
  GET_PAIR_CURRENCY_SUCCESS,
  GET_PAIR_CURRENCY_FAILURE,
  GET_EXCHANGE_LIST,
  GET_EXCHANGE_LIST_SUCCESS,
  GET_EXCHANGE_LIST_FAILURE,
  ADD_PAIR_CONFIGURATION,
  ADD_PAIR_CONFIGURATION_SUCCESS,
  ADD_PAIR_CONFIGURATION_FAILURE,
  EDIT_PAIR_CONFIGURATION,
  EDIT_PAIR_CONFIGURATION_SUCCESS,
  EDIT_PAIR_CONFIGURATION_FAILURE,
  DELETE_PAIR_CONFIGURATION,
  DELETE_PAIR_CONFIGURATION_SUCCESS,
  DELETE_PAIR_CONFIGURATION_FAILURE
} from "Actions/types";

import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";

const INITIAL_STATE = {
  pairConfigurationList: [],
  loading: false,
  marketCurrencyList: [],
  marketCurrencyLoading:false,
  pairCurrencyLoading:false,
  pairCurrencyList: [],
  exchangeList: [],
  success: 0,
  error: [],
  addPairSuccess: [],
  editPairSuccess: [],
  updateLoading: false,
  addLoading: false,
  addError: [],
  updateError: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PAIR_CONFIGURATION_LIST:
      return { ...state, loading: true };

    case GET_PAIR_CONFIGURATION_LIST_SUCCESS:
      // notification
      return {
        ...state,
        pairConfigurationList: action.payload,
        loading: false,
        isPairListFound: 1,
        error: [],
      };

    case GET_PAIR_CONFIGURATION_LIST_FAILURE:
      return { ...state, pairConfigurationList: [], error: action.payload, loading: false, isPairListFound: 0 };

    case GET_MARKET_CURRENCY:
      return { ...state, marketCurrencyList: [], pairConfigurationList: [], error: [],marketCurrencyLoading:true };

    case GET_MARKET_CURRENCY_SUCCESS:
      return { ...state, marketCurrencyList: action.payload, pairConfigurationList: [], error: [],marketCurrencyLoading:false };

    case GET_MARKET_CURRENCY_FAILURE:

      return { ...state, marketCurrencyList: [], pairConfigurationList: [], error: [],marketCurrencyLoading:false };

    case GET_PAIR_CURRENCY:
      return { ...state, pairCurrencyList: [], pairConfigurationList: [], error: [],pairCurrencyLoading :true };

    case GET_PAIR_CURRENCY_SUCCESS:
      return { ...state, pairCurrencyList: action.payload, pairConfigurationList: [], error: [], pairCurrencyLoading :false };

    case GET_PAIR_CURRENCY_FAILURE:

      return { ...state, pairCurrencyList: [], pairConfigurationList: [], error: [],pairCurrencyLoading:false };

    case GET_EXCHANGE_LIST:
      return { ...state, exchangeList: [] };

    case GET_EXCHANGE_LIST_SUCCESS:
      return { ...state, exchangeList: action.payload };

    case GET_EXCHANGE_LIST_FAILURE:
      // notification
      NotificationManager.error(
        <IntlMessages id="sidebar.pairConfiguration.exchangeListFail" />
      );
      return { ...state, exchangeList: [] };

    case ADD_PAIR_CONFIGURATION:
      // notification
      return { ...state, pairConfigurationList: [], addPairSuccess: [], addLoading: true, addError: [] };

    case ADD_PAIR_CONFIGURATION_SUCCESS:
      // notification

      return { ...state, addPairSuccess: action.payload, addLoading: false, pairConfigurationList: [], addError: [] };

    case ADD_PAIR_CONFIGURATION_FAILURE:
      // notification      
      return { ...state, addPairSuccess: [], addLoading: false, pairConfigurationList: [], addError: action.payload };

    case EDIT_PAIR_CONFIGURATION:
      // notification
      return { ...state, updateLoading: true, pairConfigurationList: [], updateError: [], editPairSuccess: [] };

    case EDIT_PAIR_CONFIGURATION_SUCCESS:

      return { ...state, editPairSuccess: action.payload, updateLoading: false, pairConfigurationList: [], updateError: [] };

    case EDIT_PAIR_CONFIGURATION_FAILURE:

      return { ...state, editPairSuccess: [], updateLoading: false, pairConfigurationList: [], updateError: action.payload };

    case DELETE_PAIR_CONFIGURATION:
      // notification
      return { ...state, loading: true, pairConfigurationList: [], error: [] };

    case DELETE_PAIR_CONFIGURATION_SUCCESS:
      return { ...state, deletePairSuccess: 1, loading: false, pairConfigurationList: [], error: [] };

    case DELETE_PAIR_CONFIGURATION_FAILURE:

      return { ...state, deletePairSuccess: 0, loading: false, pairConfigurationList: [], error: [] };

    default:
      return { ...state };
  }
};
