import {

    //get contact us list
    GET_CONTACT_US_LIST,
    GET_CONTACT_US_LIST_SUCCESS,
    GET_CONTACT_US_LIST_FAILURE
} from '../ActionTypes'
import { action } from '../../actions/GlobalActions';

// --------------- for contactus list--------------
//To fetch data
export function GetContactusList(data) {
    return action(GET_CONTACT_US_LIST, { data })
}

//On success result
export function GetContactusListSuccess(data) {
    return action(GET_CONTACT_US_LIST_SUCCESS, { data })
}

//On Failure
export function GetContactusListFailure() {
    return action(GET_CONTACT_US_LIST_FAILURE)
}
// --------------------------------
