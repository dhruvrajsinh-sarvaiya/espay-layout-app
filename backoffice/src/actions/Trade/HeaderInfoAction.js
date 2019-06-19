// Actions For Get Header Data By Tejas

// import types
import {
  GET_HEADER_INFO,
  GET_HEADER_INFO_SUCCESS,
  GET_HEADER_INFO_FAILURE
} from "Actions/types";

//action for Get Header  and set type for reducers
export const getHeaderData = Pair => ({
  type: GET_HEADER_INFO,
  payload: { Pair }
});

//action for set Success andGet Header  and set type for reducers
export const getHeaderDataSuccess = response => ({
  type: GET_HEADER_INFO_SUCCESS,
  payload: response.data
});

//action for set failure and error to Get Header  and set type for reducers
export const getHeaderDataFailure = error => ({
  type: GET_HEADER_INFO_FAILURE,
  payload: error
});
