/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Affiliate Promotion Reducer
 */

//Import action types form type.js
import {
    //Add Affiliate Promotion
    ADD_AFFILIATE_PROMOTION,
    ADD_AFFILIATE_PROMOTION_SUCCESS,
    ADD_AFFILIATE_PROMOTION_FAILURE,

    //Edit Affiliate Promotion
    EDIT_AFFILIATE_PROMOTION,
    EDIT_AFFILIATE_PROMOTION_SUCCESS,
    EDIT_AFFILIATE_PROMOTION_FAILURE,

    //Change Affiliate Promotion Status
    CHANGE_AFFILIATE_PROMOTION_STATUS,
    CHANGE_AFFILIATE_PROMOTION_STATUS_SUCCESS,
    CHANGE_AFFILIATE_PROMOTION_STATUS_FAILURE,

    //List Affiliate Promotion
    LIST_AFFILIATE_PROMOTION,
    LIST_AFFILIATE_PROMOTION_SUCCESS,
    LIST_AFFILIATE_PROMOTION_FAILURE,

    //Get By Id Affiliate Promotion    
    GET_BY_ID_AFFILIATE_PROMOTION,
    GET_BY_ID_AFFILIATE_PROMOTION_SUCCESS,
    GET_BY_ID_AFFILIATE_PROMOTION_FAILURE,

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

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Add Affiliate Promotion
        case ADD_AFFILIATE_PROMOTION:
        case EDIT_AFFILIATE_PROMOTION:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_AFFILIATE_PROMOTION_SUCCESS:
        case ADD_AFFILIATE_PROMOTION_FAILURE:
        case EDIT_AFFILIATE_PROMOTION_SUCCESS:
        case EDIT_AFFILIATE_PROMOTION_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // Added By Bharat Jograna variable chngStsData to get change data
        //Change Affiliate Promotion Status
        case CHANGE_AFFILIATE_PROMOTION_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_AFFILIATE_PROMOTION_STATUS_SUCCESS:
        case CHANGE_AFFILIATE_PROMOTION_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Affiliate Promotion
        case LIST_AFFILIATE_PROMOTION:
            return { ...state, listLoading: true, list: '', chngStsData: '' };

        case LIST_AFFILIATE_PROMOTION_SUCCESS:
        case LIST_AFFILIATE_PROMOTION_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Affiliate Promotion
        case GET_BY_ID_AFFILIATE_PROMOTION:
            return { ...state, loading: true, getData: '', list: '' };

        case GET_BY_ID_AFFILIATE_PROMOTION_SUCCESS:
        case GET_BY_ID_AFFILIATE_PROMOTION_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};