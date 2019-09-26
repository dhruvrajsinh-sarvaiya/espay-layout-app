import { action } from '../GlobalActions';
import { GET_GRAPH_DETAIL, GET_GRAPH_DETAIL_SUCCCESS, GET_GRAPH_DETAIL_FAILURE } from '../ActionTypes';

//Graph Details
export function getGraphData(payload) { return action(GET_GRAPH_DETAIL, { payload }) }

//Graph Details Success Result
export function getGraphDataSuccess(payload) { return action(GET_GRAPH_DETAIL_SUCCCESS, { payload }) }

//Graph Details Failure Result
export function getGraphDataFailure(payload) { return action(GET_GRAPH_DETAIL_FAILURE, { payload }) }