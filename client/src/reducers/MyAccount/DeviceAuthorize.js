/**
 * Auther : Salim Deraiya
 * Created : 08/12/2018
 * Device Authorized Reducers
 */

import {
    DEVICE_AUTHORIZE,
    DEVICE_AUTHORIZE_SUCCESS,
    DEVICE_AUTHORIZE_FAILURE
} from 'Actions/types';

/**
 * initial Device Authorized
 */
const INIT_STATE = {
    data: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) 
    {
        case DEVICE_AUTHORIZE:
            return { ...state, loading: true, data: '' };

        case DEVICE_AUTHORIZE_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case DEVICE_AUTHORIZE_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default:
            return { ...state };
    }
}