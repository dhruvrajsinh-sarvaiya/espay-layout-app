import {
    GET_COUNTYLIST,
    GET_COUNTYLIST_SUCCESS,
    GET_COUNTYLIST_FAILURE,
    COUNTYLIST_ADD,
    COUNTYLIST_ADD_SUCCESS,
    COUNTYLIST_ADD_FAILURE,
    COUNTYLIST_ADD_CLEAR,
    COUNTYLIST_EDIT,
    COUNTYLIST_EDIT_SUCCESS,
    COUNTYLIST_EDIT_FAILURE,
    COUNTYLIST_EDIT_CLEAR,
    DELETE_COUNTRY,
    DELETE_COUNTRY_SUCCESS,
    DELETE_COUNTRY_FAILURE,
    DELETE_COUNTRY_CLEAR,

} from '../ActionTypes'
import { action } from '../../actions/GlobalActions';

// --------------- for Countrylist--------------
//To fetch data
export function CountrylistFetchData() {
    return action(GET_COUNTYLIST)
}

//On success result
export function CountrylistDataSuccess(data) {
    return action(GET_COUNTYLIST_SUCCESS, { data })
}

//On Failure
export function CountrylistDataFailure() {
    return action(GET_COUNTYLIST_FAILURE)
}
// --------------------------------


// ------------------ for add Country------------------

//To Add Country 
export function AddCountrylistData(AddCountry) {
    return action(COUNTYLIST_ADD, { AddCountry })
}

//On Add Country success result
export function AddCountrylistSuccess(data) {
    return action(COUNTYLIST_ADD_SUCCESS, { data })
}

//On Add Country Failure
export function AddCountrylistFailure() {
    return action(COUNTYLIST_ADD_FAILURE)
}

// clear Country
export function AddCountrylistClear() {
    return action(COUNTYLIST_ADD_CLEAR)
}
// ---------------------------------------------------

// ------------------------- for edit Country------------
//To Edit Country 
export function EditCountrylistData(editCountry) {
    return action(COUNTYLIST_EDIT,{editCountry})
}

//On Edit Country success result
export function EditCountrylistSuccess(data) {
    return action(COUNTYLIST_EDIT_SUCCESS, { data })
}

//On Edit Country Failure
export function EditCountrylistFailure() {
    return action(COUNTYLIST_EDIT_FAILURE)
}

export function editCountrylistClear() {
    return action(COUNTYLIST_EDIT_CLEAR)
}
// ------------

// ------------------------- for delete Country------------
//To delete Country 
export function DeleteCountrylistData(DeleteCountry) {
    return action(DELETE_COUNTRY,{DeleteCountry})
}

//On delete Country success result
export function DeleteCountrylistSuccess(data) {
    return action(DELETE_COUNTRY_SUCCESS, { data })
}

//On delete Country Failure
export function DeleteCountrylistFailure() {
    return action(DELETE_COUNTRY_FAILURE)
}

export function DeleteCountrylistClear() {
    return action(DELETE_COUNTRY_CLEAR)
}
// ------------
