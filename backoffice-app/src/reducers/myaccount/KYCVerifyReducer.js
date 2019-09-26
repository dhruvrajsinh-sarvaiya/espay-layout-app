import {
    //KYC Verify List
    GET_KYC_VERIFY_LIST,
    GET_KYC_VERIFY_LIST_SUCCESS,
    GET_KYC_VERIFY_LIST_FAILURE,

    //Edit KYC Verify List
    EDIT_KYC_VERIFY_STATUS,
    EDIT_KYC_VERIFY_STATUS_SUCCESS,
    EDIT_KYC_VERIFY_STATUS_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_KYC_STATUS_DATA
} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    // For KYC Verify List 
    KYCVerifyListData: null,
    KYCVerifyListLoading: false,
    KYCVerifyListError: false,

    //Edit KYC Status 
    EditKYCStatusData: null,
    EditKYCStatusLoading: false,
    EditKYCStatusError: false,
}

export default function KYCVerifyReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Get kyc verify List method data
        case GET_KYC_VERIFY_LIST:
            return Object.assign({}, state, {
                KYCVerifyListData: null,
                KYCVerifyListLoading: true
            })
        // Set kyc verify List success data
        case GET_KYC_VERIFY_LIST_SUCCESS:
            return Object.assign({}, state, {
                KYCVerifyListData: action.data,
                KYCVerifyListLoading: false
            })
        // Set kyc verify List Failure data
        case GET_KYC_VERIFY_LIST_FAILURE:
            return Object.assign({}, state, {
                KYCVerifyListData: null,
                KYCVerifyListLoading: false,
                KYCVerifyListError: true
            })


        // Handle Get kyc verify Edit method data
        case EDIT_KYC_VERIFY_STATUS:
            return Object.assign({}, state, {
                EditKYCStatusData: null,
                EditKYCStatusLoading: true
            })
        // Set kyc verify Edit success data
        case EDIT_KYC_VERIFY_STATUS_SUCCESS:
            return Object.assign({}, state, {
                EditKYCStatusData: action.data,
                EditKYCStatusLoading: false
            })
        // Set kyc verify Edit Failure data
        case EDIT_KYC_VERIFY_STATUS_FAILURE:
            return Object.assign({}, state, {
                EditKYCStatusData: null,
                EditKYCStatusLoading: false,
                EditKYCStatusError: true
            })

        //clear data
        case CLEAR_KYC_STATUS_DATA:
            return Object.assign({}, state, {
                EditKYCStatusData: null,
                EditKYCStatusLoading: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}