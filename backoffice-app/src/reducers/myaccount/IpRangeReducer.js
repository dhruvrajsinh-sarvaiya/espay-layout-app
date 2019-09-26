import {
  //List ip range
  IP_RANGE_LIST,
  IP_RANGE_LIST_SUCCESS,
  IP_RANGE_LIST_FAILURE,

  //Edit ip range
  IP_RANGE_UPDATE,
  IP_RANGE_UPDATE_SUCCESS,
  IP_RANGE_UPDATE_FAILURE,

  //Add ip range
  IP_RANGE_ADD,
  IP_RANGE_ADD_SUCCESS,
  IP_RANGE_ADD_FAILURE,

  //Delete ip range
  IP_RANGE_DELETE,
  IP_RANGE_DELETE_SUCCESS,
  IP_RANGE_DELETE_FAILURE,

  //clear
  IP_RANGE_CLEAR,

  ACTION_LOGOUT
} from "../../actions/ActionTypes";

/*
 * Initial State
 */
const INIT_STATE = {
  //List ip range
  Loading: false,
  ipRangeListData: null,

  //Delete ip range
  isDelete: false,
  deleteIpRangeData: null,

  //Add ip range
  isAdd: false,
  addIpRangeData: null,

  //Edit ip range
  isUpdate: false,
  updateIpRangeData: null,
};

//Check Action for ip profiling ...
export default (state, action) => {

  //If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return INIT_STATE

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return INIT_STATE

    //List ip range
    case IP_RANGE_LIST:
      return Object.assign({}, state, { Loading: true })
    //List ip range
    case IP_RANGE_LIST_SUCCESS:
      return Object.assign({}, state, { Loading: false, ipRangeListData: action.payload })
    //List ip range
    case IP_RANGE_LIST_FAILURE:
      return Object.assign({}, state, { Loading: false })

    //Edit ip range
    case IP_RANGE_UPDATE:
      return Object.assign({}, state, { isUpdate: true })
    //Edit ip range
    case IP_RANGE_UPDATE_SUCCESS:
      return Object.assign({}, state, { isUpdate: false, updateIpRangeData: action.payload })
    //Edit ip range
    case IP_RANGE_UPDATE_FAILURE:
      return Object.assign({}, state, { isUpdate: false })

    //Add ip range
    case IP_RANGE_ADD:
      return Object.assign({}, state, { isAdd: true })
    //Add ip range
    case IP_RANGE_ADD_SUCCESS:
      return Object.assign({}, state, { isAdd: false, addIpRangeData: action.payload })
    //Add ip range
    case IP_RANGE_ADD_FAILURE:
      return Object.assign({}, state, { isAdd: false })

    //Delete ip range
    case IP_RANGE_DELETE:
      return Object.assign({}, state, { isDelete: true })
    //Delete ip range
    case IP_RANGE_DELETE_SUCCESS:
      return Object.assign({}, state, { isDelete: false, deleteIpRangeData: action.payload })
    //Delete ip range
    case IP_RANGE_DELETE_FAILURE:
      return Object.assign({}, state, { isDelete: false })

    //clear data
    case IP_RANGE_CLEAR:
      return INIT_STATE

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
