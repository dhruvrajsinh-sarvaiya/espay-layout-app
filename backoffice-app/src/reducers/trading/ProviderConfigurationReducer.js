// Reducer For Handle Provider Configuration 
// import types
import {
  //provider configuration list 
  GET_PROVIDER_CONFIGURATION_LIST,
  GET_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  GET_PROVIDER_CONFIGURATION_LIST_FAILURE,

  //add provider configuration
  ADD_PROVIDER_CONFIGURATION_LIST,
  ADD_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  ADD_PROVIDER_CONFIGURATION_LIST_FAILURE,

  //update provider configuration
  UPDATE_PROVIDER_CONFIGURATION_LIST,
  UPDATE_PROVIDER_CONFIGURATION_LIST_SUCCESS,
  UPDATE_PROVIDER_CONFIGURATION_LIST_FAILURE,

  //clear data
  CLEAR_PROVIDER_CONFIGURATION,
  CLEAR_PROVIDER_CONFIGURATION_LIST_DATA,
  ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Set Initial State
const INITIAL_STATE = {
  //provider configuration list 
  loading: false,
  providerConfigurationList: null,

  //add provider configuration
  addProviderConfiguration: null,
  isAddProviderConfig: false,

  //update provider configuration
  updateProviderConfiguration: null,
  isUpdateProviderConfig: false,
}

export default (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return INITIAL_STATE

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return INITIAL_STATE

    // To reset initial state on clear data
    case CLEAR_PROVIDER_CONFIGURATION_LIST_DATA:
      return INITIAL_STATE

    // get provider configuration list 
    case GET_PROVIDER_CONFIGURATION_LIST:
      return Object.assign({}, state, { loading: true })
    // set Data provider configuration list 
    case GET_PROVIDER_CONFIGURATION_LIST_SUCCESS:
      return Object.assign({}, state, { providerConfigurationList: action.payload, loading: false })
    // Display Error provider configuration list  failure
    case GET_PROVIDER_CONFIGURATION_LIST_FAILURE:
      return Object.assign({}, state, { loading: false, providerConfigurationList: null })

    // Add provider configuration 
    case ADD_PROVIDER_CONFIGURATION_LIST:
      return Object.assign({}, state, { addLoading: true })
    // set Data Of Add provider configuration
    case ADD_PROVIDER_CONFIGURATION_LIST_SUCCESS:
      return Object.assign({}, state, { addProviderConfiguration: action.payload, addLoading: false, addError: [] })
    // Display Error for Add provider configuration failure
    case ADD_PROVIDER_CONFIGURATION_LIST_FAILURE:
      return Object.assign({}, state, { addLoading: false, addProviderConfiguration: null, addError: action.payload })

    // update provider configuration 
    case UPDATE_PROVIDER_CONFIGURATION_LIST:
      return Object.assign({}, state, { updateLoading: true })
    // set Data Of update provider configuration
    case UPDATE_PROVIDER_CONFIGURATION_LIST_SUCCESS:
      return Object.assign({}, state, { updateProviderConfiguration: action.payload, updateLoading: false })
    // Display Error for update provider configuration failure
    case UPDATE_PROVIDER_CONFIGURATION_LIST_FAILURE:
      return Object.assign({}, state, { updateLoading: false, updateProviderConfiguration: null })

    //clear update provider configuration and add provider configuration
    case CLEAR_PROVIDER_CONFIGURATION:
      return Object.assign({}, state, { updateProviderConfiguration: null, addProviderConfiguration: null })

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
