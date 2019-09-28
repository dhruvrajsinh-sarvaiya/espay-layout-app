// StateMasterReducer
import {
    GET_COUNTYLIST,
    GET_COUNTYLIST_SUCCESS,
    GET_COUNTYLIST_FAILURE,
    COUNTYLIST_ADD,
    COUNTYLIST_ADD_SUCCESS,
    COUNTYLIST_ADD_FAILURE,
    COUNTYLIST_ADD_CLEAR,
    COUNTYLIST_EDIT,
    COUNTYLIST_EDIT_SUCCESS,
    COUNTYLIST_EDIT_FAILURE,
    COUNTYLIST_EDIT_CLEAR,
    ACTION_LOGOUT,
    DELETE_COUNTRY,
    DELETE_COUNTRY_SUCCESS,
    DELETE_COUNTRY_FAILURE,
    DELETE_COUNTRY_CLEAR,

} from '../../actions/ActionTypes'

const initialState = {
    // for get list of Countrylist
    isCountrylistfetch: true,
    Countrylistdata: null,
    CountrylistdataFetch: true,

    // for add countrylist 
    isAddCountrylist: false,
    AddCountrylistdata: null,
    AddedCountrylistdata: true,

    // for edit countrylist
    isEditCountrylist: false,
    EditCountrylistdata: null,
    EditedCountrylistdata: true,

    // for delete countrylist
    isDeleteCountrylist: false,
    DeleteCountrylistdata: null,
    DeletedCountrylistdataFetch: true,
}
export default function StateMasterReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case ACTION_LOGOUT: {
            return initialState;
        }
        // for get list of country
        case GET_COUNTYLIST:
            return {
                ...state,
                isCountrylistfetch: true,
                Countrylistdata: null,
                CountrylistdataFetch: true,
            }
        case GET_COUNTYLIST_SUCCESS:
            return {
                ...state,
                isCountrylistfetch: false,
                Countrylistdata: action.data,
                CountrylistdataFetch: false,
            }
        case GET_COUNTYLIST_FAILURE:
            return {
                ...state,
                isCountrylistfetch: false,
                Countrylistdata: null,
                CountrylistdataFetch: false,
            }
        // for Add country 
        case COUNTYLIST_ADD:
            return {
                ...state,
                isAddCountrylist: true,
                AddCountrylistdata: null,
                AddedCountrylistdata: true,
            }
        case COUNTYLIST_ADD_SUCCESS:
            return {
                ...state,
                isAddCountrylist: false,
                AddCountrylistdata: action.data,
                AddedCountrylistdata: false,
            }
        case COUNTYLIST_ADD_FAILURE:
            return {
                ...state,
                isAddCountrylist: false,
                AddCountrylistdata: null,
                AddedCountrylistdata: false,
            }
        // for clear added fetch from memory
        case COUNTYLIST_ADD_CLEAR:
            return {
                ...state,
                isAddCountrylist: false,
                AddCountrylistdata: null,
                AddedCountrylistdata: true,
            }
        // for edit country
        case COUNTYLIST_EDIT:
            return {
                ...state,
                isEditCountrylist: true,
                EditCountrylistdata: null,
                EditedCountrylistdata: true,
            }
        case COUNTYLIST_EDIT_SUCCESS:
            return {
                ...state,
                isEditCountrylist: false,
                EditCountrylistdata: action.data,
                EditedCountrylistdata: false,
            }
        case COUNTYLIST_EDIT_FAILURE:
            return {
                ...state,
                isEditCountrylist: false,
                EditCountrylistdata: null,
                EditedCountrylistdata: false,
            }
        case COUNTYLIST_EDIT_CLEAR:
            return {
                ...state,
                isEditCountrylist: false,
                EditCountrylistdata: null,
                EditedCountrylistdata: true,
            }
        // for Delete country
        case DELETE_COUNTRY:
            return {
                ...state,
                isDeleteCountrylist: true,
                DeleteCountrylistdata: null,
                DeletedCountrylistdataFetch: true,
            }
        case DELETE_COUNTRY_SUCCESS:
            return {
                ...state,
                isDeleteCountrylist: false,
                DeleteCountrylistdata: action.data,
                DeletedCountrylistdataFetch: false,
            }
        case DELETE_COUNTRY_FAILURE:
            return {
                ...state,
                isDeleteCountrylist: false,
                DeleteCountrylistdata: null,
                DeletedCountrylistdataFetch: false,
            }
        case DELETE_COUNTRY_CLEAR:
            return {
                ...state,
                isDeleteCountrylist: false,
                DeleteCountrylistdata: null,
                DeletedCountrylistdataFetch: true,
            }
        default:
            return state;
    }
}