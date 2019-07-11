/* 
    Developer : Nishant Vadgama
    FIle Comment : wallet block trn type methods 
    Date : 19-12-2018
*/

import {
    //list 
    GETWALLETBLOCKTRNLIST,
    GETWALLETBLOCKTRNLIST_SUCCESS,
    GETWALLETBLOCKTRNLIST_FAILURE,
    //update status
    CHANGEWALLETBLOCKTRNSTATUS,
    CHANGEWALLETBLOCKTRNSTATUS_SUCCESS,
    CHANGEWALLETBLOCKTRNSTATUS_FAILURE,
    //insert & update wallet block trn type rec
    UPDATEWALLETBLOCKTRN,
    UPDATEWALLETBLOCKTRN_SUCCESS,
    UPDATEWALLETBLOCKTRN_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    errors: {},
    walletBlockTrnList: [],
    statusResponse: {},
    formResponse: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // list wallet block trn list
        case GETWALLETBLOCKTRNLIST:
            return { ...state, loading: true, errors: {}, statusResponse: {}, formResponse: {} }
        case GETWALLETBLOCKTRNLIST_SUCCESS:
            return { ...state, loading: false, walletBlockTrnList: action.payload, statusResponse: {}, errors: {}, formResponse: {} }
        case GETWALLETBLOCKTRNLIST_FAILURE:
            return { ...state, loading: false, errors: action.payload, statusResponse: {}, formResponse: {} }

        //update status
        case CHANGEWALLETBLOCKTRNSTATUS:
            return { ...state, loading: true, errors: {}, statusResponse: {} }
        case CHANGEWALLETBLOCKTRNSTATUS_SUCCESS:
        case CHANGEWALLETBLOCKTRNSTATUS_FAILURE:
            return { ...state, loading: false, statusResponse: action.payload, errors: {} }

        // insert & update rec
        //update status
        case UPDATEWALLETBLOCKTRN:
            return { ...state, loading: true, errors: {}, formResponse: {} }
        case UPDATEWALLETBLOCKTRN_SUCCESS:
        case UPDATEWALLETBLOCKTRN_FAILURE:
            return { ...state, loading: false, formResponse: action.payload, errors: {} }
        default:
            return { ...state };
    }
};
