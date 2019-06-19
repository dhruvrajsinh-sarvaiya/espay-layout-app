import {
    EMAIL_PUSH,
    EMAIL_PUSH_SUCCESS,
    EMAIL_PUSH_FAIL,
} from 'Actions/types';

const INIT_STATE = {
    pushEmailResponse: {},
    data: {},
    loding: false
}

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case EMAIL_PUSH:
            return {...state, loading: true, data: {}};
        case EMAIL_PUSH_SUCCESS:
            return {...state, loading: false, pushEmailResponse: action.payload};
        case EMAIL_PUSH_FAIL:
            return {...state, loading: false, pushEmailResponse: action.payload};
        default:
            return {...state}
    }
}