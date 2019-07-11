// Reducer For Handle Api ConfigurationBy Tejas
// import types
import {
  GET_CONFIGURATION_LIST,
  GET_CONFIGURATION_LIST_SUCCESS,
  GET_CONFIGURATION_LIST_FAILURE,
  GET_PROVIDER_DATA_LIST,
  GET_PROVIDER_DATA_LIST_SUCCESS,
  GET_PROVIDER_DATA_LIST_FAILURE,
  ADD_CONFIGURATION_LIST,
  ADD_CONFIGURATION_LIST_SUCCESS,
  ADD_CONFIGURATION_LIST_FAILURE,
  UPDATE_CONFIGURATION_LIST,
  UPDATE_CONFIGURATION_LIST_SUCCESS,
  UPDATE_CONFIGURATION_LIST_FAILURE,
  DELETE_CONFIGURATION_LIST,
  DELETE_CONFIGURATION_LIST_SUCCESS,
  DELETE_CONFIGURATION_LIST_FAILURE
} from "Actions/types";

import { NotificationManager } from "react-notifications";

// Set Initial State
const INITIAL_STATE = {
  configurationList: [],
  providerList: [],
  addConfigurationList: [],
  updateConfigurationList: [],
  deleteConfigurationList: [],
  loading: false
};


export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    // get configuration List
    case GET_CONFIGURATION_LIST:
      return { ...state, loading: true };

    // set Data Of configuration List
    case GET_CONFIGURATION_LIST_SUCCESS:
      return { ...state, configurationList: action.payload, loading: false };

    // Display Error for configuration List failure
    case GET_CONFIGURATION_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, configurationList: [] };

    // Add configuration List
    case ADD_CONFIGURATION_LIST:
      return { ...state, loading: true };

    // set Data Of Add configuration List
    case ADD_CONFIGURATION_LIST_SUCCESS:
      return { ...state, addConfigurationList: action.payload, loading: false };

    // Display Error for Add configuration List failure
    case ADD_CONFIGURATION_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, addConfigurationList: [] };

    // update configuration List
    case UPDATE_CONFIGURATION_LIST:
      return { ...state, loading: true };

    // set Data Of update configuration List
    case UPDATE_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        updateConfigurationList: action.payload,
        loading: false
      };

    // Display Error for update configuration List failure
    case UPDATE_CONFIGURATION_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, updateConfigurationList: [] };

    // delete configuration List
    case DELETE_CONFIGURATION_LIST:
      return { ...state, loading: true };

    // set Data Of delete configuration List
    case DELETE_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        deleteConfigurationList: action.payload,
        loading: false
      };

    // Display Error for delete configuration List failure
    case DELETE_CONFIGURATION_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, deleteConfigurationList: [] };

    // Get Provider and Currency Detail
    case GET_PROVIDER_DATA_LIST:
      return { ...state, loading: true };

    // set Data Of Provider and Currency Detail
    case GET_PROVIDER_DATA_LIST_SUCCESS:
      return { ...state, providerList: action.payload, loading: false };

    // Display Error for Provider and Currency Detail failure
    case GET_PROVIDER_DATA_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, providerList: [] };

    default:
      return { ...state };
  }
};
