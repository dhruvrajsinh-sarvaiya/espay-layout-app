/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Customer Dashboard Actions
*/
import {
    //For Get Customer
    CUSTOMER_DASHBOARD,
    CUSTOMER_DASHBOARD_SUCCESS,
    CUSTOMER_DASHBOARD_FAILURE,

    LIST_CUSTOMER_DASHBOARD_REPORT,
    LIST_CUSTOMER_DASHBOARD_REPORT_SUCCESS,
    LIST_CUSTOMER_DASHBOARD_REPORT_FAILURE
} from "../types";

//For Display Customer Report Count
/* Redux Action To Display Customer Report Count Data */
export const getCustomerData = () => ({
    type: CUSTOMER_DASHBOARD
});

/* Redux Action To Display Customer Report Count Success */
export const getCustomerDataSuccess = (response) => ({
    type: CUSTOMER_DASHBOARD_SUCCESS,
    payload: response
});

/* Redux Action To Display Customer Report Count Data Failure */
export const getCustomerDataFailure = (error) => ({
    type: CUSTOMER_DASHBOARD_FAILURE,
    payload: error
});


//For Display Customer Report
//Redux Action To Display Customer Report
export const getCustomerRptData = data => ({
    type: LIST_CUSTOMER_DASHBOARD_REPORT,
    payload: data
});

//Redux Action To Display Customer Report Success
export const getCustomerRptDataSuccess = response => ({
    type: LIST_CUSTOMER_DASHBOARD_REPORT_SUCCESS,
    payload: response
});

//Redux Action To Display Customer Report Failure
export const getCustomerRptDataFailure = error => ({
    type: LIST_CUSTOMER_DASHBOARD_REPORT_FAILURE,
    payload: error
});
