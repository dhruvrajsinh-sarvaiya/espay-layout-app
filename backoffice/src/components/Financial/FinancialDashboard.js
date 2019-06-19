// Devang Parekh 
// Date : 18-4-2019

import React from 'react';
// intl messages
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
// import dashboard
import { StartUpPoolCount, ServiceProviderPoolCount, CreditPoolCount } from 'Components/Financial';

//import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

/* class FinancialDashboard extends React.Component {
    
    render() {
        
        return (
            
        )
    }
} */

const FinancialDashboard = props => (

    <div className="drawer-data trading-dashboard-wrapper">        
        <div className="row ">
            <div className="col-sm-12">
                <h3 className="text-uppercase"><IntlMessages id="sidebar.startupPool" /></h3>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12 col-md-12 w-xs-full">
                <StartUpPoolCount />
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
                <h3 className="text-uppercase"><IntlMessages id="sidebar.creditPool" /></h3>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12 col-md-12 w-xs-full">
                <CreditPoolCount />
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
                <h3 className="text-uppercase"><IntlMessages id="sidebar.serviceProviderPool" /></h3>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12 col-md-12 w-xs-full">
                <ServiceProviderPoolCount />
            </div>
        </div>
    </div>

 );

// export this component with action methods and props
export default FinancialDashboard;
//end