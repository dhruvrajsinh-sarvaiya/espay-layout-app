// TemplateReducer

import {

    //get email templates 
    GET_EMAILTEMPLATES,
    GET_EMAILTEMPLATES_SUCCESS,
    GET_EMAILTEMPLATES_FAILURE,

    //get templates list
    GET_LISTTEMPLATES,
    GET_LISTTEMPLATES_SUCCESS,
    GET_LISTTEMPLATES_FAILURE,

    //add email template
    ADD_NEW_EMAILTEMPLATE,
    ADD_NEW_EMAILTEMPLATE_SUCCESS,
    ADD_NEW_EMAILTEMPLATE_FAILURE,

    //update email template
    UPDATE_EMAILTEMPLATE,
    UPDATE_EMAILTEMPLATE_SUCCESS,
    UPDATE_EMAILTEMPLATE_FAILURE,

    //get email template by id
    GET_EMAILTEMPLATE_BY_ID,
    GET_EMAILTEMPLATE_BY_ID_SUCCESS,
    GET_EMAILTEMPLATE_BY_ID_FAILURE,

    //update template status
    UPDATE_TEMPLATE_STATUS,
    UPDATE_TEMPLATE_STATUS_SUCCESS,
    UPDATE_TEMPLATE_STATUS_FAILURE,

    //clear data
    CLEAR_TEMPLATE_STATUS,
    CLEAR_TEMPLATE_ADD_UPDATE,
    CLEAR_TEMPLATE,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// initial state
const initialState = {

    //template list
    templates_list: null,
    templates_listing: null,

    //update teo
    updateTemplateData: null,
    loading: false,
    data: null,
    templatedetail: {},
    updatestatus: '',
    errors: {},
    statusChange: false,
    statusResponse: null
}

export default function TemplateReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // for clear all data when logout 
        case ACTION_LOGOUT:
            return initialState;

        // for clear all data 
        case CLEAR_TEMPLATE:
            return {
                ...state,
                templates_list: null,
                templates_listing: null,
                updateTemplateData: null,
                templatedetail: {},
            }

        // get Email Templates List
        case GET_EMAILTEMPLATES:
            return Object.assign({}, state, { loading: true, data: null, statusResponse: null })

        // get Email Templates List success
        case GET_EMAILTEMPLATES_SUCCESS:
            return Object.assign({}, state, { loading: false, data: null, templates_list: action.payload, statusResponse: null })

        // get Email Templates List failure
        case GET_EMAILTEMPLATES_FAILURE:
            return Object.assign({}, state, { loading: false, data: action.payload })

        // get Email List Templates List
        case GET_LISTTEMPLATES:
            return Object.assign({}, state, { loading: true, statusResponse: null })

        // get Email List Templates List success
        case GET_LISTTEMPLATES_SUCCESS:
            return Object.assign({}, state, { loading: false, templates_listing: action.payload })

        // get Email List Templates List failure
        case GET_LISTTEMPLATES_FAILURE:
            return Object.assign({}, state, { loading: false, templates_listing: action.payload })

        // add new Email Template
        case ADD_NEW_EMAILTEMPLATE:
            return Object.assign({}, state, { loading: true, data: null })

        // add new Email Template success
        case ADD_NEW_EMAILTEMPLATE_SUCCESS:
            return Object.assign({}, state, { loading: false, data: action.payload })

        // add new Email Template failure
        case ADD_NEW_EMAILTEMPLATE_FAILURE:
            return Object.assign({}, state, { loading: false, data: action.payload })

        // Update Email Template Data
        case UPDATE_EMAILTEMPLATE:
            return Object.assign({}, state, { loading: true, updateTemplateData: null, })

        // Update Email Template success
        case UPDATE_EMAILTEMPLATE_SUCCESS:
            return Object.assign({}, state, { loading: false, updateTemplateData: action.payload, })

        // Update Email Template fail
        case UPDATE_EMAILTEMPLATE_FAILURE:
            return Object.assign({}, state, { loading: false, updateTemplateData: null })

        // get Email Template by id 
        case GET_EMAILTEMPLATE_BY_ID:
            return Object.assign({}, state, { loading: true, data: null, updatestatus: '' })

        //  Email Template by id success
        case GET_EMAILTEMPLATE_BY_ID_SUCCESS:
            return Object.assign({}, state, { loading: false, data: null, templatedetail: action.payload })

        // Email Template by id Fail
        case GET_EMAILTEMPLATE_BY_ID_FAILURE:
            return Object.assign({}, state, { loading: false, data: null })

        // Update template status
        case UPDATE_TEMPLATE_STATUS:
            return Object.assign({}, state, { statusChange: true, statusResponse: null, })

        // Update template status success
        case UPDATE_TEMPLATE_STATUS_SUCCESS:
            return Object.assign({}, state, { statusChange: false, statusResponse: action.payload })

        // Update template status fail
        case UPDATE_TEMPLATE_STATUS_FAILURE:
            return Object.assign({}, state, { statusChange: false, error: action.payload })

        // clear template status
        case CLEAR_TEMPLATE_STATUS:
            return Object.assign({}, state, { statusChange: false, statusResponse: null })

        // clear template status
        case CLEAR_TEMPLATE_ADD_UPDATE:
            return Object.assign({}, state, { data: null, updateTemplateData: null, loading: false })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
