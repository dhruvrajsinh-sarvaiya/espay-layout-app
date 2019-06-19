/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Setting Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getSettingData } from 'Actions/MyAccount';
import Switch from '@material-ui/core/Switch';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import { Input } from "reactstrap";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import color from "@material-ui/core/colors/pink";

// Component for MyAccount Setting Dashboard
class SettingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            loadComponent: '',
            checkedA: true,
            signUpMethod: '',
            language: '',
            themeMode: 'darkMode',
            emailProvider: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.props.getSettingData();
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    OnChange = name => (event, checked) => {
        this.setState({ [name]: checked });
    };
    handleChangeRadio = (e, key) => {
        this.setState({ [key]: e.target.value });
    };
    render() {
        const { drawerClose } = this.props;
        const { loadComponent, settingDashData, open, signUpMethod, language, themeMode, emailProvider } = this.state;
        console.log('Setting :', settingDashData);
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.settingsDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {/* <div className="col-sm-12 col-md-4 w-xs-full">
                        <SimpleCard
                            title={<IntlMessages id="sidebar.generalSettings" />}
                            icon="zmdi zmdi-settings"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                    </div> */}
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="zmdi zmdi-settings"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <div className="mt-20 row">
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="sidebar.generalSettings" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            {/* <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div> */}
                        </JbsCard>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="zmdi zmdi-portable-wifi-changes"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <div className="row">
                                            <div className="col-md-6 mt-20"><h1 className="font-weight-normal lh_100"><IntlMessages id="sidebar.2FA" /></h1></div>
                                            <div className="col-md-6"> <Switch color="primary" checked={this.state.checkedA} onChange={this.OnChange('checkedA')} aria-label="checkedA" /></div>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            {/* <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div> */}
                        </JbsCard>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="zmdi zmdi-lock"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <Input type="select" className="mb-20" name="signUpMethod" value={signUpMethod} id="signUpMethod" onChange={this.handleChange}>
                                            <option >Please Select</option>
                                            <option value="1">Standard</option>
                                            <option value="2">2FA</option>
                                        </Input>
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="sidebar.signInNUpMethod" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            {/* <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div> */}
                        </JbsCard>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="zmdi zmdi-brush"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <Input type="select" className="mb-20" name="language" value={language} id="language" onChange={this.handleChange}>
                                            <option >Please Select</option>
                                            <option value="1">English</option>
                                            <option value="2">Spanish</option>
                                        </Input>
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="sidebar.languages" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            {/* <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div> */}
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
                                        <FormGroup>
                                            <RadioGroup row aria-label="themeMode" name="themeMode" value={themeMode} onChange={e => this.handleChangeRadio(e, "themeMode")}>
                                                <FormControlLabel value="darkMode" control={<Radio color="primary" />} label="Dark Mode" />
                                                <FormControlLabel value="lightMode" control={<Radio color="primary" />} label="Light Mode" />
                                            </RadioGroup>
                                        </FormGroup>
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="sidebar.theme" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            {/* <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div> */}
                        </JbsCard>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <JbsCard colClasses="col-sm-full">
                            <JbsCardContent>
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end">
                                        <h1 className="display-3 font-weight-light"><i className="zmdi zmdi-email"></i></h1>
                                    </div>
                                    <div className="text-right">
                                        <Input type="select" className="mb-20" name="emailProvider" value={emailProvider} id="emailProvider" onChange={this.handleChange}>
                                            <option >Please Select</option>
                                            <option value="1">SMTP</option>
                                        </Input>
                                        <div>
                                            <h1 className="font-weight-normal lh_100"><IntlMessages id="my_account.emailProviders" /></h1>
                                        </div>
                                    </div>
                                </div>
                            </JbsCardContent>
                            {/* <Divider />
                            <div className="clearfix py-10 px-20">
                                <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
                                <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
                            </div> */}
                        </JbsCard>
                    </div>
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={open}
                    onMaskClick={this.onClick}
                    className="drawer1"
                    placement="right"
                >
                    <DynamicLoadComponent drawerClose={this.onChildClick} closeAll={this.closeAll} componentName={loadComponent} {...this.props} />
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ settingDashRdcer }) => {
    const { settingDashData, loading } = settingDashRdcer;
    return { settingDashData, loading };
}

export default connect(mapToProps, {
    getSettingData
})(SettingDashboard);