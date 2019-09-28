// BOContactUsReducer
import {

    //get contact us list
    GET_CONTACT_US_LIST,
    GET_CONTACT_US_LIST_SUCCESS,
    GET_CONTACT_US_LIST_FAILURE,

    //clear data
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of contactus
    iscontactuslistFetch: false,
    contactuslistDataget: null,
    contactuslistdataFetch: true,
}

export default function ContactUsReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout 
        case ACTION_LOGOUT:
            return initialState

        // Handle contact us list method data
        case GET_CONTACT_US_LIST:
            return Object.assign({}, state, {
                iscontactuslistFetch: true,
                contactuslistDataget: null,
                contactuslistdataFetch: true,
            })
        // Set contact us list success data
        case GET_CONTACT_US_LIST_SUCCESS:
            return Object.assign({}, state, {
                iscontactuslistFetch: false,
                contactuslistDataget: action.data,
                contactuslistdataFetch: false,
            })
        // Set contact us list success data
        case GET_CONTACT_US_LIST_FAILURE:
            return Object.assign({}, state, {
                iscontactuslistFetch: false,
                contactuslistDataget: null,
                contactuslistdataFetch: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}