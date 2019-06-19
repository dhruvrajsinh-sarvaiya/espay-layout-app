// Reducer For Handle Api Plan Configuration  By Tejas 21/2/2019
// import types
import {
  ADD_API_PLAN_CONFIG_DATA,
  ADD_API_PLAN_CONFIG_DATA_SUCCESS,
  ADD_API_PLAN_CONFIG_DATA_FAILURE,
  UPDATE_API_PLAN_CONFIG_DATA,
  UPDATE_API_PLAN_CONFIG_DATA_SUCCESS,
  UPDATE_API_PLAN_CONFIG_DATA_FAILURE,
  GET_API_PLAN_CONFIG_LIST,
  GET_API_PLAN_CONFIG_LIST_SUCCESS,
  GET_API_PLAN_CONFIG_LIST_FAILURE,
  GET_REST_METHOD_READ_ONLY,
  GET_REST_METHOD_READ_ONLY_SUCCESS,
  GET_REST_METHOD_READ_ONLY_FAILURE,
  GET_REST_METHOD_FULL_ACCESS,
  GET_REST_METHOD_FULL_ACCESS_SUCCESS,
  GET_REST_METHOD_FULL_ACCESS_FAILURE,
  ENABLE_DISABLE_API_PLAN,
  ENABLE_DISABLE_API_PLAN_SUCCESS,
  ENABLE_DISABLE_API_PLAN_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  addApiConfigList: [],
  updateApiConfigList: [],
  addError: [],
  updateError: [],
  updateLoading: false,
  addLoading: false,
  loading: false,
  error: [],
  apiPlanConfigList: [],
  restMethodReadOnly: [],
  restReadLoading: false,
  restReadError: [],
  restMethodFullAccess: [],
  restfullLoading: false,
  restFullError: [],
  enableDisablePlanData: null,
  enableDisablePlanError: [],
  enableDisablePlanLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // Add Api Plan Configuration Config
    case ADD_API_PLAN_CONFIG_DATA:
      return { ...state, addLoading: true };

    // set Data Of Add Api Plan Configuration Config
    case ADD_API_PLAN_CONFIG_DATA_SUCCESS:
      return { ...state, addApiConfigList: action.payload, addLoading: false, addError: [] };

    // Display Error for Add Api Plan Configuration Config failure
    case ADD_API_PLAN_CONFIG_DATA_FAILURE:
      return { ...state, addLoading: false, addApiConfigList: [], addError: action.payload };

    // update Api Plan Configuration Config
    case UPDATE_API_PLAN_CONFIG_DATA:
      return { ...state, updateLoading: true };

    // set Data Of update Api Plan Configuration Config
    case UPDATE_API_PLAN_CONFIG_DATA_SUCCESS:
      return { ...state, updateApiConfigList: action.payload, updateLoading: false, updateError: [] };

    // Display Error for update Api Plan Configuration Config failure
    case UPDATE_API_PLAN_CONFIG_DATA_FAILURE:

      return { ...state, updateLoading: false, updateApiConfigList: [], updateError: action.payload };


    // get Api Plan Configuration Config
    case GET_API_PLAN_CONFIG_LIST:
      return { ...state, loading: true };

    // set Data Of get Api Plan Configuration Config
    case GET_API_PLAN_CONFIG_LIST_SUCCESS:
      return { ...state, apiPlanConfigList: action.payload, loading: false, error: [] };

    // Display Error for get Api Plan Configuration Config failure
    case GET_API_PLAN_CONFIG_LIST_FAILURE:

      return { ...state, loading: false, apiPlanConfigList: [], error: action.payload };

    // get Rest Method with read only access list
    case GET_REST_METHOD_READ_ONLY:
      return { ...state, restReadLoading: true };

    // set Data Of get Rest Method with read only access list
    case GET_REST_METHOD_READ_ONLY_SUCCESS:
      return { ...state, restMethodReadOnly: action.payload, restReadLoading: false, restReadError: [] };

    // Display Error for get Rest Method with read only access list failure
    case GET_REST_METHOD_READ_ONLY_FAILURE:

      return { ...state, restReadLoading: false, restMethodReadOnly: [], restReadError: action.payload };

    // get Rest Method with Full access list
    case GET_REST_METHOD_FULL_ACCESS:
      return { ...state, restfullLoading: true };

    // set Data Of get Rest Method with Full access list
    case GET_REST_METHOD_FULL_ACCESS_SUCCESS:
      return { ...state, restMethodFullAccess: action.payload, restfullLoading: false, restFullError: [] };

    // Display Error for get Rest Method with Full access list failure
    case GET_REST_METHOD_FULL_ACCESS_FAILURE:

      return { ...state, restfullLoading: false, restMethodFullAccess: [], restFullError: action.payload };

    // get enable/disable api plan
    case ENABLE_DISABLE_API_PLAN:
      return {
        ...state,
        enableDisablePlanData: null,
        enableDisablePlanError: [],
        enableDisablePlanLoading: true,
      };

    // set Data Of get enable/disable api plan
    case ENABLE_DISABLE_API_PLAN_SUCCESS:
      return { ...state, enableDisablePlanData: action.payload, enableDisablePlanLoading: false, enableDisablePlanError: [] };

    // Display Error for get enable/disable api plan failure
    case ENABLE_DISABLE_API_PLAN_FAILURE:

      return { ...state, enableDisablePlanLoading: false, enableDisablePlanData: null, enableDisablePlanError: action.payload };

    default:
      return { ...state };
  }
};
