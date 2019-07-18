// Action types for Leader Board 
import {
    //Get Leader Board List
    GET_LEADER_BOARD_LIST,
    GET_LEADER_BOARD_LIST_SUCCESS,
    GET_LEADER_BOARD_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for Leader Board Data
const INITIAL_STATE = {
    // Leader Board List
    LeaderBoardListFetchData: true,
    LeaderBoardListdata: '',
    LeaderBoardListisFetching: false,
}

const LeaderBoardReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle leader board list method data
        case GET_LEADER_BOARD_LIST:
            return Object.assign({}, state, {
                LeaderBoardListFetchData: true,
                LeaderBoardListisFetching: true,
                LeaderBoardListdata: ''
            });
        // Set leader board list success and failure data
        case GET_LEADER_BOARD_LIST_SUCCESS:
        case GET_LEADER_BOARD_LIST_FAILURE:
            return Object.assign({}, state, {
                LeaderBoardListFetchData: false,
                LeaderBoardListisFetching: false,
                LeaderBoardListdata: action.payload
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default LeaderBoardReducer;