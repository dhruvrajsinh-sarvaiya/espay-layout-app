/**
 * Trade Pair App Reducer By NW
 */
//import update from 'react-addons-update';
import { NotificationManager } from 'react-notifications';

// action types
import {
    GET_PAIR,
    GET_PAIR_SUCCESS,
    GET_PAIR_FAILURE,
    UPDATE_PAIR,
    UPDATE_PAIR_SUCCESS,
    UPDATE_PAIR_FAILURE,
    ADD_TASK,
    ADD_TASK_SUCCESS,
    ADD_TASK_FAILURE,
    GET_TASK,
    GET_TASK_SUCCESS,
    GET_TASK_FAILURE
} from 'Actions/types';

// initial state
const INIT_STATE = {
    pairList: null,
    taskList: []
};

export default (state = INIT_STATE, action) => {
    // console.log('Reducer', action.type);
    switch (action.type) {

        // get pair list
        case GET_PAIR:
            return { ...state, sectionReload: true, pairList: null };

        // get pair list success
        case GET_PAIR_SUCCESS:
            return { ...state, sectionReload: false, pairList: action.payload };

        // get pair list failure
        case GET_PAIR_FAILURE:
            NotificationManager.error(action.payload);
            return { ...state }

        // update pair list
        case UPDATE_PAIR:
            return { ...state };

        // update pair list success
        case UPDATE_PAIR_SUCCESS:
            return { ...state, sectionReload: false, pairList: action.payload };

        // update pair list failure
        case UPDATE_PAIR_FAILURE:
            console.log('UPDATE_PAIR_FAILURE', action.payload);
            return { ...state }

        // update pair list
        case ADD_TASK:
            return { ...state };

        // update pair list success
        case ADD_TASK_SUCCESS:
            NotificationManager.success('Task added successfully.');
            return { ...state, success: true, taskList: action.payload };

        // update pair list failure
        case ADD_TASK_FAILURE:
            NotificationManager.error('Unable to add new task.');
            return { ...state, success: false }

        // update pair list
        case GET_TASK:
            return { ...state };

        // update pair list success
        case GET_TASK_SUCCESS:
            return { ...state, success: true, taskList: action.payload };

        // update pair list failure
        case GET_TASK_FAILURE:
            return { ...state, success: false }


        default: return { ...state };
    }
}
