/* 
    Developer : Khushbu Badheka
    Date : 08-Jan-2019
    File Reducer : Push Notification Queue Module
*/
import {
  DISPALY_PUSHNOTIFICATION,
  DISPALY_PUSHNOTIFICATION_SUCCESS,
  DISPALY_PUSHNOTIFICATION_FAILURE,
  DISPALY_RESENDPUSHNOTIFICATION,
  DISPALY_RESENDPUSHNOTIFICATION_SUCCESS,
  DISPALY_RESENDPUSHNOTIFICATION_FAILURE

} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  displayPushNotificationData: [],
  loading: false,
  TotalCount : 0,
  TotalPage : 0,
  ReturnMsg : "",
  ReturnCode : 1
};

export default (state = INIT_STATE, action) => {

  switch (action.type) {
    //For Display Push Notification
    case DISPALY_PUSHNOTIFICATION:
      return { ...state, loading: true , TotalPages:0};

    case DISPALY_PUSHNOTIFICATION_SUCCESS:
      return { ...state,ReturnMsg : '' , ReturnCode : 1, loading: false, displayPushNotificationData: action.payload.NotificationQueueObj , TotalCount:action.payload.Count , TotalPage:action.payload.TotalPage };

    case DISPALY_PUSHNOTIFICATION_FAILURE:
      return { ...state, loading: false, ReturnMsg : '' , ReturnCode : 1,displayPushNotificationData : [] ,TotalPages :0 };

      case DISPALY_RESENDPUSHNOTIFICATION:
      return { ...state, loading: true , TotalPages:0,ReturnMsg : '' , ReturnCode : 1};

    case DISPALY_RESENDPUSHNOTIFICATION_SUCCESS:
      return { ...state, loading: false, ReturnMsg: action.payload.ReturnMsg , ReturnCode: action.payload.ReturnCode};

    case DISPALY_RESENDPUSHNOTIFICATION_FAILURE:
      return { ...state, loading: false , ReturnMsg : '' , ReturnCode : 1 };

    default:
      return { ...state };
  }
};
