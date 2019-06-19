/**
 * Auther : Salim Deraiya
 * Created : 09/10/2018
 * SLA Configuration Reducers
 */
import {
  //List SLA Configuration
  LIST_SLA,
  LIST_SLA_SUCCESS,
  LIST_SLA_FAILURE,

  //Edit SLA Configuration
  EDIT_SLA,
  EDIT_SLA_SUCCESS,
  EDIT_SLA_FAILURE,

  //Get SLA Configuration By ID
  GET_SLA_BY_ID,
  GET_SLA_BY_ID_SUCCESS,
  GET_SLA_BY_ID_FAILURE,

  //Add SLA Configuration
  ADD_SLA,
  ADD_SLA_SUCCESS,
  ADD_SLA_FAILURE,

  //Delete SLA Configuration
  DELETE_SLA,
  DELETE_SLA_SUCCESS,
  DELETE_SLA_FAILURE
} from "Actions/types";

/*
 * Initial State
 */
const INIT_STATE = {
  loading: false,
  conversion: [],
  data: [],
  list: [],
  ext_flag: false,
};

//Check Action for SLA Configuration...
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //List SLA Configuration..
    case LIST_SLA:
      return { ...state, loading: true, ext_flag: false, data: '' };

    case LIST_SLA_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case LIST_SLA_FAILURE:
      return { ...state, loading: false, list: action.payload };

    //Edit SLA Configuration..
    case EDIT_SLA:
      return { ...state, loading: true };

    case EDIT_SLA_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case EDIT_SLA_FAILURE:
      return { ...state, loading: false, data: action.payload };

    //Get SLA Configuration By ID..
    case GET_SLA_BY_ID:
      return { ...state, loading: true };

    case GET_SLA_BY_ID_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case GET_SLA_BY_ID_FAILURE:
      return { ...state, loading: false, data: action.payload };

    //Add SLA Configuration..
    case ADD_SLA:
      return { ...state, loading: true };

    case ADD_SLA_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case ADD_SLA_FAILURE:
      return { ...state, loading: false, data: action.payload };

    //Delete SLA Configuration..
    case DELETE_SLA:
      return { ...state, loading: true };

    case DELETE_SLA_SUCCESS:
      return { ...state, loading: false, conversion: action.payload, ext_flag: true };

    case DELETE_SLA_FAILURE:
      return { ...state, loading: false, conversion: action.payload, ext_flag: true };

    default:
      return { ...state };
  }
};

// /**
//  * Auther : Salim Deraiya
//  * Created : 09/10/2018
//  * SLA Configuration Reducers
//  */
// import {
//   //List SLA Configuration
//   LIST_SLA,
//   LIST_SLA_SUCCESS,
//   LIST_SLA_FAILURE,

//   //Edit SLA Configuration
//   EDIT_SLA,
//   EDIT_SLA_SUCCESS,
//   EDIT_SLA_FAILURE,

//   //Get SLA Configuration By ID
//   GET_SLA_BY_ID,
//   GET_SLA_BY_ID_SUCCESS,
//   GET_SLA_BY_ID_FAILURE,

//   //Add SLA Configuration
//   ADD_SLA,
//   ADD_SLA_SUCCESS,
//   ADD_SLA_FAILURE,

//   //Delete SLA Configuration
//   DELETE_SLA,
//   DELETE_SLA_SUCCESS,
//   DELETE_SLA_FAILURE
// } from "Actions/types";

// /*
//  * Initial State
//  */
// const INIT_STATE = {
//   loading: false,
//   conversion: [],
//   data: [],
//   list: []
// };

// //Check Action for SLA Configuration...
// export default (state = INIT_STATE, action) => {
//   switch (action.type) {
//     //List SLA Configuration..
//     case LIST_SLA:
//       return { ...state, loading: true, list: '' };

//     case LIST_SLA_SUCCESS:
//       return { ...state, loading: false, list: action.payload };

//     case LIST_SLA_FAILURE:
//       return { ...state, loading: false, list: action.payload };

//     //Edit SLA Configuration..
//     case EDIT_SLA:
//       return { ...state, loading: true, data: '' };

//     case EDIT_SLA_SUCCESS:
//       return { ...state, loading: false, data: action.payload };

//     case EDIT_SLA_FAILURE:
//       return { ...state, loading: false, data: action.payload };

//     //Get SLA Configuration By ID..
//     case GET_SLA_BY_ID:
//       return { ...state, loading: true, data: '' };

//     case GET_SLA_BY_ID_SUCCESS:
//       return { ...state, loading: false, data: action.payload };

//     case GET_SLA_BY_ID_FAILURE:
//       return { ...state, loading: false, data: action.payload };

//     //Add SLA Configuration..
//     case ADD_SLA:
//       return { ...state, loading: true, data: '' };

//     case ADD_SLA_SUCCESS:
//       return { ...state, loading: false, data: action.payload };

//     case ADD_SLA_FAILURE:
//       return { ...state, loading: false, data: action.payload };

//     //Delete SLA Configuration..
//     case DELETE_SLA:
//       return { ...state, loading: true, data: '' };

//     case DELETE_SLA_SUCCESS:
//       return { ...state, loading: false, data: action.payload };

//     case DELETE_SLA_FAILURE:
//       return { ...state, loading: false, data: action.payload };

//     default:
//       return { ...state };
//   }
// };
