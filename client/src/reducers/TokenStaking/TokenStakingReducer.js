/* 
    Developer : Nishant Vadgama
    Date : 21-08-2018
    Fiel Comment : Token Staking reducer file 
*/
import {
    //WALLET TYPE LIST... 
    GETWALLETTYPELIST,
    GETWALLETTYPELIST_SUCCESS,
    GETWALLETTYPELIST_FAILURE,
    // get plan slab list...
    GET_SLABLIST,
    GET_SLABLIST_SUCCESS,
    GET_SLABLIST_FAILURE,
    //get pre confirmationd details...
    PRECONFIRMATIONDETAILS,
    PRECONFIRMATIONDETAILS_SUCCESS,
    PRECONFIRMATIONDETAILS_FAILURE,
    //staking request...
    STAKREQUEST,
    STAKREQUEST_SUCCESS,
    STAKREQUEST_FAILURE,
    // history list
    GET_STAKHISTORY,
    GET_STAKHISTORY_SUCCESS,
    GET_STAKHISTORY_FAILURE,
    // unstaking pre confirmation
    UNSTAKPRECONFIRMATION,
    UNSTAKPRECONFIRMATION_SUCCESS,
    UNSTAKPRECONFIRMATION_FAILURE,
    // unstaking request
    UNSTAKREQUEST,
    UNSTAKREQUEST_SUCCESS,
    UNSTAKREQUEST_FAILURE
} from "Actions/types";

//Set Initial State
const INITIAL_STATE = {
    stakingResponse: {},
    walletList: [],
    planlist: [],
    planResponse: {},
    preConfirmationDetails: {},
    //history
    showLoading: false,
    stakHistoryList: [],
    unstakPreconfirmationDetails: {},
    unstakResponse: {},
    totalCount: 0,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //get wallet type list...
        case GETWALLETTYPELIST:
            return { ...state, showLoading: true, walletList: [], preConfirmationDetails: {}, planResponse: {}, stakingResponse: {}, unstakPreconfirmationDetails: {} }
        case GETWALLETTYPELIST_SUCCESS:
            return { ...state, showLoading: false, walletList: action.payload }
        case GETWALLETTYPELIST_FAILURE:
            return { ...state, showLoading: false, walletList: [] }
        //get plan list...
        case GET_SLABLIST:
            return { ...state, showLoading: true, planlist: [], planResponse: {}, preConfirmationDetails: {}, stakingResponse: {}, unstakPreconfirmationDetails: {} };
        case GET_SLABLIST_SUCCESS:
            return { ...state, showLoading: false, planlist: action.payload.Details, planResponse: action.payload };
        case GET_SLABLIST_FAILURE:
            return { ...state, showLoading: false, planlist: [], planResponse: action.error };
        //pre confirmation details...
        case PRECONFIRMATIONDETAILS:
            return { ...state, showLoading: true, preConfirmationDetails: {}, planResponse: {}, stakingResponse: {}, unstakPreconfirmationDetails: {} };
        case PRECONFIRMATIONDETAILS_SUCCESS:
            return { ...state, showLoading: false, preConfirmationDetails: action.payload };
        case PRECONFIRMATIONDETAILS_FAILURE:
            return { ...state, showLoading: false, preConfirmationDetails: action.error };
        //staking request
        case STAKREQUEST:
            return { ...state, showLoading: true, stakingResponse: {}, planResponse: {}, unstakPreconfirmationDetails: {} }
        case STAKREQUEST_SUCCESS:
            return { ...state, showLoading: false, stakingResponse: action.payload }
        case STAKREQUEST_FAILURE:
            return { ...state, showLoading: false, stakingResponse: action.error }
        // staking history
        case GET_STAKHISTORY:
            return { ...state, showLoading: true, unstakPreconfirmationDetails: {}, unstakResponse: {}, preConfirmationDetails: {}, planResponse: {} }
        case GET_STAKHISTORY_SUCCESS:
            return { ...state, showLoading: false, stakHistoryList: action.payload.Stakings, totalCount: action.payload.TotalCount }
        case GET_STAKHISTORY_FAILURE:
            return { ...state, showLoading: false, stakHistoryList: [], totalCount: 0 }
        // unstaking pre confrimation
        case UNSTAKPRECONFIRMATION:
            return { ...state, showLoading: true, unstakPreconfirmationDetails: {}, preConfirmationDetails: {} }
        case UNSTAKPRECONFIRMATION_SUCCESS:
            return { ...state, showLoading: false, unstakPreconfirmationDetails: action.payload }
        case UNSTAKPRECONFIRMATION_FAILURE:
            return { ...state, showLoading: false, unstakPreconfirmationDetails: action.payload }
        // unstaking request
        case UNSTAKREQUEST:
            return { ...state, showLoading: true, unstakResponse: {}, preConfirmationDetails: {}, unstakPreconfirmationDetails: {} }
        case UNSTAKREQUEST_SUCCESS:
            return { ...state, showLoading: false, unstakResponse: action.payload }
        case UNSTAKREQUEST_FAILURE:
            return { ...state, showLoading: false, unstakResponse: action.payload }

        default: return { ...state };
    }
}