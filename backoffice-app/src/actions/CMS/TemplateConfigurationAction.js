// TemplateConfigurationAction.js
import {
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
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action for Template Configuration data
export function getTemplateConfigurationList() {
    return action(GET_TEMPLATE_CONFIGURATION_LIST)
}

// Redux action for Template Configuration data success
export function getTemplateConfigurationListSuccess(data) {
    return action(GET_TEMPLATE_CONFIGURATION_LIST_SUCCESS, { data })
}

// Redux action for Template Configuration data failure
export function getTemplateConfigurationListFailure() {
    return action(GET_TEMPLATE_CONFIGURATION_LIST_FAILURE)
}

// Redux action for Template Category Type data failure
export function getTemplateCategoryType(payload = {}) {
    return action(GET_TEMPLATE_CATEGORY_TYPE, { payload })
}

// Redux action for Template Category Type data success
export function getTemplateCategoryTypeSuccess(data) {
    return action(GET_TEMPLATE_CATEGORY_TYPE_SUCCESS, { data })
}

// Redux action for Template Category Type data failure
export function getTemplateCategoryTypeFailure() {
    return action(GET_TEMPLATE_CATEGORY_TYPE_FAILURE)
}

// Redux action for Update Template Configuration data failure
export function updateTemplateConfiguration(payload = {}) {
    return action(UPDATE_TEMPLATE_CONFIGURATION, { payload })
}

// Redux action for Update Template Configuration data success
export function updateTemplateConfigurationSuccess(data) {
    return action(UPDATE_TEMPLATE_CONFIGURATION_SUCCESS, { data })
}

// Redux action for Update Template Configuration data failure
export function updateTemplateConfigurationFailure() {
    return action(UPDATE_TEMPLATE_CONFIGURATION_FAILURE)
}

// Redux action for clear Template Configuration data
export function clearTemplateConfigurationList() {
    return action(CLEAR_TEMPLATE_CONFIGURATION_DATA)
}