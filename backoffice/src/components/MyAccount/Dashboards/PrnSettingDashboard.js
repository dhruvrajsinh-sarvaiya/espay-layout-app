/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Email Address Component
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import MatButton from '@material-ui/core/Button';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import { Input } from "reactstrap";
import Switch from '@material-ui/core/Switch';
import { DashboardPageTitle } from './DashboardPageTitle';

class PrnSettingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            themeMode: '',
            language: '',
            checkedA: true,
        }
        this.handleChange = this.handleChange.bind(this);
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
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    OnChange = name => (event, checked) => {
        this.setState({ [name]: checked });
    };
    render() {
        const { themeMode, language } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.settings" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="zmdi zmdi-brush"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <Input type="select" className="mb-20" name="themeMode" value={themeMode} id="themeMode" onChange={this.handleChange}>
                                            <option >Please Select</option>
                                            <option value="1">Light</option>
                                            <option value="2">Dark</option>
                                        </Input>
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="my_account.themes" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div>
                        </JbsCard>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="fa fa-language"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <Input type="select" className="mb-20" name="language" value={language} id="language" onChange={this.handleChange}>
                                            <option >Please Select</option>
                                            <option value="1">English</option>
                                            <option value="2">Spanish</option>
                                        </Input>
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="my_account.languages" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div>
                        </JbsCard>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="fa fa-address-card"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <Switch color="primary" checked={this.state.checkedA} onChange={this.OnChange('checkedA')} aria-label="checkedA" />
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="my_account.newsletterSubscription" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div>
                        </JbsCard>
                    </div>
                </div>
            </div>
        )
    }
}
export { PrnSettingDashboard };