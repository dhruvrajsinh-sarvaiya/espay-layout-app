import {
    //for Refferal Reward List
    GET_REFERRAL_LIST,
    GET_REFERRAL_LIST_SUCCESS,
    GET_REFERRAL_LIST_FAILURE,

    //for Edt Refferal 
    EDIT_REFERRAL,
    EDIT_REFERRAL_SUCCESS,
    EDIT_REFERRAL_FAILURE,

    //for Add Refferal 
    ADD_REFERRAL,
    ADD_REFERRAL_SUCCESS,
    ADD_REFERRAL_FAILURE,

    //for Enable Refferal Status
    ENABLE_REFERRAL_STATUS,
    ENABLE_REFERRAL_STATUS_SUCCESS,
    ENABLE_REFERRAL_STATUS_FAILURE,

    //for Disable Refferal Status
    DISABLE_REFERRAL_STATUS,
    DISABLE_REFERRAL_STATUS_SUCCESS,
    DISABLE_REFERRAL_STATUS_FAILURE,

    //for Clear Refferal
    CLEAR_REFFERAL,

    //for Refferal PayType
    REFERRAL_PAY_TYPE,
    REFERRAL_PAY_TYPE_SUCCESS,
    REFERRAL_PAY_TYPE_FAILURE,

    //for Refferal ServiceType
    REFERRAL_SERVICE_TYPE,
    REFERRAL_SERVICE_TYPE_SUCCESS,
    REFERRAL_SERVICE_TYPE_FAILURE,

    //action logout
    ACTION_LOGOUT,

    //for currency 
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTER_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE
} from "../../actions/ActionTypes";

const INIT_STATE = {
    //for Refferal Reward List
    referralListLoading: false,
    referralListData: null,

    //for Enable Refferal Status
    enableStatusLoading: false,
    enableStatusData: null,

    //for Disable Refferal Status
    disableStatusLoading: false,
    disableStatusData: null,

    //for Add Refferal 
    isAddRefferal: false,
    addRefferalData: null,

    //for Edt Refferal 
    isEditReferral: false,
    editReferralData: null,

    //for Currency 
    isCurrencyLoading: false,
    currencyData: null,

    //for Refferal PayType
    isPayTypeLoading: false,
    payTypeData: null,

    //for Refferal ServiceType
    isServiceTypeLoading: false,
    serviceTypeData: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE;

        //for Refferal Reward List
        case GET_REFERRAL_LIST:
            return Object.assign({}, state, { referralListLoading: true, referralListData: null })
        //for Refferal Reward List success
        case GET_REFERRAL_LIST_SUCCESS:
            return Object.assign({}, state, { referralListLoading: false, referralListData: action.payload })
        //for Refferal Reward List failure
        case GET_REFERRAL_LIST_FAILURE:
            return Object.assign({}, state, { referralListLoading: false, referralListData: null })

        //for Enable Refferal Status
        case ENABLE_REFERRAL_STATUS:
            return Object.assign({}, state, { enableStatusLoading: true, enableStatusData: null })
        //for Enable Refferal Status success
        case ENABLE_REFERRAL_STATUS_SUCCESS:
            return Object.assign({}, state, { enableStatusLoading: false, enableStatusData: action.payload })
        //for Enable Refferal Status failure
        case ENABLE_REFERRAL_STATUS_FAILURE:
            return Object.assign({}, state, { enableStatusLoading: false, enableStatusData: null })

        //for Disable Refferal Status
        case DISABLE_REFERRAL_STATUS:
            return Object.assign({}, state, { disableStatusLoading: true, disableStatusData: null })
        //for Disable Refferal Status success
        case DISABLE_REFERRAL_STATUS_SUCCESS:
            return Object.assign({}, state, { disableStatusLoading: false, disableStatusData: action.payload })
        //for Disable Refferal Status failure
        case DISABLE_REFERRAL_STATUS_FAILURE:
            return Object.assign({}, state, { disableStatusLoading: false, disableStatusData: null })

        //for Edt Refferal 
        case EDIT_REFERRAL:
            return Object.assign({}, state, { isEditReferral: true, editReferralData: null })
        //for Edt Refferal success
        case EDIT_REFERRAL_SUCCESS:
            return Object.assign({}, state, { isEditReferral: false, editReferralData: action.payload })
        //for Edt Refferal failure
        case EDIT_REFERRAL_FAILURE:
            return Object.assign({}, state, { isEditReferral: false, editReferralData: null })

        //for Add Refferal 
        case ADD_REFERRAL:
            return Object.assign({}, state, { isAddRefferal: true, addRefferalData: null })
        //for Add Refferal success
        case ADD_REFERRAL_SUCCESS:
            return Object.assign({}, state, { isAddRefferal: false, addRefferalData: action.payload })
        //for Add Refferal failure
        case ADD_REFERRAL_FAILURE:
            return Object.assign({}, state, { isAddRefferal: false, addRefferalData: null })

        //for Currency 
        case GET_WALLET_TYPE_MASTER:
            return Object.assign({}, state, { isCurrencyLoading: true, currencyData: null })
        //for Currency success
        case GET_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, { isCurrencyLoading: false, currencyData: action.payload })
        //for Currency failure
        case GET_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, { isCurrencyLoading: false, currencyData: null })

        //for Refferal PayType
        case REFERRAL_PAY_TYPE:
            return Object.assign({}, state, { isPayTypeLoading: true, payTypeData: null })
        //for Refferal PayType success
        case REFERRAL_PAY_TYPE_SUCCESS:
            return Object.assign({}, state, { isPayTypeLoading: false, payTypeData: action.payload })
        //for Refferal PayType failure
        case REFERRAL_PAY_TYPE_FAILURE:
            return Object.assign({}, state, { isPayTypeLoading: false, payTypeData: null })

        //for Refferal ServiceType
        case REFERRAL_SERVICE_TYPE:
            return Object.assign({}, state, { isServiceTypeLoading: true, serviceTypeData: null })
        //for Refferal ServiceType success
        case REFERRAL_SERVICE_TYPE_SUCCESS:
            return Object.assign({}, state, { isServiceTypeLoading: false, serviceTypeData: action.payload, })
        //for Refferal ServiceType failure
        case REFERRAL_SERVICE_TYPE_FAILURE:
            return Object.assign({}, state, { isServiceTypeLoading: false, serviceTypeData: null })

        //for Clear Refferal
        case CLEAR_REFFERAL:
            return INIT_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};
