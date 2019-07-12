import {
  // Announcement
  ANNOUCEMENT_FETCH,
  ANNOUCEMENT_FETCH_SUCCESS,
  ANNOUCEMENT_FETCH_FAILURE,
  CLEAR_ANNOUNCEMENT_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Announcement
export function announcementFetchData() {
  return action(ANNOUCEMENT_FETCH)
}
// Redux action to Announcement Success
export function announcementDataSuccess(data) {
  return action(ANNOUCEMENT_FETCH_SUCCESS, { data })
}
// Redux action to Announcement Failure
export function announcementDataFailure() {
  return action(ANNOUCEMENT_FETCH_FAILURE)
}

//for Clear
export function announcementDataClear() {
  return action(CLEAR_ANNOUNCEMENT_DATA)
}