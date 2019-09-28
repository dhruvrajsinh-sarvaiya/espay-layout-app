import {
    // for api key config count
    API_KEY_CONFIG_DASHBOARD_COUNT,
    API_KEY_CONFIG_DASHBOARD_COUNT_SUCCESS,
    API_KEY_CONFIG_DASHBOARD_COUNT_FAILURE,

    // for statistics count
    GET_API_REQUEST_STATISTICS_COUNT,
    GET_API_REQUEST_STATISTICS_COUNT_SUCCESS,
    GET_API_REQUEST_STATISTICS_COUNT_FAILURE,

    // for frequently use api
    GET_FREQUENT_USE_API,
    GET_FREQUENT_USE_API_SUCCESS,
    GET_FREQUENT_USE_API_FAILURE,

    // for most active ip address
    MOST_ACTIVE_IP_ADDRESS,
    MOST_ACTIVE_IP_ADDRESS_SUCCESS,
    MOST_ACTIVE_IP_ADDRESS_FAILURE,

    // for clear dashboard data
    CLEAR_API_KEY_CONFIG_DASHBOARD
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Api Key Dashboard Count
export function getApiKeyDasboardCount() {
    return action(API_KEY_CONFIG_DASHBOARD_COUNT)
}

// Redux action for Api Key Dashboard Count Success
export function getApiKeyDasboardCountSuccess(data) {
    return action(API_KEY_CONFIG_DASHBOARD_COUNT_SUCCESS, { data })
}

// Redux action for Api Key Dashboard Count Failure
export function getApiKeyDasboardCountFailure() {
    return action(API_KEY_CONFIG_DASHBOARD_COUNT_FAILURE)
}

// Redux action for Api Key Dashboard statistics count
export function getApiRequestStatisticsCount() {
    return action(GET_API_REQUEST_STATISTICS_COUNT)
}

// Redux action for Api Key Dashboard statistics count Success
export function getApiRequestStatisticsCountSuccess(data) {
    return action(GET_API_REQUEST_STATISTICS_COUNT_SUCCESS, { data })
}

// Redux action for Api Key Dashboard statistics count Failure
export function getApiRequestStatisticsCountFailure() {
    return action(GET_API_REQUEST_STATISTICS_COUNT_FAILURE)
}

// Redux action for frequently use api
export function getFrequentlyUseApi() {
    return action(GET_FREQUENT_USE_API)
}

// Redux action for frequently use api Success
export function getFrequentlyUseApiSuccess(data) {
    return action(GET_FREQUENT_USE_API_SUCCESS, { data })
}

// Redux action for frequently use api Failure
export function getFrequentlyUseApiFailure() {
    return action(GET_FREQUENT_USE_API_FAILURE)
}

// Redux action formost active ip address
export function getMostActiveIpAddress() {
    return action(MOST_ACTIVE_IP_ADDRESS)
}

// Redux action for most active ip address Success
export function getMostActiveIpAddressSuccess(data) {
    return action(MOST_ACTIVE_IP_ADDRESS_SUCCESS, { data })
}

// Redux action for most active ip address Failure
export function getMostActiveIpAddressFailure() {
    return action(MOST_ACTIVE_IP_ADDRESS_FAILURE)
}

// Redux action for clear dashboard data
export function clearApiKeyConfigDashboard() {
    return action(CLEAR_API_KEY_CONFIG_DASHBOARD)
}