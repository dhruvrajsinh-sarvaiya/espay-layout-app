/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 26-09-2018
    UpdatedDate : 26-09-2018
    Description : Function for Get Exchange List
*/
import {
  GET_EXCHANGE,
  GET_EXCHANGE_SUCCESS,
  GET_EXCHANGE_FAILURE
} from "./types";

/**
 * Function for Get Exchange Data Action
 */
export const getExchange = () => ({
  type: GET_EXCHANGE,
  payload: {}
});

/* 
* Function for Get Exchange Data Success Action
*/
export const getExchangeSuccess = response => ({
  type: GET_EXCHANGE_SUCCESS,
  payload: response
});

/* 
*  Function for Get Exchange Data Failure Action
*/
export const getExchangeFailure = error => ({
  type: GET_EXCHANGE_FAILURE,
  payload: error
});
