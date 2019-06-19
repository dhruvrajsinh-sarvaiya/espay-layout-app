/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : Function for Get API Method Data Action
*/
import { GET_API, GET_API_SUCCESS, GET_API_FAILURE } from "Actions/types";

/**
 * Function for Get API Data Action
 */
export const getApi = () => ({
  type: GET_API,
  payload: {}
});

/* 
* Function for Get API Data Success Action
*/
export const getApiSuccess = response => ({
  type: GET_API_SUCCESS,
  payload: response
});

/* 
*  Function for Get API Data Failure Action
*/
export const getApiFailure = error => ({
  type: GET_API_FAILURE,
  payload: error
});
