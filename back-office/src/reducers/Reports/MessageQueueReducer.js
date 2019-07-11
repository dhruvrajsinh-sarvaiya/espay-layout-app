/*
 * Created By : Megha Kariya
 * Date : 15-01-2019
 * Comment : Messaging Queue reducer file
 */
// import types
import {
  GET_MESSAGE_QUEUE_LIST,
  GET_MESSAGE_QUEUE_LIST_SUCCESS,
  GET_MESSAGE_QUEUE_LIST_FAILURE,
  RESEND_MESSAGE,
  RESEND_MESSAGE_SUCCESS,
  RESEND_MESSAGE_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  messageQueueList: [],
  loading: false,
  error: [],
  resendData: [],
  TotalCount: 0,
  TotalPage:0
};

export default (state , action) => {
  if (typeof state === 'undefined') {
      return INITIAL_STATE
  }
  
  switch (action.type) {
    // get Message Queue List
    case GET_MESSAGE_QUEUE_LIST:
      return { ...state, loading: true };

    // set Data Of Message Queue List
    case GET_MESSAGE_QUEUE_LIST_SUCCESS:
    return { ...state, messageQueueList: action.payload.MessagingQueueObj, loading: false,error: [],TotalCount:action.payload.Count,TotalPage:action.payload.TotalPage };

    // Display Error for Message Queue List failure
    case GET_MESSAGE_QUEUE_LIST_FAILURE:
      
      return { ...state, loading: false, messageQueueList: [],error:action.payload };
    // Resend Message
    case RESEND_MESSAGE:
      return { ...state, loading: true };

    // set Data Of Resend Message
    case RESEND_MESSAGE_SUCCESS:
      return { ...state, resendData: action.payload, loading: false,error: [] };

    // Display Error for Resend Message failure
    case RESEND_MESSAGE_FAILURE:
      
      return { ...state, loading: false, resendData: [],error:action.payload };

    default:
      return { ...state };
  }
};
