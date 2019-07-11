/*
  Created By : Megha Kariya
  Date : 20/02/2019
  Description : action file of Request Format API
*/
import{
    GET_REQUEST_FORMET,
    GET_REQUEST_FORMET_SUCESSFULL,
    GET_REQUEST_FORMET_FAIL,
    
    ADD_REQUEST_FORMET_LIST,
    ADD_REQUEST_FORMET_LIST_SUCESSFUL,
    ADD_REQUEST_FORMET_LIST_FAIL,
    
    EDIT_REQUEST_LIST,
    EDIT_REQUEST_LIST_SUCESSFUL,
    EDIT_REQUEST_LIST_FAILED,
    
    GET_APP_TYPE,
    GET_APP_TYPE_SUCESSFULL,
    GET_APP_TYPE_FAIL,

}from"Actions/types"

// Display Actions 
export const getrequestformet = data => ({
    type: GET_REQUEST_FORMET,
    payload:{data}
  });
  export const getrequestformetSucessfull = response => ({
    type: GET_REQUEST_FORMET_SUCESSFULL,
    payload:response
    
  });
  export const getrequestformetfail = error => ({
    type: GET_REQUEST_FORMET_FAIL,
    payload:error
    
    
  });

  // Add Actions

  export const addrequestformetlist =data =>({
    type:ADD_REQUEST_FORMET_LIST,
    payload:data
  });

  export const addrequestformetlistSucessfull = response =>({
    type:ADD_REQUEST_FORMET_LIST_SUCESSFUL,
    payload:response
  });

  export const addrequestformetlistFail = error =>({
    type :ADD_REQUEST_FORMET_LIST_FAIL,
    payload: error
  });


  // Edit Action 
 
  export const editrequestlist= data =>({
    type: EDIT_REQUEST_LIST,
    payload: data 
  });

  export const editrequestlistSucessful = response =>({
    type:EDIT_REQUEST_LIST_SUCESSFUL,
    payload: response
  })

  export const editrequestlistfail = error=>({
    type:EDIT_REQUEST_LIST_FAILED,
    payload: error
  })

  export const getAppType = () => ({
    type: GET_APP_TYPE,
    payload:{}
  });
  export const getAppTypeSucessfull = response => ({
    type: GET_APP_TYPE_SUCESSFULL,
    payload:response
    
  });
  export const getAppTypefail = error => ({
    type: GET_APP_TYPE_FAIL,
    payload:error
    
    
  });


  
  