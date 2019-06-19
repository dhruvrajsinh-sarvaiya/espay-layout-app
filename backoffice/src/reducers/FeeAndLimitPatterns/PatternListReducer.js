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

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PATTERNLIST:
      return { ...state, loading: true };

    case GET_PATTERNLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        patternList: action.payload
      };

    case GET_PATTERNLIST_FAILURE:
      return { ...state, loading: false };

    case DELETE_PATTERN:
      return { ...state, loading: true };

    case DELETE_PATTERN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      };

    case DELETE_PATTERN_FAILURE:
      return { ...state, loading: false };

    case GET_PATTERNINFO:
      return { ...state, loading: true };

    case GET_PATTERNINFO_SUCCESS:
      return { ...state, loading: false, patternInfo: action.payload };

    case GET_PATTERNINFO_FAILURE:
      return { ...state, loading: false };
    //post data
    case POST_PATTERNINFO:
      return { ...state, loading: true };
    //post data success
    case POST_PATTERNINFO_SUCCESS:
      return { ...state, loading: false, response: action.payload };
    // post data failure
    case POST_PATTERNINFO_FAILURE:
      return { ...state, loading: false };

    //get pattern info by id
    case GET_PATTERNBYID:
      return { ...state, loading: true };

    case GET_PATTERNBYID_SUCCESS:
      return { ...state, loading: false, response: action.payload };

    case GET_PATTERNBYID_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
