/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Phone Number Component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from "./Widgets";
import { DashboardPageTitle } from './DashboardPageTitle';
// import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { getPhoneNumberData } from 'Actions/MyAccount';

class PhoneNumberDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }
    componentWillMount() {
        this.props.getPhoneNumberData();
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
    render() {
        const { drawerClose, phoneDashData, loading } = this.props;
        return (

            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.phoneNumber" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            :
                            /* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */
                            < CountCard
                                title={<IntlMessages id="my_account.verifyNumbers" />}
                                count={phoneDashData.verify_number > 0 ? phoneDashData.verify_number : 0}
                                icon="zmdi zmdi-smartphone-android"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            /* </a> */
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            /* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */
                            : <CountCard
                                title={<IntlMessages id="my_account.unVerifiedNumbers" />}
                                count={phoneDashData.unVerify_number > 0 ? phoneDashData.unVerify_number : 0}
                                icon="zmdi zmdi-smartphone-erase"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            /* </a> */
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
                        <SimpleCard
                            title={<IntlMessages id="my_account.addNumbers" />}
                            icon="zmdi zmdi-plus-circle"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                        {/* </a> */}
                    </div>
                </div>
            </div>
        )
    }
}
const mapToProps = ({ phoneNumberDashboard }) => {
    const { phoneDashData, loading } = phoneNumberDashboard;
    return { phoneDashData, loading };
}

export default connect(mapToProps, {
    getPhoneNumberData
})(PhoneNumberDashboard);

//export { PhoneNumberDashboard };