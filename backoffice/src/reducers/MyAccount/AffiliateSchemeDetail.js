/**
 * Author : Saloni Rathod
 * Created : 28/03/2019
 * Affiliate Scheme  Detail Reducer
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme Detail
    ADD_AFFILIATE_SCHEME_DETAIL,
    ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    ADD_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //Edit Affiliate Scheme Detail
    EDIT_AFFILIATE_SCHEME_DETAIL,
    EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //Change Affiliate Scheme  Detail Status
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE,

    //List Affiliate Scheme Detail
    LIST_AFFILIATE_SCHEME_DETAIL,
    LIST_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    LIST_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //Get By Id Affiliate Scheme  Detail    
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL,
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL_FAILURE,

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
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Add Affiliate Scheme Detail
        case ADD_AFFILIATE_SCHEME_DETAIL:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_AFFILIATE_SCHEME_DETAIL_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Affiliate Scheme Detail
        case EDIT_AFFILIATE_SCHEME_DETAIL:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Change Affiliate Scheme Status Detail
        case CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS:
            return { ...state, listLoading: true, chngStsData: '', data: '' };

        case CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Affiliate Scheme Detail
        case LIST_AFFILIATE_SCHEME_DETAIL:
            return { ...state, listLoading: true, list: '', chngStsData: '', getData: '', data: '' };

        case LIST_AFFILIATE_SCHEME_DETAIL_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_AFFILIATE_SCHEME_DETAIL_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Affiliate Scheme Detail
        case GET_BY_ID_AFFILIATE_SCHEME_DETAIL:
            return { ...state, loading: true, getData: '', list: '', data: '' };

        case GET_BY_ID_AFFILIATE_SCHEME_DETAIL_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_AFFILIATE_SCHEME_DETAIL_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};