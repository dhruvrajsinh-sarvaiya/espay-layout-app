/**
 * Added By Devang Parekh
 * reducer for handle pair configuration events or actions
 * used to pass data between component to saga and saga to component
 * for api conf. for address generation
 */

import {
  GET_API_CONF_ADD_GEN_LIST,
  GET_API_CONF_ADD_GEN_LIST_SUCCESS,
  GET_API_CONF_ADD_GEN_LIST_FAILURE,
  GET_CURRENCY,
  GET_CURRENCY_SUCCESS,
  GET_CURRENCY_FAILURE,
  GET_API_PROVIDER,
  GET_API_PROVIDER_SUCCESS,
  GET_API_PROVIDER_FAILURE,
  GET_CALLBACK_LIST,
  GET_CALLBACK_LIST_SUCCESS,
  GET_CALLBACK_LIST_FAILURE,
  ADD_API_CONF_ADD_GEN,
  ADD_API_CONF_ADD_GEN_SUCCESS,
  ADD_API_CONF_ADD_GEN_FAILURE,
  EDIT_API_CONF_ADD_GEN,
  EDIT_API_CONF_ADD_GEN_SUCCESS,
  EDIT_API_CONF_ADD_GEN_FAILURE,
  DELETE_API_CONF_ADD_GEN,
  DELETE_API_CONF_ADD_GEN_SUCCESS,
  DELETE_API_CONF_ADD_GEN_FAILURE
} from "Actions/types";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
const INITIAL_STATE = {
  apiConfAddGenList: [],
  loading: false,
  currencyList: [],
  apiProviderList: [],
  callbackList: [],
  success: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_API_CONF_ADD_GEN_LIST:
      return { apiConfAddGenList: [], loading: true };

    case GET_API_CONF_ADD_GEN_LIST_SUCCESS:
      // notification
      return {
        apiConfAddGenList: action.payload,
        loading: false,
        isConfAddGenListFound: 1
      };

    case GET_API_CONF_ADD_GEN_LIST_FAILURE:
      // notification
      NotificationManager.error(
        <IntlMessages id="sidebar.apiConfAddGen.apiConfAddGenListFail" />
      );
      return {
        apiConfAddGenList: [],
        loading: false,
        isConfAddGenListFound: 0
      };

    case GET_CURRENCY:
      return { currencyList: [], loading: false };

    case GET_CURRENCY_SUCCESS:
      return { currencyList: action.payload };

    case GET_CURRENCY_FAILURE:
      // notifiction
      NotificationManager.error(
        <IntlMessages id="sidebar.apiConfAddGen.marketCurrencyFail" />
      );
      return { currencyList: [] };

    case GET_API_PROVIDER:
      return { apiProviderList: [] };

    case GET_API_PROVIDER_SUCCESS:
      return { apiProviderList: action.payload };

    case GET_API_PROVIDER_FAILURE:
      // notification
      NotificationManager.error(
        <IntlMessages id="sidebar.apiConfAddGen.pairCurrencyFail" />
      );
      return { apiProviderList: [] };

    case GET_CALLBACK_LIST:
      return { callbackList: [] };

    case GET_CALLBACK_LIST_SUCCESS:
      return { callbackList: action.payload };

    case GET_CALLBACK_LIST_FAILURE:
      // notification
      NotificationManager.error(
        <IntlMessages id="sidebar.apiConfAddGen.callbackListFail" />
      );
      return { callbackList: [] };

    case ADD_API_CONF_ADD_GEN:
      // notification
      return { loading: true };

    case ADD_API_CONF_ADD_GEN_SUCCESS:
      // notification
      NotificationManager.success(action.payload.message);
      return { addApiConfSuccess: 1, loading: false };

    case ADD_API_CONF_ADD_GEN_FAILURE:
      // notification
      NotificationManager.error(action.payload.message);
      return { addApiConfSuccess: action.payload.status, loading: false };

    case EDIT_API_CONF_ADD_GEN:
      // notification
      return { loading: true };

    case EDIT_API_CONF_ADD_GEN_SUCCESS:
      // notification
      NotificationManager.success(action.payload.message);
      return { editApiConfSuccess: 1, loading: false };

    case EDIT_API_CONF_ADD_GEN_FAILURE:
      // notification
      NotificationManager.error(action.payload.message);
      return { editApiConfSuccess: 0, loading: false };

    case DELETE_API_CONF_ADD_GEN:
      // notification
      return { loading: true };

    case DELETE_API_CONF_ADD_GEN_SUCCESS:
      // notification
      NotificationManager.success(action.payload.message);
      return { deleteApiConfSuccess: 1, loading: false };

    case DELETE_API_CONF_ADD_GEN_FAILURE:
      // notification
      NotificationManager.error(action.payload.message);
      return { deleteApiConfSuccess: 0, loading: false };

    default:
      return { ...state };
  }
};
