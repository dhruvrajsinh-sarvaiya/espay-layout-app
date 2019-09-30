import {
  //List password policy
  PASSWORD_POLICY_LIST,
  PASSWORD_POLICY_LIST_SUCCESS,
  PASSWORD_POLICY_LIST_FAILURE,

  //Edit password policy
  PASSWORD_POLICY_UPDATE,
  PASSWORD_POLICY_UPDATE_SUCCESS,
  PASSWORD_POLICY_UPDATE_FAILURE,

  //Add password policy
  PASSWORD_POLICY_ADD,
  PASSWORD_POLICY_ADD_SUCCESS,
  PASSWORD_POLICY_ADD_FAILURE,

  //Delete password policy
  PASSWORD_POLICY_DELETE,
  PASSWORD_POLICY_DELETE_SUCCESS,
  PASSWORD_POLICY_DELETE_FAILURE,

  //clear data
  PASSWORD_POLICY_CLEAR,
  ACTION_LOGOUT
} from '../../actions/ActionTypes'

/*
 * Initial State
 */
const INIT_STATE = {
  //List password policy
  Loading: false,
  policyListData: null,

  //Delete password policy
  isDelete: false,
  deletePolicyData: null,

  //Add password policy
  isAdd: false,
  addPolicyData: null,

  //Edit password policy
  isUpdate: false,
  updatePolicyData: null,
};

export default (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return INIT_STATE

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return INIT_STATE

    // Handle List password policy method data
    case PASSWORD_POLICY_LIST:
      return Object.assign({}, state, { Loading: true })
    // Set List password policy success
    case PASSWORD_POLICY_LIST_SUCCESS:
      return Object.assign({}, state, { Loading: false, policyListData: action.payload })
    // Set List password policy failure
    case PASSWORD_POLICY_LIST_FAILURE:
      return Object.assign({}, state, { Loading: false })

    //Edit password policy
    case PASSWORD_POLICY_UPDATE:
      return Object.assign({}, state, { isUpdate: true })
    //Edit password policy success
    case PASSWORD_POLICY_UPDATE_SUCCESS:
      return Object.assign({}, state, { isUpdate: false, updatePolicyData: action.payload })
    //Edit password policy failure
    case PASSWORD_POLICY_UPDATE_FAILURE:
      return Object.assign({}, state, { isUpdate: false })

    //Add password policy
    case PASSWORD_POLICY_ADD:
      return Object.assign({}, state, { isAdd: true })
    //Add password policy success
    case PASSWORD_POLICY_ADD_SUCCESS:
      return Object.assign({}, state, { isAdd: false, addPolicyData: action.payload })
    //Add password policy failure
    case PASSWORD_POLICY_ADD_FAILURE:
      return Object.assign({}, state, { isAdd: false })

    //Delete password policy
    case PASSWORD_POLICY_DELETE:
      return Object.assign({}, state, { isDelete: true })
    //Delete password policy success
    case PASSWORD_POLICY_DELETE_SUCCESS:
      return Object.assign({}, state, { isDelete: false, deletePolicyData: action.payload })
    //Delete password policy failure
    case PASSWORD_POLICY_DELETE_FAILURE:
      return Object.assign({}, state, { isDelete: false })

    //clear data
    case PASSWORD_POLICY_CLEAR:
      return INIT_STATE

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
