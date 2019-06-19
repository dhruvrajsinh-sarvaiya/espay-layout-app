/* 
    Developer : Salim Deraiya
    Date : 26-11-2018
    Updated By : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Organization Form Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import MatButton from '@material-ui/core/Button';
import OrganiztionFormWdgt from '../OrganiztionFormWdgt';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import 'rc-drawer/assets/index.css';

//BreadCrumbData
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.organizationInfo" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.organizationInfo" />,
        link: '',
        index: 2
    }
];

// Component for MyAccount Organization Form Dashboard
class OrganizationFormDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    //Added by Bharat Jograna, (BreadCrumb)09 March 2019
    componentWillReceiveProps(nextProps) {
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }
    }


    render() {
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.organizationInfo" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <OrganiztionFormWdgt />
            </div>
        );
    }
}

//Added by Bharat Jograna (BreadCrumb)09 March 2019
const mapToProps = ({ drawerclose }) => {
    // To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    return { drawerclose };
}

export default connect(mapToProps, {})(OrganizationFormDashboard);