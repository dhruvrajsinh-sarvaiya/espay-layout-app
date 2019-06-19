/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Authorization Token Reducers
 */
import {

    //Generate Token
    GENERATE_TOKEN,
    GENERATE_TOKEN_SUCCESS,
    GENERATE_TOKEN_FAILURE,

    //Refersh Token
    REFRESH_TOKEN,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE,

    //Check Token
    CHECK_TOKEN,
    CHECK_TOKEN_SUCCESS,
    CHECK_TOKEN_FAILURE,

    // MENU PERSMISSION BY ID - added by nishant on 29-04-2019
    GET_MENU_ACCESS_BY_ID,
    GET_MENU_ACCESS_BY_ID_SUCCESS,
    GET_MENU_ACCESS_BY_ID_FAILURE,
} from 'Actions/types';


/*
* Initial State
*/
const INIT_STATE = {
    user: localStorage.getItem('user_id'),
    loading: false,
    data: [],
    error: '',
    redirect: false,
    token_flag: false,
    menu_rights: {},
    menuLoading: false,
}

//Check Action for Authorization Token...
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Generate Token
        case GENERATE_TOKEN:
            return { ...state, loading: true, error: '', data: '', token_flag: false, redirect: false };

        case GENERATE_TOKEN_SUCCESS:
            return { ...state, loading: false, data: action.payload, token_flag: true, user: action.payload, redirect: true };

        case GENERATE_TOKEN_FAILURE:
            var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
            return { ...state, loading: false, error: error };

        //Refersh Token
        case REFRESH_TOKEN:
            return { ...state, loading: true, error: '', data: '' };

        case REFRESH_TOKEN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case REFRESH_TOKEN_FAILURE:
            var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
            return { ...state, loading: false, error: error };

        //Check Token
        case CHECK_TOKEN:
            return { ...state, loading: true, error: '', data: '' };

        case CHECK_TOKEN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case CHECK_TOKEN_FAILURE:
            var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
            return { ...state, loading: false, error: error };

        // MENU PERMISSION BY ID - added by nishant on 29-04-2019
        case GET_MENU_ACCESS_BY_ID:
            return { ...state, menuLoading: true, menu_rights: {} }
        case GET_MENU_ACCESS_BY_ID_SUCCESS:
            return { ...state, menuLoading: false, menu_rights: action.payload }
        case GET_MENU_ACCESS_BY_ID_FAILURE:
            return { ...state, menuLoading: false, menu_rights: action.payload }

        default:
            return { ...state };
    }
}