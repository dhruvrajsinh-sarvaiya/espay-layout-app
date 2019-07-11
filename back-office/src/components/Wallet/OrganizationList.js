/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Organization List Componet
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import ChartConfig from 'Constants/chart-config';
import OrganizationView from './OrganizationView';
import { hexToRgbA } from 'Helpers/helpers';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import {
    CardWidgetType4,
} from './DashboardWidgets';

import {
    getOrgList
} from "Actions/Wallet";

const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="walletDeshbard.organizations" />,
        link: '',
        index: 1
    },
];

class OrganizationList extends Component {
    state = {
        open: false,
        defaultIndex: 0,
    }
    //fetch details before render
    componentWillMount() {
        this.props.getOrgList();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
        })
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
    }
    render() {
        // orders data
        const orgData = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Series A",
                    fill: true,
                    lineTension: 0.3,
                    fillOpacity: 0.3,
                    backgroundColor: hexToRgbA(ChartConfig.color.info, 0.1),
                    borderColor: hexToRgbA(ChartConfig.color.info, 3),
                    borderWidth: 3,
                    pointBackgroundColor: hexToRgbA(ChartConfig.color.info, 3),
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    pointBorderColor: ChartConfig.color.info,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 2,
                    data: [750, 450, 650, 740, 520, 700, 500, 650, 580, 500, 650, 700]
                },
                {
                    label: "Series B",
                    fill: true,
                    lineTension: 0.3,
                    fillOpacity: 0.3,
                    backgroundColor: hexToRgbA(ChartConfig.color.primary, 0.1),
                    borderColor: hexToRgbA(ChartConfig.color.primary, 3),
                    borderWidth: 3,
                    pointBackgroundColor: hexToRgbA(ChartConfig.color.primary, 3),
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    pointBorderColor: ChartConfig.color.primary,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 2,
                    data: [475, 845, 565, 174, 352, 570, 250, 465, 658, 550, 365, 470]
                },
                {
                    label: "Series C",
                    fill: true,
                    lineTension: 0.3,
                    fillOpacity: 0.3,
                    backgroundColor: hexToRgbA(ChartConfig.color.purple, 0.1),
                    borderColor: hexToRgbA(ChartConfig.color.purple, 3),
                    borderWidth: 3,
                    pointBackgroundColor: hexToRgbA(ChartConfig.color.purple, 3),
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    pointBorderColor: ChartConfig.color.purple,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 2,
                    data: [275, 445, 365, 274, 552, 470, 750, 465, 358, 650, 465, 270]
                }
            ]
        }
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="walletDeshbard.organizations" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {!this.props.organizationList.hasOwnProperty("Organizations") && <JbsSectionLoader />}
                    {this.props.organizationList.hasOwnProperty("Organizations") && this.props.organizationList.Organizations.map((org, key) => (
                        <div className="col-sm-12 col-md-4 w-xs-full" key={key}>
                            <CardWidgetType4
                                title={org.OrgName}
                                isDefault={(this.state.defaultIndex == key) ? 1 : 0}
                                grandTotal={parseFloat(org.TotalBalance).toFixed(8)}
                                TotalWallets={org.TotalWallets}
                                TotalUsers={org.TotalUsers}
                                data={orgData}
                                changeDefault={(e) => this.changeDefault(key)}
                                clickEvent={this.toggleDrawer} />
                        </div>
                    ))}
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    <OrganizationView {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                </Drawer>
            </div>
        )
    }
}

const mapToProps = ({ superAdminReducer, drawerclose }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { organizationList } = superAdminReducer;
    return { organizationList, drawerclose };
};

export default connect(mapToProps, {
    getOrgList
})(OrganizationList);