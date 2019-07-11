/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 22-11-2018
    UpdatedDate : 23-11-2018
    Description : CMS Dashboard route index component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import CmsDashboard from "Components/Cms/CmsDashboard";

// Component for cms dashboard
class Cms extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="wallet-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.cms" />}
                    match={match}
                />
                <CmsDashboard {...this.props}/>
            </div>
        );
    }
}
export default Cms;