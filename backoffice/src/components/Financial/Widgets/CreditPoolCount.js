// Trading Dashboard By Tejas Date : 24/11/2018
import React, { Fragment } from "react";
import { connect } from 'react-redux';

// intl messages
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Row, Col } from 'reactstrap';
import { NotificationManager } from "react-notifications";

// import dashboard
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import {CountCard} from 'Components/Cms/DashboardWidgets';


import InvestedBy196 from './../Reports/InvestedBy196';
import BalanceRaisedBy196 from './../Reports/BalanceRaisedBy196';

// componenet listing
const components = {
    InvestedBy196: InvestedBy196, 
    BalanceRaisedBy196:BalanceRaisedBy196
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
                        <CountCard
                            title={<IntlMessages id="sidebar.issuedBalance" />}
                            count={1278}
                            icon="fa fa-address-book"                    
                        />
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('BalanceRaisedBy196', true/* (checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0')).HasChild */)} className="text-dark col-sm-full">
                            <CountCard
                                title={<IntlMessages id="sidebar.balanceRaisedBy196" />}
                                count={45621}
                                icon="fa fa-address-book"                    
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('InvestedBy196', true/* (checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0')).HasChild */)} className="text-dark col-sm-full">
                            <CountCard
                                title={<IntlMessages id="sidebar.investedBy196" />}
                                count={123644}
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