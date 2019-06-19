/* 
    Developer : Devang Parekh
    Date : 18-4-2019
    File Comment : financial dashboard component binding
*/

import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {FinancialDashboard} from "Components/Financial";
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

// Component for wallet dashboard
class FinancialDetailDashboard extends Component {
    render() {
        const { match } = this.props;
        
        return (
            <div className="drawer-data myaccount-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.financial" />}
                    match={match}
                />
                {//checkAndGetMenuAccessDetail('E8FEEB92-0BD0-5246-4B49-44D3FC9E071B') && //E8FEEB92-0BD0-5246-4B49-44D3FC9E071B
                    <FinancialDashboard {...this.props} />
                }
            </div>
        );
    }
}

export default FinancialDetailDashboard;