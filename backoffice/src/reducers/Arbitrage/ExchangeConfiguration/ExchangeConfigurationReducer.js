// Reducer For Handle arbitrage exchange configuration   By Devang parekh (11-6-2019)
// import types
import {
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  GET_ARBITRAGE_SERVICE_PROVIDER,
  GET_ARBITRAGE_SERVICE_PROVIDER_SUCCESS,
  GET_ARBITRAGE_SERVICE_PROVIDER_FAILURE,
  GET_ARBITRAGE_PROVIDERS_LIST,
  GET_ARBITRAGE_PROVIDERS_LIST_SUCCESS,
  GET_ARBITRAGE_PROVIDERS_LIST_FAILURE,
  GET_ARBITRAGE_SERVICE_CONFIG,
  GET_ARBITRAGE_SERVICE_CONFIG_SUCCESS,
  GET_ARBITRAGE_SERVICE_CONFIG_FAILURE,
  GET_ARBITRAGE_PROVIDER_TYPE,
  GET_ARBITRAGE_PROVIDER_TYPE_SUCCESS,
  GET_ARBITRAGE_PROVIDER_TYPE_FAILURE,
  GET_ARBITRAGE_TRANSACTION_TYPE,
  GET_ARBITRAGE_TRANSACTION_TYPE_SUCCESS,
  GET_ARBITRAGE_TRANSACTION_TYPE_FAILURE,
  
  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE,
  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_SUCCESS,
  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_FAILURE,

} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  exchangeConfigurationApiList: [],
  addExchangeConfigurationApiList: [],
  updateExchangeConfigurationApiList: [],
  arbitrageExchangeProviderList: [],
  addArbitrageExchangeProviderList: [],
  updateArbitrageExchangeProviderList: [],
  deleteArbitrageExchangeProviderList: [],
  loading: false,
  addLoading: false,
  updateLoading: false,
  error: [],
  addError: [],
  updateError: [],
  arbitrageProvidersList: [],
  arbitrageProvidersLoading: false,
  arbitrageServiceProvider: [],
  arbitrageServiceProviderLoading: false,
  arbitrageServiceConfiguration: [],
  arbitrageServiceConfigurationLoading:false,
  arbitrageProviderType: [],
  arbitrageProviderTypeLoading:false,
  arbitrageTransactionTypeList: [],
  arbitrageTransactionTypeListLoading:false,
  changeOrderTypeData:[]
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    // get arbitrage exchange configuration List
    case GET_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST:
      return { loading: true };

    // set Data Of arbitrage exchange configuration List
    case GET_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS:
      return { exchangeConfigurationApiList: action.payload, loading: false, error: [] };

    // Display Error for arbitrage exchange configuration List failure
    case GET_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE:
      return { loading: false, exchangeConfigurationApiList: [], error: action.payload };

    // add arbitrage exchange configuration List
    case ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST:
      return { ...state, addLoading: true };

    // set Data Of add arbitrage exchange configuration List
    case ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS:
      return { ...state, addExchangeConfigurationApiList: action.payload, addLoading: false, addError: [] };

    // Display Error for add arbitrage exchange configuration List failure
    case ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE:
      return { ...state, addLoading: false, addExchangeConfigurationApiList: [], addError: action.payload };

    // update arbitrage exchange configuration List
    case UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST:
      return { ...state, updateLoading: true };

    // set Data Of update arbitrage exchange configuration List
    case UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS:
      return {
        ...state,
        updateExchangeConfigurationApiList: action.payload,
        updateLoading: false,
        updateError: []
      };

    // Display Error for update arbitrage exchange configuration List failure
    case UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE:
      return { ...state, updateLoading: false, updateExchangeConfigurationApiList: [], updateError: action.payload };

    // get arbitrage exchange provider List
    case GET_ARBITRAGE_EXCHANGE_PROVIDER_LIST:
      return { ...state };

    // set Data Of arbitrage exchange provider List
    case GET_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS:
      return {
        ...state,
        arbitrageExchangeProviderList: action.payload,
        loading: false
      };

    // Display Error for arbitrage exchange provider List failure
    case GET_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE:
      return { ...state, loading: false, arbitrageExchangeProviderList: [] };

    // add arbitrage exchange provider List
    case ADD_ARBITRAGE_EXCHANGE_PROVIDER_LIST:
      return { ...state, loading: true };

    // set Data Of add arbitrage exchange provider List
    case ADD_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS:
      return {
        ...state,
        addArbitrageExchangeProviderList: action.payload,
        loading: false
      };

    // Display Error for add arbitrage exchange provider List failure
    case ADD_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE:

      return { ...state, loading: false, addArbitrageExchangeProviderList: [] };

    // update arbitrage exchange provider List
    case UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_LIST:
      return { ...state, loading: true };

    // set Data Of update arbitrage exchange provider List
    case UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS:
      return {
        ...state,
        updateArbitrageExchangeProviderList: action.payload,
        loading: false
      };

    // Display Error for update arbitrage exchange provider List failure
    case UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE:
      return { ...state, loading: false, updateArbitrageExchangeProviderList: [] };

    // delete arbitrage exchange provider List
    case DELETE_ARBITRAGE_EXCHANGE_PROVIDER_LIST:
      return { ...state, loading: true };

    // set Data Of delete arbitrage exchange provider List
    case DELETE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS:
      return {
        ...state,
        deleteArbitrageExchangeProviderList: action.payload,
        loading: false
      };

    // Display Error for delete arbitrage exchange provider List failure
    case DELETE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE:
      return { ...state, loading: false, deleteArbitrageExchangeProviderList: [] };

    // get Providers List
    case GET_ARBITRAGE_PROVIDERS_LIST:
      return { ...state, arbitrageProvidersLoading: true };

    // set Data Of  Providers List
    case GET_ARBITRAGE_PROVIDERS_LIST_SUCCESS:
      return { ...state, arbitrageProvidersList: action.payload, arbitrageProvidersLoading: false };

    // Display Error for Providers List failure
    case GET_ARBITRAGE_PROVIDERS_LIST_FAILURE:
      return { ...state, arbitrageProvidersLoading: false, arbitrageProvidersList: [] };

    // get Service Provider List
    case GET_ARBITRAGE_SERVICE_PROVIDER:
      return { ...state, arbitrageServiceProviderLoading: true };

    // set Data Of  Service Provider List
    case GET_ARBITRAGE_SERVICE_PROVIDER_SUCCESS:
      return { ...state, arbitrageServiceProvider: action.payload, arbitrageServiceProviderLoading: false };

    // Display Error for Service Provider List failure
    case GET_ARBITRAGE_SERVICE_PROVIDER_FAILURE:
      return { ...state, arbitrageServiceProviderLoading: false, arbitrageServiceProvider: [] };

    // get Service Configuration List
    case GET_ARBITRAGE_SERVICE_CONFIG:
      return { ...state, arbitrageServiceConfigurationLoading: true };

    // set Data Of  Service Configuration List
    case GET_ARBITRAGE_SERVICE_CONFIG_SUCCESS:
      return { ...state, arbitrageServiceConfiguration: action.payload, arbitrageServiceConfigurationLoading: false };

    // Display Error for Service Configuration List failure
    case GET_ARBITRAGE_SERVICE_CONFIG_FAILURE:
      return { ...state, arbitrageServiceConfigurationLoading: false, arbitrageServiceConfiguration: [] };

    // get Provider Type List
    case GET_ARBITRAGE_PROVIDER_TYPE:
      return { ...state, arbitrageProviderTypeLoading: true };

    // set Data Of  Provider Type List
    case GET_ARBITRAGE_PROVIDER_TYPE_SUCCESS:
      return { ...state, arbitrageProviderType: action.payload, arbitrageProviderTypeLoading: false };

    // Display Error for Provider Type List failure
    case GET_ARBITRAGE_PROVIDER_TYPE_FAILURE:
      return { ...state, arbitrageProviderTypeLoading: false, arbitrageProviderType: [] };

    // get Transaction Type List
    case GET_ARBITRAGE_TRANSACTION_TYPE:
      return { ...state, arbitrageTransactionTypeListLoading: true };

    // set Data Of  Transaction Type List
    case GET_ARBITRAGE_TRANSACTION_TYPE_SUCCESS:
      return { ...state, arbitrageTransactionTypeList: action.payload, arbitrageTransactionTypeListLoading: false };

    // Display Error for Transaction Type List failure
    case GET_ARBITRAGE_TRANSACTION_TYPE_FAILURE:
      return { ...state, arbitrageTransactionTypeListLoading: false, arbitrageTransactionTypeList: [] };

    // get change allow order type
    case CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE:
      return {  changeOrderTypeData:{},loading: true };

    // set Data Of  change allow order type
    case CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_SUCCESS:
      return {  changeOrderTypeData: action.payload, loading: false };

    // Display Error for change allow order type failure
    case CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_FAILURE:
      return { loading: false, changeOrderTypeData: [] };

    default:
      return { ...state };
  }
};
