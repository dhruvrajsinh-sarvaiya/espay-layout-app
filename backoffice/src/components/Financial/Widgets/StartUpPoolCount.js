// Trading Dashboard By Tejas Date : 24/11/2018
import React, { Fragment } from "react";
import { connect } from 'react-redux';

// intl messages
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";

// import dashboard
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

import {CountCard} from 'Components/Cms/DashboardWidgets';

import ListOfStartUP from './../Reports/ListOfStartUp';
import FundingStages from './../Reports/FundingStages';
import EquityPool196 from './../Reports/EquityPool196';

// componenet listing
const components = {
    ListOfStartUP: ListOfStartUP, 
    FundingStages:FundingStages,
    EquityPool196:EquityPool196

};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

class FinancialDashboard extends React.Component {
    state = {
        componentName: '',
        open: false,
        tradeSummaryCounts: [],
        configurationsCounts: [],
        userTradeCounts: []
    }

    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
        });
    }

    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }

    }

    closeAll = () => {
        this.setState({
            open: false,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
            })
        }
    }

    render() {
        
        return (
            <Fragment>
                
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListOfStartUP', true/* (checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0')).HasChild */)} className="text-dark col-sm-full">
                            <CountCard
                                title={<IntlMessages id="sidebar.listOfStartUp" />}
                                count={12365}
                                icon="fa fa-address-book"                    
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <CountCard
                            title={<IntlMessages id="sidebar.totalShare" />}
                            count={45621}
                            icon="fa fa-address-book"                    
                        />
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <CountCard
                            title={<IntlMessages id="sidebar.currentValuation" />}
                            count={123644}
                            icon="fa fa-address-book"                    
                        />
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('FundingStages', true/* (checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0')).HasChild */)} className="text-dark col-sm-full">
                            <CountCard
                                title={<IntlMessages id="sidebar.fundingStages" />}
                                count={456}
                                icon="fa fa-address-book"                    
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('EquityPool196', true/* (checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0')).HasChild */)} className="text-dark col-sm-full">
                            <CountCard
                                title={<IntlMessages id="sidebar.196EquityPool" />}
                                count={7894}
                                icon="fa fa-address-book"                    
                            />
                        </a>
                    </div>
                </div>

                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    placement="right"
                    //level=".drawer1"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"

                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </Fragment>
        )
    }
}

// code comment & add new code by devang parekh for handle mapstate to props (18-3-2019)
const mapStateToProps = ({ drawerclose }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { drawerclose };
}

// export this component with action methods and props
export default connect(mapStateToProps, {})(FinancialDashboard);
//end