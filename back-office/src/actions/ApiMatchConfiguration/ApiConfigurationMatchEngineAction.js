// Actions For Api Match Engine  By Tejas

// import types 
import {  
    GET_MATCH_ENGINE_LIST,
    GET_MATCH_ENGINE_LIST_SUCCESS,
    GET_MATCH_ENGINE_LIST_FAILURE,
    ADD_MATCH_ENGINE_LIST,
    ADD_MATCH_ENGINE_LIST_SUCCESS,
    ADD_MATCH_ENGINE_LIST_FAILURE,
    UPDATE_MATCH_ENGINE_LIST,
    UPDATE_MATCH_ENGINE_LIST_SUCCESS,
    UPDATE_MATCH_ENGINE_LIST_FAILURE,
    DELETE_MATCH_ENGINE_LIST,
    DELETE_MATCH_ENGINE_LIST_SUCCESS,
    DELETE_MATCH_ENGINE_LIST_FAILURE,
} from 'Actions/types';

//action for Get Match Engine and set type for reducers
export const getMatchEngineList = (Data) => ({
    type: GET_MATCH_ENGINE_LIST,
    payload: { Data }
});

//action for set Success and Get Match Engine and set type for reducers
export const getMatchEngineListSuccess = (response) => ({
    type: GET_MATCH_ENGINE_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to Get Match Engine and set type for reducers
export const getMatchEngineListFailure = (error) => ({
    type: GET_MATCH_ENGINE_LIST_FAILURE,
    payload: error.message
});

//action for add Match Engine and set type for reducers
export const addMatchEngineList = (Data) => ({
    type: ADD_MATCH_ENGINE_LIST,
    payload: { Data }
});

//action for set Success and add Match Engine and set type for reducers
export const addMatchEngineListSuccess = (response) => ({
    type: ADD_MATCH_ENGINE_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to add Match Engine and set type for reducers
export const addMatchEngineListFailure = (error) => ({
    type: ADD_MATCH_ENGINE_LIST_FAILURE,
    payload: error.message
});


//action for UPDATE Match Engine and set type for reducers
export const updateMatchEngineList = (Data) => ({
    type: UPDATE_MATCH_ENGINE_LIST,
    payload: { Data }
});

//action for set Success and UPDATE Match Engine and set type for reducers
export const updateMatchEngineListSuccess = (response) => ({
    type: UPDATE_MATCH_ENGINE_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to UPDATE Match Engine and set type for reducers
export const updateMatchEngineListFailure = (error) => ({
    type: UPDATE_MATCH_ENGINE_LIST_FAILURE,
    payload: error.message
});


//action for delete Match Engine and set type for reducers
export const deleteMatchEngineList = (Data) => ({
    type:DELETE_MATCH_ENGINE_LIST,
    payload: { Data }
});

//action for set Success and delete Match Engine and set type for reducers
export const deleteMatchEngineListSuccess = (response) => ({
    type:DELETE_MATCH_ENGINE_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to delete Match Engine and set type for reducers
export const deleteMatchEngineListFailure = (error) => ({
    type:DELETE_MATCH_ENGINE_LIST_FAILURE,
    payload: error.message
});
