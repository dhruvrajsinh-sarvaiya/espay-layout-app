import {
    COUNTRIES_ADD,
    COUNTRIES_ADD_SUCCESS,
    COUNTRIES_ADD_FAILURE,

    COUNTRIES_DELETE,
    COUNTRIES_DELETE_FAILURE,
    COUNTRIES_DELETE_SUCCESS,

    COUNTRIES_FETCH,
    COUNTRIES_FETCH_FAILURE,
    COUNTRIES_FETCH_SUCCESS,

    COUNTRIES_UPDATE,
    COUNTRIES_UPDATE_FAILURE,
    COUNTRIES_UPDATE_SUCCESS,

    COUNTRIES_FILTER,
    COUNTRIES_FILTER_SUCCESS,
    COUNTRIES_FILTER_FAILURE,

    COUNTRIES_CLEAR_ADD,
    COUNTRIES_CLEAR_UPDATE,
    COUNTRIES_CLEAR_DELETE,
    COUNTRIES_CLEAR

} from '../../actions/ActionTypes'
import { ACTION_LOGOUT } from '../../actions/ActionTypes';

const initialState = {

    // for fetch countries
    loading: false,
    countriesResponse: null,

    //for delete data
    countriesDeleteResponse: null,
    deleteLoading: false,

    //for add countries
    countriesAddDatas: null,

    // for update countries
    countriesUpdateDatas: null,

    error: false
}

const CountriesReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case ACTION_LOGOUT: {
            return initialState;
        }
        case COUNTRIES_FETCH:
        case COUNTRIES_FILTER:
            return {

                ...state,
                loading: true,
                countriesResponse: null,
                countriesDeleteResponse: null,
            }

        case COUNTRIES_FETCH_SUCCESS:
        case COUNTRIES_FILTER_SUCCESS:

            return {
                ...state,
                loading: false,
                countriesResponse: action.data
            }
        case COUNTRIES_FETCH_FAILURE:
        case COUNTRIES_FILTER_FAILURE:
            return {
                ...state,
                loading: false,
                countriesResponse: null,
                error: true
            }

        case COUNTRIES_CLEAR:
            return {
                ...state,
                loading: false,
                countriesResponse: null,
                error: false
            }
        // for Delete Data
        case COUNTRIES_DELETE:
            return {

                ...state,
                deleteLoading: true,
                countriesDeleteResponse: null
            }
        case COUNTRIES_DELETE_SUCCESS:
            return {
                ...state,
                deleteLoading: false,
                countriesDeleteResponse: action.data
            }
        case COUNTRIES_DELETE_FAILURE:
            return {
                ...state,
                deleteLoading: false,
                countriesDeleteResponse: null,
                error: true
            }

        // for Adding data
        case COUNTRIES_ADD:
            return {

                ...state,
                loading: true,
                countriesAddDatas: null,

            }
        case COUNTRIES_ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                countriesAddDatas: action.data
            }
        case COUNTRIES_ADD_FAILURE:
            return {
                ...state,
                loading: false,
                countriesAddDatas: null,
                error: true
            }

        // for Updating data
        case COUNTRIES_UPDATE:
            return {

                ...state,
                loading: true,
                countriesUpdateDatas: null,

            }
        case COUNTRIES_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                countriesUpdateDatas: action.data
            }
        case COUNTRIES_UPDATE_FAILURE:
            return {
                ...state,
                loading: false,
                countriesUpdateDatas: null,
                error: true
            }



        case COUNTRIES_CLEAR_ADD:
            return {
                ...state,
                loading: false,
                countriesAddDatas: null,
                error: false
            }
        case COUNTRIES_CLEAR_UPDATE:
            return {
                ...state,
                loading: false,
                countriesUpdateDatas: null,
                error: false
            }
        case COUNTRIES_CLEAR_DELETE:
            return {
                ...state,
                loading: false,
                countriesDeleteResponse: null,
                error: false
            }
        default:
            return state;
    }
}

export default CountriesReducer;