/* 
    Created By : Megha Kariya
    Date : 20-02-2019
    Description : CMS Request Format API reducer file
*/
import {
  GET_REQUEST_FORMET,
  GET_REQUEST_FORMET_SUCESSFULL,
  GET_REQUEST_FORMET_FAIL,
  ADD_REQUEST_FORMET_LIST,
  ADD_REQUEST_FORMET_LIST_SUCESSFUL,
  ADD_REQUEST_FORMET_LIST_FAIL,
  EDIT_REQUEST_LIST,
  EDIT_REQUEST_LIST_SUCESSFUL,
  EDIT_REQUEST_LIST_FAILED,
  GET_APP_TYPE,
  GET_APP_TYPE_SUCESSFULL,
  GET_APP_TYPE_FAIL,
} from "Actions/types";

const INIT_STATE = {
  displayCustomerData: [],
  EditResponse:{},
  EditError:{},
  data: [],
  addError: [],
  loding: false,
  appTypeList: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

// Display here
    case GET_REQUEST_FORMET:
      return { ...state, loading: true };

    case GET_REQUEST_FORMET_SUCESSFULL:
      return {   ...state, loading: false, displayCustomerData: action.payload.Result };

    case GET_REQUEST_FORMET_FAIL:
      return { ...state, loading: false };

// Add Redcer here

      case ADD_REQUEST_FORMET_LIST:
      return { ...state, loading: true, data: {} };

    case ADD_REQUEST_FORMET_LIST_SUCESSFUL:
      return { ...state,loading: false, data: action.payload};

    case ADD_REQUEST_FORMET_LIST_FAIL:
      return { ...state, loading: false, addError: action.payload  };


// Edit Here
 
      case EDIT_REQUEST_LIST:
      return {...state,loading: true };
 
      case EDIT_REQUEST_LIST_SUCESSFUL:
      return{ ...state,loading:false, EditResponse: action.payload,EditError:{}}
      
      case EDIT_REQUEST_LIST_FAILED:
      return{...state,loading:false, EditError: action.payload ,EditResponse:{}}

    // Added By Megha Kariya : (21/02/2019)
    case GET_APP_TYPE:
      return { ...state, loading: true };

    case GET_APP_TYPE_SUCESSFULL:
      return {   ...state, loading: false, appTypeList: action.payload };

    case GET_APP_TYPE_FAIL:
      return { ...state, loading: false };

        
    default:
      return { ...state,loading:false }; 
  }
};
