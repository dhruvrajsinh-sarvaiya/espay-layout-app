import {
    GET_CTHISTORY,
    GET_CTHISTORY_SUCCESS,
    GET_CTHISTORY_FAILURE
} from 'Actions/types';

const INIT_STATE = {
    historyList: [],
    showLoading: false
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case GET_CTHISTORY:
            return { ...state, showLoading: true }

        case GET_CTHISTORY_SUCCESS:
            return { ...state, showLoading: false, historyList: action.payload }

        case GET_CTHISTORY_FAILURE:
            return { ...state, showLoading: false }

        default:
            return { ...state }

    }
}