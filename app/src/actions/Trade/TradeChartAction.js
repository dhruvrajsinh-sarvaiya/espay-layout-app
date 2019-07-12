import {
    // Get Graph Details
    GET_GRAPH_DETAILS,
    GET_GRAPH_DETAILS_SUCCESS,
    GET_GRAPH_DETAILS_FAILURE,
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action to Get Graph Detail
export function getGraphDetails(params) {
    return action(GET_GRAPH_DETAILS, { params });
}

// Redux action to Get Graph Detail Success
export function getGraphDetailsSuccess(data) {
    return action(GET_GRAPH_DETAILS_SUCCESS, { data });
}

// Redux action to Get Graph Detail Failure
export function getGraphDetailsFailure() {
    return action(GET_GRAPH_DETAILS_FAILURE);
}