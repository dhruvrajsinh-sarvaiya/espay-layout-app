// Reducer For Handle Provider Configuration By Tejas
// import types
import {
  GET_PROVIDER_CONFIGURATION_LIST,
  GET_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  GET_PROVIDER_CONFIGURATION_LIST_FAILURE,
  ADD_PROVIDER_CONFIGURATION_LIST,
  ADD_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  ADD_PROVIDER_CONFIGURATION_LIST_FAILURE,
  UPDATE_PROVIDER_CONFIGURATION_LIST,
  UPDATE_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  UPDATE_PROVIDER_CONFIGURATION_LIST_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  providerConfigurationList: [],
  addProviderConfiguration: [],
  updateProviderConfiguration: [],
  loading: false,
  error: [],
  addError: [],
  updateError: [],
  updateLoading: false,
  addLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Market List
    case GET_PROVIDER_CONFIGURATION_LIST:
      return { ...state, loading: true };

    // set Data Of Market List
    case GET_PROVIDER_CONFIGURATION_LIST_SUCCESS:
      return { ...state, providerConfigurationList: action.payload, loading: false, error: [] };

    // Display Error for Market List failure
    case GET_PROVIDER_CONFIGURATION_LIST_FAILURE:
      
      return { ...state, loading: false, providerConfigurationList: [], error: action.payload };

    // Add Market List
    case ADD_PROVIDER_CONFIGURATION_LIST:
      return { ...state, addLoading: true };

    // set Data Of Add Market List
    case ADD_PROVIDER_CONFIGURATION_LIST_SUCCESS:
      return { ...state, addProviderConfiguration: action.payload, addLoading: false, addError: [] };

    // Display Error for Add Market List failure
    case ADD_PROVIDER_CONFIGURATION_LIST_FAILURE:
      return { ...state, addLoading: false, addProviderConfiguration: [], addError: action.payload };

    // update Market List
    case UPDATE_PROVIDER_CONFIGURATION_LIST:
      return { ...state, updateLoading: true };

    // set Data Of update Market List
    case UPDATE_PROVIDER_CONFIGURATION_LIST_SUCCESS:
      return { ...state, updateProviderConfiguration: action.payload, updateLoading: false, updateError: [] };

    // Display Error for update Market List failure
    case UPDATE_PROVIDER_CONFIGURATION_LIST_FAILURE:

      return { ...state, updateLoading: false, updateProviderConfiguration: [], updateError: action.payload };


    default:
      return { ...state };
  }
};
