/**
 * Auther : Salim Deraiya
 * Created : 08/10/2018
 * Complain Reducers
 */
import {
  //Count Total Complain
  HELPNSUPPORT_DASHBOARD,
  HELPNSUPPORT_DASHBOARD_SUCCESS,
  HELPNSUPPORT_DASHBOARD_FAILURE,

  //List Complain
  LIST_COMPLAIN,
  LIST_COMPLAIN_SUCCESS,
  LIST_COMPLAIN_FAILURE,

  //Edit Complain
  EDIT_COMPLAIN,
  EDIT_COMPLAIN_SUCCESS,
  EDIT_COMPLAIN_FAILURE,

  //Get Complain By ID
  GET_COMPLAIN_BY_ID,
  GET_COMPLAIN_BY_ID_SUCCESS,
  GET_COMPLAIN_BY_ID_FAILURE,

  //Replay Complain
  REPLAY_COMPLAIN,
  REPLAY_COMPLAIN_SUCCESS,
  REPLAY_COMPLAIN_FAILURE,

  //Get Complain By ID
  GET_COMPLAIN_CONVERSION_BY_ID,
  GET_COMPLAIN_CONVERSION_BY_ID_SUCCESS,
  GET_COMPLAIN_CONVERSION_BY_ID_FAILURE,

  //List SLA Configuration
  GET_SLA_LIST,
  GET_SLA_LIST_SUCCESS,
  GET_SLA_LIST_FAILURE,

} from "Actions/types";

/*
 * Initial State
 */
const INIT_STATE = {
  loading: false,
  countData: [],
  conversion: [],
  getData: [],
  list: [],
  data: [],
  getSlaData: [],
  ext_flag: false,
};

//Check Action for Complain...
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //List Complain..
    case HELPNSUPPORT_DASHBOARD:
      return { ...state, loading: true };

    case HELPNSUPPORT_DASHBOARD_SUCCESS:
      return { ...state, loading: false, countData: action.payload };

    case HELPNSUPPORT_DASHBOARD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //List Complain..
    case LIST_COMPLAIN:
      return { ...state, loading: true, list: [] };

    case LIST_COMPLAIN_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case LIST_COMPLAIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // //Edit Complain..
    // case EDIT_COMPLAIN:
    //   return { ...state, loading: true };

    // case EDIT_COMPLAIN_SUCCESS:
    //   return { ...state, loading: false, data: action.payload };

    // case EDIT_COMPLAIN_FAILURE:
    //   return { ...state, loading: false, error: action.payload };

    //Get Complain By ID..
    case GET_COMPLAIN_BY_ID:
      return { ...state, loading: true, ext_flag: false };

    case GET_COMPLAIN_BY_ID_SUCCESS:
      return { ...state, loading: false, getData: action.payload };

    case GET_COMPLAIN_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //Replay Complain..
    case REPLAY_COMPLAIN:
      return { ...state, loading: true, data : [] };

    case REPLAY_COMPLAIN_SUCCESS:
      return { ...state, loading: false, data: action.payload, ext_flag: true };

    case REPLAY_COMPLAIN_FAILURE:
      return { ...state, loading: false, error: action.payload, ext_flag: true };

    //List SLA..
    case GET_SLA_LIST:
      return { ...state, loading: true };

    case GET_SLA_LIST_SUCCESS:
      return { ...state, loading: false, getSlaData: action.payload };

    case GET_SLA_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // //Get Complain Conversion By ID..
    // case GET_COMPLAIN_CONVERSION_BY_ID:
    //   return { ...state, loading: true };

    // case GET_COMPLAIN_CONVERSION_BY_ID_SUCCESS:
    //   return { ...state, loading: false, conversion: action.payload };

    // case GET_COMPLAIN_CONVERSION_BY_ID_FAILURE:
    //   return { ...state, loading: false, error: action.payload };

    default:
      return { ...state };
  }
};
