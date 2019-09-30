import {
    // user address list 
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,

    // Block/unblock
    GET_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,

    // Destroy Black Fund
    DESTROY_BLACKFUND,
    DESTROY_BLACKFUND_SUCCESS,
    DESTROY_BLACKFUND_FAILURE,

    //get all wallet type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    //clear data
    CLEAR_USER_ADDRESS_DATA,

    //clear data on logout
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// initial state
const INITIAL_STATE = {
    // user address list 
    loading: false,
    userAddressListData: null,

    //User Address block/unblock
    blockUnblockLoading: false,
    blockUnblockData: null,

    //User Address destroy
    blackFundLoading: false,
    blackFundData: null,

    //for Wallet list
    walletData: null,
    walletLoading: false,

}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //clear user address response
        case CLEAR_USER_ADDRESS_DATA:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // Handle User Address List data
        case GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS:
            return Object.assign({}, state, { loading: true, userAddressListData: null })
        // Handle User Address List data Success
        case GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS:
            return Object.assign({}, state, { loading: false, userAddressListData: action.payload })
        // Handle User Address List data Failure
        case GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE:
            return Object.assign({}, state, { loading: false, userAddressListData: action.payload })

        // Handle User Address block/unblock
        case GET_BLOCK_UNBLOCK_USER_ADDRESS:
            return Object.assign({}, state, { blockUnblockLoading: true, blockUnblockData: null })
        // Handle User Address block/unblock Success
        case GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS:
            return Object.assign({}, state, { blockUnblockLoading: false, blockUnblockData: action.payload })
        // Handle User Address block/unblock Failure
        case GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE:
            return Object.assign({}, state, { blockUnblockLoading: false, blockUnblockData: action.payload })

        // Handle destroy black fund
        case DESTROY_BLACKFUND:
            return Object.assign({}, state, { blackFundLoading: true, blackFundData: null })
        // Handle destroy black fund success
        case DESTROY_BLACKFUND_SUCCESS:
            return Object.assign({}, state, { blackFundLoading: false, blackFundData: action.payload, })
        // Handle destroy black fund failure
        case DESTROY_BLACKFUND_FAILURE:
            return Object.assign({}, state, { blackFundLoading: false, blackFundData: action.payload, })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null, walletLoading: true })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload, walletLoading: false })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload, walletLoading: false })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
