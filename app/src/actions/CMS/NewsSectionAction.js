import {
	// Fetch NewsSection 
	NEWSSECTION_FETCH,
	NEWSSECTION_FETCH_SUCCESS,
	NEWSSECTION_FETCH_FAILURE,

	// Clear NewsSection Data
	CLEAR_NEWSSECTION_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Fetch NewsSection Data
export function NewsSectionFatchData() {
	return action(NEWSSECTION_FETCH)
}
// Redux action to Fetch NewsSection Data Success
export function NewsSectionDataSuccess(data) {
	return action(NEWSSECTION_FETCH_SUCCESS, { data })
}
// Redux action to Fetch NewsSection Data Failure
export function NewsSectionDataFailure() {
	return action(NEWSSECTION_FETCH_FAILURE)
}

//For Clear Data
export function NewsSectionDataClear() {
	return action(CLEAR_NEWSSECTION_DATA)
}