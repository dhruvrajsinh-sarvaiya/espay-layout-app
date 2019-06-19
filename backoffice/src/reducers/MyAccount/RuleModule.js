/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Update by  : Bharat Jogrna, 25 FEB 2019, Saloni Rathod(11/03/2019)
 * Rule Module Reducer
 */

//Import action types form type.js
import {
    //Add Module
    ADD_RULE_MODULE,
    ADD_RULE_MODULE_SUCCESS,
    ADD_RULE_MODULE_FAILURE,

    //Edit Module
    EDIT_RULE_MODULE,
    EDIT_RULE_MODULE_SUCCESS,
    EDIT_RULE_MODULE_FAILURE,

    //Change Module Status
    CHANGE_RULE_MODULE_STATUS,
    CHANGE_RULE_MODULE_STATUS_SUCCESS,
    CHANGE_RULE_MODULE_STATUS_FAILURE,

    //List Module
    LIST_RULE_MODULE,
    LIST_RULE_MODULE_SUCCESS,
    LIST_RULE_MODULE_FAILURE,

    //Get By Id Module    
    GET_BY_ID_RULE_MODULE,
    GET_BY_ID_RULE_MODULE_SUCCESS,
    GET_BY_ID_RULE_MODULE_FAILURE,

    //List Parent Module Added by Saloni Rathod
    LIST_RULE_MODULE_FOR_PARENTID,
    LIST_RULE_MODULE_FOR_PARENTID_SUCCESS,
    LIST_RULE_MODULE_FOR_PARENTID_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData: [],
    listLoading: false,
    loading: false,
    chngStsData: [],
    plist: [], //Added by Saloni Rathod
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Add Module
        case ADD_RULE_MODULE:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_RULE_MODULE_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_RULE_MODULE_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Module
        case EDIT_RULE_MODULE:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_RULE_MODULE_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_RULE_MODULE_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // Added By Bharat Jograna variable chngStsData to get change data
        //Change Rule Module Status
        case CHANGE_RULE_MODULE_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_RULE_MODULE_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_RULE_MODULE_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Rule Module
        case LIST_RULE_MODULE:
            return { ...state, listLoading: true, list: '', chngStsData: '' };

        case LIST_RULE_MODULE_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_RULE_MODULE_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Rule Module
        case GET_BY_ID_RULE_MODULE:
            return { ...state, loading: true, getData: '', list: '' };

        case GET_BY_ID_RULE_MODULE_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_RULE_MODULE_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        //List Parent Rule Module Added by Saloni Rathod
        case LIST_RULE_MODULE_FOR_PARENTID:
            return { ...state, loading: true, plist: '', chngStsData: '' };

        case LIST_RULE_MODULE_FOR_PARENTID_SUCCESS:
            return { ...state, loading: false, plist: action.payload };

        case LIST_RULE_MODULE_FOR_PARENTID_FAILURE:
            return { ...state, loading: false, plist: action.payload };

        default:
            return { ...state };
    }
};