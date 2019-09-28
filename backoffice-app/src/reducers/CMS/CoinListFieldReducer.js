// CoinListFieldReducer.js
import {
    // when user logout than clear reducer data
    ACTION_LOGOUT,

    // for get Coin List Field
    GET_COIN_LIST_FIELDS,
    GET_COIN_LIST_FIELDS_SUCCESS,
    GET_COIN_LIST_FIELDS_FAILURE,

    // for update data
    UPDATE_COIN_LIST_FIELDS,
    UPDATE_COIN_LIST_FIELDS_SUCCESS,
    UPDATE_COIN_LIST_FIELDS_FAILURE,

    // for clear Coin List field Data
    CLEAR_COIN_LIST_FIELDS_DATA
} from '../../actions/ActionTypes';

// Initial State for Coin List Field
const INITIAL_STATE = {
    // Coin List Field
    CoinListFieldData: null,
    CoinListFieldDataLoading: false,
    CoinListFieldDataError: false,

    // updated data of Coin list field
    UpdateCoinlistFieldData: null,
    UpdateCoinlistFieldDataLoading: false,
}

export default function CoinListFieldReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Coin List Field method data
        case GET_COIN_LIST_FIELDS:
            return Object.assign({}, state, {
                CoinListFieldData: null,
                CoinListFieldDataLoading: true
            })
        // Set Coin List Field success data
        case GET_COIN_LIST_FIELDS_SUCCESS:
            return Object.assign({}, state, {
                CoinListFieldData: action.data,
                CoinListFieldDataLoading: false,
            })
        // Set Coin List Field failure data
        case GET_COIN_LIST_FIELDS_FAILURE:
            return Object.assign({}, state, {
                CoinListFieldData: null,
                CoinListFieldDataLoading: false,
                CoinListFieldDataError: true
            })

        // Handle update Coin List Field method data
        case UPDATE_COIN_LIST_FIELDS:
            return Object.assign({}, state, {
                UpdateCoinlistFieldData: null,
                UpdateCoinlistFieldDataLoading: true
            })
        // Set updated Coin List Field success data
        case UPDATE_COIN_LIST_FIELDS_SUCCESS:
            return Object.assign({}, state, {
                UpdateCoinlistFieldData: action.data,
                UpdateCoinlistFieldDataLoading: false,
            })
        // Set updated Coin List Field failure data
        case UPDATE_COIN_LIST_FIELDS_FAILURE:
            return Object.assign({}, state, {
                UpdateCoinlistFieldData: null,
                UpdateCoinlistFieldDataLoading: false,
            })

        // Clear Coin List Field method data
        case CLEAR_COIN_LIST_FIELDS_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}