// Actions For Bug Report By Tejas

// import types 
import {  
    GET_FILE_LIST,
    GET_FILE_LIST_SUCCESS,
    GET_FILE_LIST_FAILURE,
    CLEAR_FILE_LIST,
    CLEAR_FILE_LIST_SUCCESS,
    CLEAR_FILE_LIST_FAILURE,
    GET_FILE_DETAIL,
    GET_FILE_DETAIL_SUCCESS,
    GET_FILE_DETAIL_FAILURE,
} from 'Actions/types';

//action for Get File List and set type for reducers
export const getFileList = (Data) => ({
    type: GET_FILE_LIST,
    payload: { Data }
});

//action for set Success and Get File List for Bug Report and set type for reducers
export const fileListSuccess = (response) => ({
    type: GET_FILE_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to Get File List for Bug Report and set type for reducers
export const fileListFailure = (error) => ({
    type: GET_FILE_LIST_FAILURE,
    payload: error.message
});

//action for clear File List and set type for reducers
export const clearFileList = (Data) => ({
    type: CLEAR_FILE_LIST,
    payload: { Data }
});

//action for set Success and clear File List for Bug Report and set type for reducers
export const clearFileListSuccess = (response) => ({
    type: CLEAR_FILE_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to clear File List for Bug Report and set type for reducers
export const clearFileListFailure = (error) => ({
    type: CLEAR_FILE_LIST_FAILURE,
    payload: error.message
});

//action for get File Detail and set type for reducers
export const getFileDetail = (Data) => ({
    type: GET_FILE_DETAIL,
    payload: { Data }
});

//action for set Success and get File Detail for Bug Report and set type for reducers
export const getFileDetailSuccess = (response) => ({
    type: GET_FILE_DETAIL_SUCCESS,
    payload: response.data
});

//action for set failure and error to get File Detail for Bug Report and set type for reducers
export const getFileDetailFailure = (error) => ({
    type: GET_FILE_DETAIL_FAILURE,
    payload: error.message
});