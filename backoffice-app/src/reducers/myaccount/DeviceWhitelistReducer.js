
import {

   //For Device Whitelist
   LIST_DEVICE_WHITELIST,
   LIST_DEVICE_WHITELIST_SUCCESS,
   LIST_DEVICE_WHITELIST_FAILURE,

   //For Delete Device Whitelist
   DELETE_DEVICE_WHITELIST,
   DELETE_DEVICE_WHITELIST_SUCCESS,
   DELETE_DEVICE_WHITELIST_FAILURE,

   //For Disable Device Whitelist
   DISABLE_DEVICE_WHITELIST,
   DISABLE_DEVICE_WHITELIST_SUCCESS,
   DISABLE_DEVICE_WHITELIST_FAILURE,

   //For Enable Device Whitelist
   ENABLE_DEVICE_WHITELIST,
   ENABLE_DEVICE_WHITELIST_SUCCESS,
   ENABLE_DEVICE_WHITELIST_FAILURE,

   //clear data
   CLEAR_DEVICE_WHITELIST,
   ACTION_LOGOUT
} from "../../actions/ActionTypes";

/**
 * initial Device Whitelist
 */
const INIT_STATE = {

   //delete ,disable, enable whitelist
   data: [],
   loading: false,
   ext_flag: false,

   //Device Whitelist list
   deviceWhitelistListLoading: false,
   deviceWhitelistListData: null,
};

export default (state, action) => {

   //If state is undefine then return with initial state
   if (typeof state === 'undefined')
      return INIT_STATE

   switch (action.type) {

      // To reset initial state on logout
      case ACTION_LOGOUT:
         return INIT_STATE

      //Handle device white list method data
      case LIST_DEVICE_WHITELIST:
         return Object.assign({}, state, { deviceWhitelistListLoading: true, ext_flag: false, deviceWhitelistListData: null })
      //Set device white list success method data
      case LIST_DEVICE_WHITELIST_SUCCESS:
         return Object.assign({}, state, { deviceWhitelistListLoading: false, deviceWhitelistListData: action.payload })
      //Set device white list failure method data
      case LIST_DEVICE_WHITELIST_FAILURE:
         return Object.assign({}, state, { deviceWhitelistListLoading: false, deviceWhitelistListData: null })

      //Handle delete device white list method data
      case DELETE_DEVICE_WHITELIST:
         return Object.assign({}, state, { loading: true, data: '' })
      //Set delete device white list success method data
      case DELETE_DEVICE_WHITELIST_SUCCESS:
         return Object.assign({}, state, { loading: false, data: action.payload, ext_flag: true })
      //Set delete device white list failure method data
      case DELETE_DEVICE_WHITELIST_FAILURE:
         return Object.assign({}, state, { loading: false, data: action.payload, ext_flag: true })

      //Handle disable device white list method data
      case DISABLE_DEVICE_WHITELIST:
         return Object.assign({}, state, { loading: true, data: '' })
      //Set disable device white list success method data
      case DISABLE_DEVICE_WHITELIST_SUCCESS:
         return Object.assign({}, state, { loading: false, data: action.payload, ext_flag: true })
      //Set disable device white list failure method data
      case DISABLE_DEVICE_WHITELIST_FAILURE:
         return Object.assign({}, state, { loading: false, data: action.payload, ext_flag: true })

      //Handle enable device white list method data
      case ENABLE_DEVICE_WHITELIST:
         return Object.assign({}, state, { loading: true, data: '' })
      //Set enable device white list success method data
      case ENABLE_DEVICE_WHITELIST_SUCCESS:
         return Object.assign({}, state, { loading: false, data: action.payload, ext_flag: true })
      //Set enable device white listF failure method data
      case ENABLE_DEVICE_WHITELIST_FAILURE:
         return Object.assign({}, state, { loading: false, data: action.payload, ext_flag: true })

      //To reset initial state on clear data
      case CLEAR_DEVICE_WHITELIST:
         return INIT_STATE

      // If no actions were found from reducer than return default [existing] state value
      default:
         return state
   }
};