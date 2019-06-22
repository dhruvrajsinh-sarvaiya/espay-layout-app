import {
  // About Us
  ABOUTUS_FETCH_DATA,
  ABOUTUS_SUCCESS,
  ABOUTUS_FAILURE
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to About Us
export function AboutUsFatchData() {
  return action(ABOUTUS_FETCH_DATA);
}
// Redux action to About Us Success
export function aboutUsFetchDataSuccess(data) {
  return action(ABOUTUS_SUCCESS, data);
}
// Redux action to About Us Failure
export function aboutUsFetchDataFailure() {
  return action(ABOUTUS_FAILURE);
}