// TemplateConfigurationReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for Template Configuration data
    GET_TEMPLATE_CONFIGURATION_LIST,
    GET_TEMPLATE_CONFIGURATION_LIST_SUCCESS,
    GET_TEMPLATE_CONFIGURATION_LIST_FAILURE,

    // for get template category by id
    GET_TEMPLATE_CATEGORY_TYPE,
    GET_TEMPLATE_CATEGORY_TYPE_SUCCESS,
    GET_TEMPLATE_CATEGORY_TYPE_FAILURE,

    // for update template 
    UPDATE_TEMPLATE_CONFIGURATION,
    UPDATE_TEMPLATE_CONFIGURATION_SUCCESS,
    UPDATE_TEMPLATE_CONFIGURATION_FAILURE,

    // for Clear Template Configuration data
    CLEAR_TEMPLATE_CONFIGURATION_DATA
} from '../../actions/ActionTypes';

// Initial State for Template Configuration Module
const INITIAL_STATE = {
    // for Template Configuration
    TemplateConfigurationList: null,
    TemplateConfigListLoading: false,
    TemplateConfigErro: false,

    // for get template category list
    TemplateCategoryList: null,
    TemplateCategoryLoading: false,

    // for Update TemplateConfiguration
    UpdatedTemplateData: null,
    updatedTemplateDataLoading: false
}

export default function TemplateConfigurationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
      
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Template Configuration Data method
        case GET_TEMPLATE_CONFIGURATION_LIST:
            return Object.assign({}, state, {
                TemplateConfigurationList: null,
                TemplateConfigListLoading: true
            })
        // Set Template Configuration Data success
        case GET_TEMPLATE_CONFIGURATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                TemplateConfigurationList: action.data,
                TemplateConfigListLoading: false,
            })
        // Set Template Configuration Data failure
        case GET_TEMPLATE_CONFIGURATION_LIST_FAILURE:
            return Object.assign({}, state, {
                TemplateConfigurationList: null,
                TemplateConfigListLoading: false,
                TemplateConfigErro: true
            })

        // Handle Template Category Type Data method
        case GET_TEMPLATE_CATEGORY_TYPE:
            return Object.assign({}, state, {
                TemplateCategoryList: null,
                TemplateCategoryLoading: true
            })
        // Set Template Category Type Data success
        case GET_TEMPLATE_CATEGORY_TYPE_SUCCESS:
            return Object.assign({}, state, {
                TemplateCategoryList: action.data,
                TemplateCategoryLoading: false,
            })
        // Set Template Category Type Data failure
        case GET_TEMPLATE_CATEGORY_TYPE_FAILURE:
            return Object.assign({}, state, {
                TemplateCategoryList: null,
                TemplateCategoryLoading: false,
            })

        // Handle Update Template Category Data method
        case UPDATE_TEMPLATE_CONFIGURATION:
            return Object.assign({}, state, {
                UpdatedTemplateData: null,
                updatedTemplateDataLoading: true
            })
        // Set Update Template Category Data success
        case UPDATE_TEMPLATE_CONFIGURATION_SUCCESS:
            return Object.assign({}, state, {
                UpdatedTemplateData: action.data,
                updatedTemplateDataLoading: false,
            })
        // Set Update Template Category Data failure
        case UPDATE_TEMPLATE_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                UpdatedTemplateData: null,
                updatedTemplateDataLoading: false,
            })

        // Handle Clear Template Configuration Data method
        case CLEAR_TEMPLATE_CONFIGURATION_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
