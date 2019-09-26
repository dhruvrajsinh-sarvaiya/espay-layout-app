import {
    //Third party api response
    GET_THIRD_PARTY_API_RESPONSE_LIST,
    GET_THIRD_PARTY_API_RESPONSE_LIST_SUCCESS,
    GET_THIRD_PARTY_API_RESPONSE_LIST_FAILURE,

    //Third party api response by id
    GET_THIRD_PARTY_API_RESPONSE_BYID,
    GET_THIRD_PARTY_API_RESPONSE_BYID_SUCCESS,
    GET_THIRD_PARTY_API_RESPONSE_BYID_FAILURE,

    //Third party api response add
    ADD_THIRD_PARTY_API_RESPONSE,
    ADD_THIRD_PARTY_API_RESPONSE_SUCCESS,
    ADD_THIRD_PARTY_API_RESPONSE_FAILURE,

    //Third party api response update
    UPDATE_THIRD_PARTY_API_RESPONSE,
    UPDATE_THIRD_PARTY_API_RESPONSE_SUCCESS,
    UPDATE_THIRD_PARTY_API_RESPONSE_FAILURE,

    //clear data
    CLEAN_ADD_UPDATE_THIRD_PARTY_RESPONSE,
    CLEAR_ALL_THIRD_PARTY_RESPONSE_DATA,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {
    //Third party api response
    thirdPartyAPIResponse: null,
    isLoadingthirdPartyAPIResponse: false,
    thirdPartyAPIResponseError: false,

    //Third party api response by id
    thirdPartyAPIResponseByID: null,
    isLoadingthirdPartyAPIResponseByID: false,
    thirdPartyAPIResponseByIDError: false,

    //Add Third party API response
    addThirdPartyAPIResponse: null,
    isLoadingAddThirdPartyAPIResponse: false,
    addThirdPartyAPIResponseError: false,

    //Update Third party API response
    updateThirdPartyAPIResponse: null,
    isLoadingUpdateThirdPartyAPIResponse: false,
    updateThirdPartyAPIResponseError: false,
}

export default function thirdPartyAPIResponseBOReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        case CLEAR_ALL_THIRD_PARTY_RESPONSE_DATA:
            return initialState

        // Clear Add Update Third Party Response
        case CLEAN_ADD_UPDATE_THIRD_PARTY_RESPONSE: {
            return Object.assign({}, state, {
                addThirdPartyAPIResponse: null,
                updateThirdPartyAPIResponse: null
            })
        }

        // Handle Third Party API Response List method data
        case GET_THIRD_PARTY_API_RESPONSE_LIST: {
            return Object.assign({}, state, {
                thirdPartyAPIResponse: null,
                isLoadingthirdPartyAPIResponse: true,
                thirdPartyAPIResponseError: false,
            })
        }
        // Set Third Party API Response List success data
        case GET_THIRD_PARTY_API_RESPONSE_LIST_SUCCESS: {
            return Object.assign({}, state, {
                thirdPartyAPIResponse: action.payload,
                isLoadingthirdPartyAPIResponse: false,
                thirdPartyAPIResponseError: false
            })
        }
        // Set Third Party API Response List failure data
        case GET_THIRD_PARTY_API_RESPONSE_LIST_FAILURE: {
            return Object.assign({}, state, {
                thirdPartyAPIResponse: null,
                isLoadingthirdPartyAPIResponse: false,
                thirdPartyAPIResponseError: true
            })
        }

        // Handle Third Party API Response By ID method data
        case GET_THIRD_PARTY_API_RESPONSE_BYID: {
            return Object.assign({}, state, {
                thirdPartyAPIResponseByID: null,
                isLoadingthirdPartyAPIResponseByID: true,
                thirdPartyAPIResponseByIDError: false,
            })
        }
        // Set Third Party API Response By ID success data
        case GET_THIRD_PARTY_API_RESPONSE_BYID_SUCCESS: {
            return Object.assign({}, state, {
                thirdPartyAPIResponseByID: action.payload,
                isLoadingthirdPartyAPIResponseByID: false,
                thirdPartyAPIResponseByIDError: false
            })
        }
        // Set Third Party API Response By ID failure data
        case GET_THIRD_PARTY_API_RESPONSE_BYID_FAILURE: {
            return Object.assign({}, state, {
                thirdPartyAPIResponseByID: null,
                isLoadingthirdPartyAPIResponseByID: false,
                thirdPartyAPIResponseByIDError: true
            })
        }

        // Handle Add Third Party API Response method data
        case ADD_THIRD_PARTY_API_RESPONSE: {
            return Object.assign({}, state, {
                addThirdPartyAPIResponse: null,
                isLoadingAddThirdPartyAPIResponse: true,
                addThirdPartyAPIResponseError: false,
            })
        }
        // Set Add Third Party API Response success data
        case ADD_THIRD_PARTY_API_RESPONSE_SUCCESS: {
            return Object.assign({}, state, {
                addThirdPartyAPIResponse: action.payload,
                isLoadingAddThirdPartyAPIResponse: false,
                addThirdPartyAPIResponseError: false
            })
        }
        // Set Add Third Party API Response failure data
        case ADD_THIRD_PARTY_API_RESPONSE_FAILURE: {
            return Object.assign({}, state, {
                addThirdPartyAPIResponse: null,
                isLoadingAddThirdPartyAPIResponse: false,
                addThirdPartyAPIResponseError: true
            })
        }

        //To Update Third Party API Response
        case UPDATE_THIRD_PARTY_API_RESPONSE: {
            return Object.assign({}, state, {
                updateThirdPartyAPIResponse: null,
                isLoadingUpdateThirdPartyAPIResponse: true,
                updateThirdPartyAPIResponseError: false,
            })
        }
        // Set Update Third Party API Response success data
        case UPDATE_THIRD_PARTY_API_RESPONSE_SUCCESS: {
            return Object.assign({}, state, {
                updateThirdPartyAPIResponse: action.payload,
                isLoadingUpdateThirdPartyAPIResponse: false,
                updateThirdPartyAPIResponseError: false
            })
        }
        // Set Update Third Party API Response failure data
        case UPDATE_THIRD_PARTY_API_RESPONSE_FAILURE: {
            return Object.assign({}, state, {
                updateThirdPartyAPIResponse: null,
                isLoadingUpdateThirdPartyAPIResponse: false,
                updateThirdPartyAPIResponseError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}