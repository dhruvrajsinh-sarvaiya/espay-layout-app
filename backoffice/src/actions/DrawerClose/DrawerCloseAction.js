import {
    DRAWER_CLOSE,
    DRAWER_CLOSE_SUCCESS
} from '../types'

export const DrawerClose = payload => ({
    type: DRAWER_CLOSE,
    payload: payload
});

export const DrawerCloseSuccess = array => ({
    type: DRAWER_CLOSE_SUCCESS,
    payload: array
});


