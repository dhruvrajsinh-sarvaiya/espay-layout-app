// Reducer For Handle Api match engine list Tejas
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
  DELETE_MATCH_ENGINE_LIST_FAILURE
} from "Actions/types";

import { NotificationManager } from "react-notifications";

// Set Initial State
const INITIAL_STATE = {
  matchEngineList: [],
  addMatchEngineList: [],
  updateMatchEngineList: [],
  deleteMatchEngineList: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Match Engine List
    case GET_MATCH_ENGINE_LIST:
      return { ...state, loading: true };

    // set Data Of Match Engine List
    case GET_MATCH_ENGINE_LIST_SUCCESS:
      return { ...state, matchEngineList: action.payload, loading: false };

    // Display Error for Match Engine List failure
    case GET_MATCH_ENGINE_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, matchEngineList: [] };

    // Add Match Engine List
    case ADD_MATCH_ENGINE_LIST:
      return { ...state, loading: true };

    // set Data Of Add Match Engine List
    case ADD_MATCH_ENGINE_LIST_SUCCESS:
      return { ...state, addMatchEngineList: action.payload, loading: false };

    // Display Error for Add Match Engine List failure
    case ADD_MATCH_ENGINE_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, addMatchEngineList: [] };

    // update Match Engine List
    case UPDATE_MATCH_ENGINE_LIST:
      return { ...state, loading: true };

    // set Data Of update Match Engine List
    case UPDATE_MATCH_ENGINE_LIST_SUCCESS:
      return {
        ...state,
        updateMatchEngineList: action.payload,
        loading: false
      };

    // Display Error for update Match Engine List failure
    case UPDATE_MATCH_ENGINE_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, updateMatchEngineList: [] };

    // delete Match Engine List
    case DELETE_MATCH_ENGINE_LIST:
      return { ...state, loading: true };

    // set Data Of delete Match Engine List
    case DELETE_MATCH_ENGINE_LIST_SUCCESS:
      return {
        ...state,
        deleteMatchEngineList: action.payload,
        loading: false
      };

    // Display Error for delete Match Engine List failure
    case DELETE_MATCH_ENGINE_LIST_FAILURE:
      NotificationManager.error(action.error);
      return { ...state, loading: false, deleteMatchEngineList: [] };

    default:
      return { ...state };
  }
};
