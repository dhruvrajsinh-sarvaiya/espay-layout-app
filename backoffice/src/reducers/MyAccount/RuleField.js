/**
 * Auther : Saloni Rathod
 * Created : 25/02/2019
 * Rule Field Reducer
 */

//Import action types form type.js
import {
    //Add Rule Field
    ADD_RULE_FIELD,
    ADD_RULE_FIELD_SUCCESS,
    ADD_RULE_FIELD_FAILURE,

    //Edit Rule Field
    EDIT_RULE_FIELD,
    EDIT_RULE_FIELD_SUCCESS,
    EDIT_RULE_FIELD_FAILURE,

    //Change Rule Field Status
    CHANGE_RULE_FIELD_STATUS,
    CHANGE_RULE_FIELD_STATUS_SUCCESS,
    CHANGE_RULE_FIELD_STATUS_FAILURE,

    //List Rule Field
    LIST_RULE_FIELD,
    LIST_RULE_FIELD_SUCCESS,
    LIST_RULE_FIELD_FAILURE,

    //Get By Id Rule Field    
    GET_BY_ID_RULE_FIELD,
    GET_BY_ID_RULE_FIELD_SUCCESS,
    GET_BY_ID_RULE_FIELD_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData : [],
    listLoading : false,
    loading: false,
    chngStsData: [],
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Add Rule Field
        case ADD_RULE_FIELD:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_RULE_FIELD_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_RULE_FIELD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Rule Field
        case EDIT_RULE_FIELD:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_RULE_FIELD_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_RULE_FIELD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Change Rule Rule Field Status
        case CHANGE_RULE_FIELD_STATUS:
            return { ...state, listLoading: true, chngStsData : '' };

        case CHANGE_RULE_FIELD_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_RULE_FIELD_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Rule Rule Field
        case LIST_RULE_FIELD:
            return { ...state, listLoading: true, list : '', chngStsData: '' };

        case LIST_RULE_FIELD_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_RULE_FIELD_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Rule Rule Field
        case GET_BY_ID_RULE_FIELD:
            return { ...state, loading: true, getData : '', list : '' };

        case GET_BY_ID_RULE_FIELD_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_RULE_FIELD_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};