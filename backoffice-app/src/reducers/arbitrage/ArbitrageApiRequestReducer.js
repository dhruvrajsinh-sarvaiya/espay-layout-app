import {
    // Action Logout
    ACTION_LOGOUT,

    // for get list of Arbitrage Api Request
    GET_ARBITRAGE_API_REQUEST_LIST,
    GET_ARBITRAGE_API_REQUEST_LIST_SUCCESS,
    GET_ARBITRAGE_API_REQUEST_LIST_FAILURE,

    // for Add  Arbitrage Api Request
    ADD_ARBITRAGE_API_REQUEST_LIST,
    ADD_ARBITRAGE_API_REQUEST_LIST_SUCCESS,
    ADD_ARBITRAGE_API_REQUEST_LIST_FAILURE,

    // for Update Arbitrage Api Request
    UPDATE_ARBITRAGE_API_REQUEST_LIST,
    UPDATE_ARBITRAGE_API_REQUEST_LIST_SUCCESS,
    UPDATE_ARBITRAGE_API_REQUEST_LIST_FAILURE,

    // for app type list
    GET_APP_TYPE,
    GET_APP_TYPE_SUCCESS,
    GET_APP_TYPE_FAILURE,

    // all third party response list
    GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST,
    GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_SUCCESS,
    GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_FAILURE,

    // clear Arbitrage Api Request Data
    CLEAR_ARBITRAGE_API_REQUEST_DATA

} from "../../actions/ActionTypes";

// Initial State for Arbitrage Api Request
const INITIAL_STATE = {

    // for arbitarge Api Request List
    ArbiApiRequestList: null,
    ArbiApiRequestLoading: false,
    ArbiApiRequestError: false,

    // for Add Arbitrage Api request
    AddArbiApiRequest: null,
    AddArbiApiRequestLoading: false,

    // for Update Arbitrage Api request
    UpdateArbiApiRequest: null,
    UpdateArbiApiRequestLoading: false,

    // for app type list
    AppTypeList: null,
    AppTypeDataLoading: false,

    // for All third Party Response
    ThirdpartyResponseList: null,
    ThirdpartyResponseLoading: false,

}

export default function ArbitrageApiRequestReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Arbitrage Api Request method data
        case GET_ARBITRAGE_API_REQUEST_LIST:
            return Object.assign({}, state, {
                ArbiApiRequestList: null,
                ArbiApiRequestLoading: true
            })
        // Set Arbitrage Api Request success data
        case GET_ARBITRAGE_API_REQUEST_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbiApiRequestList: action.data,
                ArbiApiRequestLoading: false,
            })
        // Set Arbitrage Api Request failure data
        case GET_ARBITRAGE_API_REQUEST_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbiApiRequestList: null,
                ArbiApiRequestLoading: false,
                ArbiApiRequestError: true
            })

        // Handle Add Arbitrage Api Request method data
        case ADD_ARBITRAGE_API_REQUEST_LIST:
            return Object.assign({}, state, {
                AddArbiApiRequest: null,
                AddArbiApiRequestLoading: true
            })
        // Set Add Arbitrage Api Request success data
        case ADD_ARBITRAGE_API_REQUEST_LIST_SUCCESS:
            return Object.assign({}, state, {
                AddArbiApiRequest: action.data,
                AddArbiApiRequestLoading: false,
            })
        // Set Add Arbitrage Api Request failure data
        case ADD_ARBITRAGE_API_REQUEST_LIST_FAILURE:
            return Object.assign({}, state, {
                AddArbiApiRequest: null,
                AddArbiApiRequestLoading: false,
            })

        // Handle Update Arbitrage Api Request method data
        case UPDATE_ARBITRAGE_API_REQUEST_LIST:
            return Object.assign({}, state, {
                UpdateArbiApiRequest: null,
                UpdateArbiApiRequestLoading: true
            })
        // Set Update Arbitrage Api Request success data
        case UPDATE_ARBITRAGE_API_REQUEST_LIST_SUCCESS:
            return Object.assign({}, state, {
                UpdateArbiApiRequest: action.data,
                UpdateArbiApiRequestLoading: false,
            })
        // Set Update Arbitrage Api Request failure data
        case UPDATE_ARBITRAGE_API_REQUEST_LIST_FAILURE:
            return Object.assign({}, state, {
                UpdateArbiApiRequest: null,
                UpdateArbiApiRequestLoading: false,
            })

        // Handle App Type method data
        case GET_APP_TYPE:
            return Object.assign({}, state, {
                AppTypeList: null,
                AppTypeDataLoading: true
            })
        // Set App Type success data
        case GET_APP_TYPE_SUCCESS:
            return Object.assign({}, state, {
                AppTypeList: action.payload,
                AppTypeDataLoading: false,
            })
        // Set App Type failure data
        case GET_APP_TYPE_FAILURE:
            return Object.assign({}, state, {
                AppTypeList: null,
                AppTypeDataLoading: false,
            })

        // Handle third party response list method data
        case GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST:
            return Object.assign({}, state, {
                ThirdpartyResponseList: null,
                ThirdpartyResponseLoading: true
            })
        // Set hird party response list success data
        case GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_SUCCESS:
            return Object.assign({}, state, {
                ThirdpartyResponseList: action.data,
                ThirdpartyResponseLoading: false,
            })
        // Set hird party response list failure data
        case GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_FAILURE:
            return Object.assign({}, state, {
                ThirdpartyResponseList: null,
                ThirdpartyResponseLoading: false,
            })

        // Clear Arbitrage Api Request method data
        case CLEAR_ARBITRAGE_API_REQUEST_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}