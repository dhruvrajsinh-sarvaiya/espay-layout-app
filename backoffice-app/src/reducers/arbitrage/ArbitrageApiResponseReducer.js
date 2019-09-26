// ArbitrageApiResponseReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for get list of Arbitrage Api Response
    GET_ARBITRAGE_API_RESPONSE_LIST,
    GET_ARBITRAGE_API_RESPONSE_LIST_SUCCESS,
    GET_ARBITRAGE_API_RESPONSE_LIST_FAILURE,

    // for Add Arbitrage Api Response
    ADD_ARBITRAGE_API_RESPONSE_LIST,
    ADD_ARBITRAGE_API_RESPONSE_LIST_SUCCESS,
    ADD_ARBITRAGE_API_RESPONSE_LIST_FAILURE,

    // for Update Arbitrage Api Response
    UPDATE_ARBITRAGE_API_RESPONSE_LIST,
    UPDATE_ARBITRAGE_API_RESPONSE_LIST_SUCCESS,
    UPDATE_ARBITRAGE_API_RESPONSE_LIST_FAILURE,

    // clear Arbitrage Api Response Data
    CLEAR_ARBITRAGE_API_RESPONSE_DATA

} from "../../actions/ActionTypes";

// Initial State for Arbitrage Api Response
const INITIAL_STATE = {

    // for arbitarge Api Response List
    ArbiApiResponseList: null,
    ArbiApiResponseLoading: false,
    ArbiApiResponseError: false,

    // for Add Arbitrage Api Response
    AddArbiApiResponse: null,
    AddArbiApiResponseLoading: false,

    // for Update Arbitrage Api Response
    UpdateArbiApiResponse: null,
    UpdateArbiApiResponseLoading: false,
}

export default function ArbitrageApiResponseReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Arbitrage Api Response method data
        case GET_ARBITRAGE_API_RESPONSE_LIST:
            return Object.assign({}, state, {
                ArbiApiResponseList: null,
                ArbiApiResponseLoading: true
            })
        // Set Arbitrage Api Response success data
        case GET_ARBITRAGE_API_RESPONSE_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbiApiResponseList: action.data,
                ArbiApiResponseLoading: false,
            })
        // Set Arbitrage Api Response failure data
        case GET_ARBITRAGE_API_RESPONSE_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbiApiResponseList: null,
                ArbiApiResponseLoading: false,
                ArbiApiResponseError: true
            })
        // Handle Add Arbitrage Api Response method data
        case ADD_ARBITRAGE_API_RESPONSE_LIST:
            return Object.assign({}, state, {
                AddArbiApiResponse: null,
                AddArbiApiResponseLoading: true
            })
        // Set Add Arbitrage Api Response success data
        case ADD_ARBITRAGE_API_RESPONSE_LIST_SUCCESS:
            return Object.assign({}, state, {
                AddArbiApiResponse: action.data,
                AddArbiApiResponseLoading: false,
            })
        // Set Add Arbitrage Api Response failure data
        case ADD_ARBITRAGE_API_RESPONSE_LIST_FAILURE:
            return Object.assign({}, state, {
                AddArbiApiResponse: null,
                AddArbiApiResponseLoading: false,
            })

        // Handle Update Arbitrage Api Response method data
        case UPDATE_ARBITRAGE_API_RESPONSE_LIST:
            return Object.assign({}, state, {
                UpdateArbiApiResponse: null,
                UpdateArbiApiResponseLoading: true
            })
        // Set Update Arbitrage Api Response success data
        case UPDATE_ARBITRAGE_API_RESPONSE_LIST_SUCCESS:
            return Object.assign({}, state, {
                UpdateArbiApiResponse: action.data,
                UpdateArbiApiResponseLoading: false,
            })
        // Set Update Arbitrage Api Response failure data
        case UPDATE_ARBITRAGE_API_RESPONSE_LIST_FAILURE:
            return Object.assign({}, state, {
                UpdateArbiApiResponse: null,
                UpdateArbiApiResponseLoading: false,
            })


        // Clear Arbitrage Api Response method data
        case CLEAR_ARBITRAGE_API_RESPONSE_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}