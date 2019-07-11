import {
  GET_PATTERNLIST,
  GET_PATTERNLIST_SUCCESS,
  GET_PATTERNLIST_FAILURE,
  DELETE_PATTERN,
  DELETE_PATTERN_SUCCESS,
  DELETE_PATTERN_FAILURE,
  GET_PATTERNINFO,
  GET_PATTERNINFO_SUCCESS,
  GET_PATTERNINFO_FAILURE,
  POST_PATTERNINFO,
  POST_PATTERNINFO_SUCCESS,
  POST_PATTERNINFO_FAILURE,
  GET_PATTERNBYID,
  GET_PATTERNBYID_SUCCESS,
  GET_PATTERNBYID_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  patternList: [],
  loading: false,
  patternInfo: {}
};

export default (state, action) => {
  if (typeof state === 'undefined') {
      return INITIAL_STATE
  }
  switch (action.type) {
    case GET_PATTERNLIST:
    case DELETE_PATTERN:
    case GET_PATTERNINFO:
    case POST_PATTERNINFO:
    case GET_PATTERNBYID:
      return { ...state, loading: true };

    case GET_PATTERNLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        patternList: action.payload
      };

    case GET_PATTERNLIST_FAILURE:
    case DELETE_PATTERN_FAILURE:
    case GET_PATTERNINFO_FAILURE:
    case POST_PATTERNINFO_FAILURE:
   case GET_PATTERNBYID_FAILURE:
      return { ...state, loading: false };

    case DELETE_PATTERN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      };

    case GET_PATTERNINFO_SUCCESS:
      return { ...state, loading: false, patternInfo: action.payload };

    //post data success
    case POST_PATTERNINFO_SUCCESS:
      return { ...state, loading: false, response: action.payload };
 
    case GET_PATTERNBYID_SUCCESS:
      return { ...state, loading: false, response: action.payload };

    default:
      return { ...state };
  }
};
