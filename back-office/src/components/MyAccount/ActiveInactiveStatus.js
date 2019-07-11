/* 
    Developer : Salim Deraiya
    Date : 27-11-2018
    File Comment : Active Inactive Component
*/
import React from "react";
import { Badge } from 'reactstrap';
import IntlMessages from "Util/IntlMessages";

export const ActiveInactiveStatus = ({ status }) => {
    var htmlStatus = '';
    if (status) {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    } else {
        htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>;
    }

    return htmlStatus;
}