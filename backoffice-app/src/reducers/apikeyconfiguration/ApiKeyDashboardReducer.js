import {
    // Action Logout
    ACTION_LOGOUT,

    // Api Key Configuration Dashboard Count
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

} from "../../actions/ActionTypes";

// Initial State for Api Key Dashboard Count
const INITIAL_STATE = {

    // for Api Key Dashboard Count
    ApiKeyDasboardCount: null,
    ApiKeyDasboardCountLoading: false,

    // for statistics count
    ApiKeyStatisticsCount: null,
    ApiKeyStatisticsCountLoading: false,

    // for frequently use api
    FrequentlyUsedApiData: null,
    FrequentlyUsedApiDataLoading: false,

    // for most active ip address
    MostActiveIpAddressData: null,
    MostActiveIpAddressDataLoading: false
}

export default function ApiKeyDashboardReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Api Key Dasboard Count method data
        case API_KEY_CONFIG_DASHBOARD_COUNT:
            return Object.assign({}, state, {
                ApiKeyDasboardCount: null,
                ApiKeyDasboardCountLoading: true
            })
        // Set Api Key Dasboard Count success data
        case API_KEY_CONFIG_DASHBOARD_COUNT_SUCCESS:
            return Object.assign({}, state, {
                ApiKeyDasboardCount: action.data,
                ApiKeyDasboardCountLoading: false,
            })
        // Set Api Key Dasboard Count failure data
        case API_KEY_CONFIG_DASHBOARD_COUNT_FAILURE:
            return Object.assign({}, state, {
                ApiKeyDasboardCount: null,
                ApiKeyDasboardCountLoading: false,
            })

        // Handle Api Key Dasboard statistics count method data
        case GET_API_REQUEST_STATISTICS_COUNT:
            return Object.assign({}, state, {
                ApiKeyStatisticsCount: null,
                ApiKeyStatisticsCountLoading: true
            })
        // Set Api Key Dasboard statistics count success data
        case GET_API_REQUEST_STATISTICS_COUNT_SUCCESS:
            return Object.assign({}, state, {
                ApiKeyStatisticsCount: action.data,
                ApiKeyStatisticsCountLoading: false,
            })
        // Set Api Key Dasboard statistics count failure data
        case GET_API_REQUEST_STATISTICS_COUNT_FAILURE:
            return Object.assign({}, state, {
                ApiKeyStatisticsCount: null,
                ApiKeyStatisticsCountLoading: false,
            })

        // Handle frequently use api method data
        case GET_FREQUENT_USE_API:
            return Object.assign({}, state, {
                FrequentlyUsedApiData: null,
                FrequentlyUsedApiDataLoading: true
            })
        // Set frequently use api success data
        case GET_FREQUENT_USE_API_SUCCESS:
            return Object.assign({}, state, {
                FrequentlyUsedApiData: action.data,
                FrequentlyUsedApiDataLoading: false,
            })
        // Set frequently use api failure data
        case GET_FREQUENT_USE_API_FAILURE:
            return Object.assign({}, state, {
                FrequentlyUsedApiData: null,
                FrequentlyUsedApiDataLoading: false,
            })

        // for most active ip address
        // MOST_ACTIVE_IP_ADDRESS,
        // MOST_ACTIVE_IP_ADDRESS_SUCCESS,
        // MOST_ACTIVE_IP_ADDRESS_FAILURE,

        // Handle most active ip address method data
        case MOST_ACTIVE_IP_ADDRESS:
            return Object.assign({}, state, {
                MostActiveIpAddressData: null,
                MostActiveIpAddressDataLoading: true
            })
        // Set most active ip address success data
        case MOST_ACTIVE_IP_ADDRESS_SUCCESS:
            return Object.assign({}, state, {
                MostActiveIpAddressData: action.data,
                MostActiveIpAddressDataLoading: false,
            })
        // Set most active ip address failure data
        case MOST_ACTIVE_IP_ADDRESS_FAILURE:
            return Object.assign({}, state, {
                MostActiveIpAddressData: null,
                MostActiveIpAddressDataLoading: false,
            })

        //Clear data
        case CLEAR_API_KEY_CONFIG_DASHBOARD:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}