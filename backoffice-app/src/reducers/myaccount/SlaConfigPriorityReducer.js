import {
  //List SLA Configuration
  LIST_SLA,
  LIST_SLA_SUCCESS,
  LIST_SLA_FAILURE,

  //Edit SLA Configuration
  EDIT_SLA,
  EDIT_SLA_SUCCESS,
  EDIT_SLA_FAILURE,

  //Add SLA Configuration
  ADD_SLA,
  ADD_SLA_SUCCESS,
  ADD_SLA_FAILURE,

  //Delete SLA Configuration
  DELETE_SLA,
  DELETE_SLA_SUCCESS,
  DELETE_SLA_FAILURE,

  //clear data
  CLEAR_SLA,
  ACTION_LOGOUT
} from "../../actions/ActionTypes";

/*
 * Initial State
 */
const INIT_STATE = {
  //list
  Loading: false,
  slaConfigListData: null,

  //delete
  isDelete: false,
  deleteSlaConfigData: null,

  //add
  isAddSlaConfig: false,
  addSlaConfigData: null,

  //edit
  isUpdateSlaConfig: false,
  updateSlaConfigData: null,
};

//Check Action for SLA Configuration...
export default (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return INIT_STATE

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return INIT_STATE

    //List SLA Configuration..
    case LIST_SLA:
      return Object.assign({}, state, { Loading: true })
    //List SLA Configuration success
    case LIST_SLA_SUCCESS:
      return Object.assign({}, state, { Loading: false, slaConfigListData: action.payload })
    //List SLA Configuration failure
    case LIST_SLA_FAILURE:
      return Object.assign({}, state, { Loading: false })

    //Edit SLA Configuration
    case EDIT_SLA:
      return Object.assign({}, state, { isUpdateSlaConfig: true })
    //Edit SLA Configuration success
    case EDIT_SLA_SUCCESS:
      return Object.assign({}, state, { isUpdateSlaConfig: false, updateSlaConfigData: action.payload })
    //Edit SLA Configuration failure
    case EDIT_SLA_FAILURE:
      return Object.assign({}, state, { isUpdateSlaConfig: false })

    //Add SLA Configuration
    case ADD_SLA:
      return Object.assign({}, state, { isAddSlaConfig: true })
    //Add SLA Configuration success
    case ADD_SLA_SUCCESS:
      return Object.assign({}, state, { isAddSlaConfig: false, addSlaConfigData: action.payload })
    //Add SLA Configuration failure
    case ADD_SLA_FAILURE:
      return Object.assign({}, state, { isAddSlaConfig: false })

    //Delete SLA Configuration..
    case DELETE_SLA:
      return Object.assign({}, state, { isDelete: true })
    //Delete SLA Configuration success
    case DELETE_SLA_SUCCESS:
      return Object.assign({}, state, { isDelete: false, deleteSlaConfigData: action.payload })
    //Delete SLA Configuration failure
    case DELETE_SLA_FAILURE:
      return Object.assign({}, state, { isDelete: false })

    //clear SLA Configuration
    case CLEAR_SLA:
      return INIT_STATE

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
