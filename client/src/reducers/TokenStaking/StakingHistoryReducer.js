/* import {
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
} from 'Actions/types';

//Set Initial State
const INITIAL_STATE = {
    showLoading: false,
    stakHistoryList: [],
    unstakPreconfirmationDetails: {},
    unstakResponse: {},
    totalCount: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // staking history
        case GET_STAKHISTORY:
            return { ...state, showLoading: true, unstakPreconfirmationDetails: {}, unstakResponse: {} }
        case GET_STAKHISTORY_SUCCESS:
            return { ...state, showLoading: false, stakHistoryList: action.payload.Stakings, totalCount: action.payload.TotalCount }
        case GET_STAKHISTORY_FAILURE:
            return { ...state, showLoading: false, stakHistoryList: [], totalCount: 0 }
        // unstaking pre confrimation
        case UNSTAKPRECONFIRMATION:
            return { ...state, showLoading: true, unstakPreconfirmationDetails: {} }
        case UNSTAKPRECONFIRMATION_SUCCESS:
            return { ...state, showLoading: false, unstakPreconfirmationDetails: action.payload }
        case UNSTAKPRECONFIRMATION_FAILURE:
            return { ...state, showLoading: false, unstakPreconfirmationDetails: action.payload }
        // unstaking request
        case UNSTAKREQUEST:
            return { ...state, showLoading: true, unstakResponse: {} }
        case UNSTAKREQUEST_SUCCESS:
            return { ...state, showLoading: false, unstakResponse: action.payload }
        case UNSTAKREQUEST_FAILURE:
            return { ...state, showLoading: false, unstakResponse: action.payload }
        default:
            return { ...state }
    }
} */