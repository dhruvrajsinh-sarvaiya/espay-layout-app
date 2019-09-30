import {
    //wallettypes List 
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTER_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    //profile config List 
    PROFILE_CONFIG_LIST,
    PROFILE_CONFIG_LIST_SUCCESS,
    PROFILE_CONFIG_LIST_FAILURE,

    //profile config Delete 
    PROFILE_CONFIG_DELETE,
    PROFILE_CONFIG_DELETE_SUCCESS,
    PROFILE_CONFIG_DELETE_FAILURE,

    //profileType
    GET_PROFILE_TYPE,
    GET_PROFILE_TYPE_SUCCESS,
    GET_PROFILE_TYPE_FAILURE,

    //kyc list
    GET_KYCLEVEL_LIST,
    GET_KYCLEVEL_LIST_SUCCESS,
    GET_KYCLEVEL_LIST_FAILURE,

    //Profile level list
    GET_PROFILELEVEL_LIST,
    GET_PROFILELEVEL_LIST_SUCCESS,
    GET_PROFILELEVEL_LIST_FAILURE,

    //add profile config
    ADD_PROFILE_CONFIG_DASHBOARD,
    ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    ADD_PROFILE_CONFIG_DASHBOARD_FAILURE,

    //update profile config
    UPDATE_PROFILE_CONFIG_DASHBOARD,
    UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS,
    UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE,

    //clear data
    PROFILE_CONFIG_CLEAR,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'
/**
 * initial data
 */
const INIT_STATE = {
    //profile config List
    profileConfigListLoading: false,
    profileConfigListData: null,

    //profile config Delete 
    profileConfigDeleteLoading: false,
    profileConfigDeleteData: null,

    //profileType
    profileTypeLoading: false,
    profileTypeData: null,

    //kyc list
    kycLoading: false,
    kycData: null,

    //Profile level list
    profileLevelLoading: false,
    profileLevelData: null,

    //add profile config
    addLoading: false,
    addData: null,

    //update profile config
    editLoading: false,
    editData: null,

    //wallettypes List data
    walletTypeLoading: false,
    wallettypesData: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INIT_STATE;
        }

        // Handle Profile config List method data
        case PROFILE_CONFIG_LIST:
            return Object.assign({}, state, { profileConfigListLoading: true, profileConfigListData: null })
        // Set Profile config List success data
        case PROFILE_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, { profileConfigListLoading: false, profileConfigListData: action.payload })
        // Set Profile config List Failure data
        case PROFILE_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, { profileConfigListLoading: false, profileConfigListData: null })

        // Handle Profile config delete method data
        case PROFILE_CONFIG_DELETE:
            return Object.assign({}, state, { profileConfigDeleteLoading: true, profileConfigDeleteData: null })
        // Set Profile config delete  success data
        case PROFILE_CONFIG_DELETE_SUCCESS:
            return Object.assign({}, state, { profileConfigDeleteLoading: false, profileConfigDeleteData: action.payload })
        // Set Profile config delete  failure data
        case PROFILE_CONFIG_DELETE_FAILURE:
            return Object.assign({}, state, { profileConfigDeleteLoading: false, profileConfigDeleteData: null })

        // Handle Profile type
        case GET_PROFILE_TYPE:
            return Object.assign({}, state, { profileTypeLoading: true, profileTypeData: null })
        // set  Profile type success
        case GET_PROFILE_TYPE_SUCCESS:
            return Object.assign({}, state, { profileTypeLoading: false, profileTypeData: action.payload })
        // set  Profile type Failure
        case GET_PROFILE_TYPE_FAILURE:
            return Object.assign({}, state, { profileTypeLoading: false, profileTypeData: action.payload })

        // Handle KYC Level
        case GET_KYCLEVEL_LIST:
            return Object.assign({}, state, { kycLoading: true, kycData: null })
        // set KYC Level success
        case GET_KYCLEVEL_LIST_SUCCESS:
            return Object.assign({}, state, { kycLoading: false, kycData: action.payload })
        // set KYC Level Failure
        case GET_KYCLEVEL_LIST_FAILURE:
            return Object.assign({}, state, { kycLoading: false, kycData: action.payload })

        // Handle profile Level
        case GET_PROFILELEVEL_LIST:
            return Object.assign({}, state, { profileLevelLoading: true, profileLevelData: null })
        // set profile Level success
        case GET_PROFILELEVEL_LIST_SUCCESS:
            return Object.assign({}, state, { profileLevelLoading: false, profileLevelData: action.payload })
        // set profile Level Failure
        case GET_PROFILELEVEL_LIST_FAILURE:
            return Object.assign({}, state, { profileLevelLoading: false, profileLevelData: action.payload })

        // Handle add Profile Configuration..
        case ADD_PROFILE_CONFIG_DASHBOARD:
            return Object.assign({}, state, { addLoading: true, addData: null })
        // Handle add Profile Configuration success
        case ADD_PROFILE_CONFIG_DASHBOARD_SUCCESS:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })
        // Handle add Profile Configuration Failure
        case ADD_PROFILE_CONFIG_DASHBOARD_FAILURE:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })

        // Handle Update Profile Configuration..
        case UPDATE_PROFILE_CONFIG_DASHBOARD:
            return Object.assign({}, state, { editLoading: true, editData: null })
        // Handle Update Profile Configuration success
        case UPDATE_PROFILE_CONFIG_DASHBOARD_SUCCESS:
            return Object.assign({}, state, { editLoading: false, editData: action.payload })
        // Handle Update Profile Configuration Failure
        case UPDATE_PROFILE_CONFIG_DASHBOARD_FAILURE:
            return Object.assign({}, state, { editLoading: false, editData: action.payload })

        // Handle Wallet types List method data
        case GET_WALLET_TYPE_MASTER:
            return Object.assign({}, state, { walletTypeLoading: true, wallettypesData: null, })
        // Set Wallet types List success data
        case GET_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, { walletTypeLoading: false, wallettypesData: action.payload, })
        // Set Wallet types List failure data
        case GET_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, { walletTypeLoading: false, wallettypesData: action.payload, })

        //clear Configuration..
        case PROFILE_CONFIG_CLEAR:
            return INIT_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};