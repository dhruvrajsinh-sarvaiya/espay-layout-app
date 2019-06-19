// Reducer For Handle Liquidity Manager   By Tejas
// import types
import {
  GET_LIQUIDITY_API_MANAGER_LIST,
  GET_LIQUIDITY_API_MANAGER_SUCCESS,
  GET_LIQUIDITY_API_MANAGER_FAILURE,
  ADD_LIQUIDITY_API_MANAGER_LIST,
  ADD_LIQUIDITY_API_MANAGER_SUCCESS,
  ADD_LIQUIDITY_API_MANAGER_FAILURE,
  UPDATE_LIQUIDITY_API_MANAGER_LIST,
  UPDATE_LIQUIDITY_API_MANAGER_SUCCESS,
  UPDATE_LIQUIDITY_API_MANAGER_FAILURE,
  GET_LIQUIDITY_PROVIDER_LIST,
  GET_LIQUIDITY_PROVIDER_SUCCESS,
  GET_LIQUIDITY_PROVIDER_FAILURE,
  ADD_LIQUIDITY_PROVIDER_LIST,
  ADD_LIQUIDITY_PROVIDER_SUCCESS,
  ADD_LIQUIDITY_PROVIDER_FAILURE,
  UPDATE_LIQUIDITY_PROVIDER_LIST,
  UPDATE_LIQUIDITY_PROVIDER_SUCCESS,
  UPDATE_LIQUIDITY_PROVIDER_FAILURE,
  DELETE_LIQUIDITY_PROVIDER_LIST,
  DELETE_LIQUIDITY_PROVIDER_SUCCESS,
  DELETE_LIQUIDITY_PROVIDER_FAILURE,
  GET_LIMIT_DATA,
  GET_LIMIT_DATA_SUCCESS,
  GET_LIMIT_DATA_FAILURE,
  GET_SERVICE_PROVIDER,
  GET_SERVICE_PROVIDER_SUCCESS,
  GET_SERVICE_PROVIDER_FAILURE,
  GET_PROVIDERS_LIST,
  GET_PROVIDERS_LIST_SUCCESS,
  GET_PROVIDERS_LIST_FAILURE,
  GET_SERVICE_CONFIG,
  GET_SERVICE_CONFIG_SUCCESS,
  GET_SERVICE_CONFIG_FAILURE,
  GET_PROVIDER_TYPE,
  GET_PROVIDER_TYPE_SUCCESS,
  GET_PROVIDER_TYPE_FAILURE,
  GET_DAEMON_CONFIG,
  GET_DAEMON_CONFIG_SUCCESS,
  GET_DAEMON_CONFIG_FAILURE,
  GET_TRANSACTION_TYPE,
  GET_TRANSACTION_TYPE_SUCCESS,
  GET_TRANSACTION_TYPE_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  liquidityApiList: [],
  addliquidityApiList: [],
  updateliquidityApiList: [],
  liquidityProviderList: [],
  addliquidityProviderList: [],
  updateliquidityProviderList: [],
  deleteliquidityProviderList: [],
  loading: false,
  addLoading: false,
  updateLoading: false,
  error: [],
  addError: [],
  updateError: [],
  providersList: [],
  providersLoading: false,
  limitData: [],
  limitDataLoading:false,
  serviceProvider: [],
  serviceProviderLoading: false,
  serviceConfiguration: [],
  serviceConfigurationLoading:false,
  providerType: [],
  providerTypeLoading:false,
  daemonConfigList: [],
  daemonConfigListLoading:false,
  transactionTypeList: [],
  transactionTypeListLoading:false
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    // get Liquidity Manager List
    case GET_LIQUIDITY_API_MANAGER_LIST:
      return { ...state, loading: true };

    // set Data Of Liquidity Manager List
    case GET_LIQUIDITY_API_MANAGER_SUCCESS:
      return { ...state, liquidityApiList: action.payload, loading: false, error: [] };

    // Display Error for Liquidity Manager List failure
    case GET_LIQUIDITY_API_MANAGER_FAILURE:
      return { ...state, loading: false, liquidityApiList: [], error: action.payload };

    // add Liquidity Manager List
    case ADD_LIQUIDITY_API_MANAGER_LIST:
      return { ...state, addLoading: true };

    // set Data Of add Liquidity Manager List
    case ADD_LIQUIDITY_API_MANAGER_SUCCESS:
      return { ...state, addliquidityApiList: action.payload, addLoading: false, addError: [] };

    // Display Error for add Liquidity Manager List failure
    case ADD_LIQUIDITY_API_MANAGER_FAILURE:

      return { ...state, addLoading: false, addliquidityApiList: [], addError: action.payload };

    // update Liquidity Manager List
    case UPDATE_LIQUIDITY_API_MANAGER_LIST:
      return { ...state, updateLoading: true };

    // set Data Of update Liquidity Manager List
    case UPDATE_LIQUIDITY_API_MANAGER_SUCCESS:
      return {
        ...state,
        updateliquidityApiList: action.payload,
        updateLoading: false,
        updateError: []
      };

    // Display Error for update Liquidity Manager List failure
    case UPDATE_LIQUIDITY_API_MANAGER_FAILURE:

      return { ...state, updateLoading: false, updateliquidityApiList: [], updateError: action.payload };

    // get Liquidity Provider List
    case GET_LIQUIDITY_PROVIDER_LIST:
      return { ...state };

    // set Data Of Liquidity Provider List
    case GET_LIQUIDITY_PROVIDER_SUCCESS:
      return {
        ...state,
        liquidityProviderList: action.payload,
        loading: false
      };

    // Display Error for Liquidity Provider List failure
    case GET_LIQUIDITY_PROVIDER_FAILURE:

      return { ...state, loading: false, liquidityProviderList: [] };

    // add Liquidity Provider List
    case ADD_LIQUIDITY_PROVIDER_LIST:
      return { ...state, loading: true };

    // set Data Of add Liquidity Provider List
    case ADD_LIQUIDITY_PROVIDER_SUCCESS:
      return {
        ...state,
        addliquidityProviderList: action.payload,
        loading: false
      };

    // Display Error for add Liquidity Provider List failure
    case ADD_LIQUIDITY_PROVIDER_FAILURE:

      return { ...state, loading: false, addliquidityProviderList: [] };

    // update Liquidity Provider List
    case UPDATE_LIQUIDITY_PROVIDER_LIST:
      return { ...state, loading: true };

    // set Data Of update Liquidity Provider List
    case UPDATE_LIQUIDITY_PROVIDER_SUCCESS:
      return {
        ...state,
        updateliquidityProviderList: action.payload,
        loading: false
      };

    // Display Error for update Liquidity Provider List failure
    case UPDATE_LIQUIDITY_PROVIDER_FAILURE:

      return { ...state, loading: false, updateliquidityProviderList: [] };

    // delete Liquidity Provider List
    case DELETE_LIQUIDITY_PROVIDER_LIST:
      return { ...state, loading: true };

    // set Data Of delete Liquidity Provider List
    case DELETE_LIQUIDITY_PROVIDER_SUCCESS:
      return {
        ...state,
        deleteliquidityProviderList: action.payload,
        loading: false
      };

    // Display Error for delete Liquidity Provider List failure
    case DELETE_LIQUIDITY_PROVIDER_FAILURE:

      return { ...state, loading: false, deleteliquidityProviderList: [] };

    // get Providers List
    case GET_PROVIDERS_LIST:
      return { ...state, providersLoading: true };

    // set Data Of  Providers List
    case GET_PROVIDERS_LIST_SUCCESS:
      return { ...state, providersList: action.payload, providersLoading: false };

    // Display Error for Providers List failure
    case GET_PROVIDERS_LIST_FAILURE:
      return { ...state, providersLoading: false, providersList: [] };

    // get Limit Data List
    case GET_LIMIT_DATA:
      return { ...state, limitDataLoading: true };

    // set Data Of  Limit Data List
    case GET_LIMIT_DATA_SUCCESS:
      return { ...state, limitData: action.payload, limitDataLoading: false };

    // Display Error for Limit Data List failure
    case GET_LIMIT_DATA_FAILURE:
      return { ...state, limitDataLoading: false, limitData: [] };

    // get Service Provider List
    case GET_SERVICE_PROVIDER:
      return { ...state, serviceProviderLoading: true };

    // set Data Of  Service Provider List
    case GET_SERVICE_PROVIDER_SUCCESS:
      return { ...state, serviceProvider: action.payload, serviceProviderLoading: false };

    // Display Error for Service Provider List failure
    case GET_SERVICE_PROVIDER_FAILURE:
      return { ...state, serviceProviderLoading: false, serviceProvider: [] };


    // get Service Configuration List
    case GET_SERVICE_CONFIG:
      return { ...state, serviceConfigurationLoading: true };

    // set Data Of  Service Configuration List
    case GET_SERVICE_CONFIG_SUCCESS:
      return { ...state, serviceConfiguration: action.payload, serviceConfigurationLoading: false };

    // Display Error for Service Configuration List failure
    case GET_SERVICE_CONFIG_FAILURE:
      return { ...state, serviceConfigurationLoading: false, serviceConfiguration: [] };

    // get Provider Type List
    case GET_PROVIDER_TYPE:
      return { ...state, providerTypeLoading: true };

    // set Data Of  Provider Type List
    case GET_PROVIDER_TYPE_SUCCESS:
      return { ...state, providerType: action.payload, providerTypeLoading: false };

    // Display Error for Provider Type List failure
    case GET_PROVIDER_TYPE_FAILURE:
      return { ...state, providerTypeLoading: false, providerType: [] };


    // get Daemon Config List
    case GET_DAEMON_CONFIG:
      return { ...state, daemonConfigListLoading: true };

    // set Data Of  Daemon Config List
    case GET_DAEMON_CONFIG_SUCCESS:
      return { ...state, daemonConfigList: action.payload, daemonConfigListLoading: false };

    // Display Error for Daemon Config List failure
    case GET_DAEMON_CONFIG_FAILURE:
      return { ...state, daemonConfigListLoading: false, daemonConfigList: [] };

    // get Transaction Type List
    case GET_TRANSACTION_TYPE:
      return { ...state, transactionTypeListLoading: true };

    // set Data Of  Transaction Type List
    case GET_TRANSACTION_TYPE_SUCCESS:
      return { ...state, transactionTypeList: action.payload, transactionTypeListLoading: false };

    // Display Error for Transaction Type List failure
    case GET_TRANSACTION_TYPE_FAILURE:
      return { ...state, transactionTypeListLoading: false, transactionTypeList: [] };

    default:
      return { ...state };
  }
};
