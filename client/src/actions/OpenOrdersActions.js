/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Open Orders Actions
 */

 // import neccessary action types
import {
    OPEN_ORDERS,
    OPEN_ORDERS_SUCCESS,
    OPEN_ORDERS_FAILURE,
    OPEN_ORDERS_REFRESH,
} from './types';

/**
 * Use: used to handle Open Orders action type
 * Input: Open Orders Request
 * Request contain start date, end date, order type,status
 */
export const openOrders = (openOrdersRequest) => ({
    type: OPEN_ORDERS,
    payload: { openOrdersRequest }
})

/**
 * Use: used to handle Open Orders success action type
 * Input: Open Orders List or response from API or sagas
 */
export const openOrdersSuccess = (list) => ({
    type: OPEN_ORDERS_SUCCESS,
    payload: list.response
});

/**
 * Use: used to handle Open Orders success action type
 * Input: Open Orders List Error  or response from API or sagas
 */
export const openOrdersFailure = (error) => ({
    type: OPEN_ORDERS_FAILURE,
    payload: error
})

/**
 * Use: used to handle Open Orders success action type
 * Input: Open Orders Request Error  or response from API or sagas
 * Request contain start date, end date, order type,status
 */
export const openOrdersRefresh = (openOrdersRequest) => ({
    type: OPEN_ORDERS_REFRESH,
    payload: {openOrdersRequest}
})