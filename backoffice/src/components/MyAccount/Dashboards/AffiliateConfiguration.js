/*
    Developer : Salim Deraiya
    Date : 04-03-2019
    Update by : 
    File Comment : Setup Affiliate Configuration
*/

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import Switch from '@material-ui/core/Switch';
import { DashboardPageTitle } from './DashboardPageTitle';
import { saveAffiliateSetupConfigure, getAffiliateSetupConfigure } from "Actions/MyAccount";
import validateAffiliateConfig from 'Validations/MyAccount/affiliate_config';

// Component for Setup Affiliate Configuration
class AffiliateConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                isAffiliate : false,
                isSignupComission : false,
                isWithdraw : false,
                emailTemplate : '',
                smsTemplate: '',
                withdrawLimit: ''
            },
            isAddData : false,
            errors: ""
        };
        this.initState = this.state;
    }

    resetData() {
        this.setState(this.initState);
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    handleCheckChange = name => (event, checked) => {
        var newState = Object.assign({},this.state.data);
        newState[ name ] = checked;
        this.setState({ data : newState });
    };

    componentWillMount() {
        this.props.getAffiliateSetupConfigure();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        
        //Get Role Data By Id
        if (nextProps.setupConfig.hasOwnProperty('data') && Object.keys(nextProps.setupConfig.data).length > 0) {
            this.setState({ data : nextProps.setupConfig.data });
        }

        //Add/Edit Data
        if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.props.getAffiliateSetupConfigure();
            this.setState({ isAddData : false });
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }
	}

    //Setup Affiliate Configuration...
    onSetupAffiliateConfiguration(event) {
        event.preventDefault();
        /* const { errors, isValid } = validateRoles(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData : true });
            this.props.saveAffiliateSetupConfigure(this.state.data);
        } */
    }

    render() {
        const { drawerClose } = this.props;
        const { errors } = this.state;
        const { isAffiliate, isSignupComission, isWithdraw, withdrawLimit, emailTemplate, smsTemplate } = this.state.data;
        return (
            <Fragment>
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <DashboardPageTitle title={<IntlMessages id="sidebar.affiliateSetupConfiguration" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            <FormGroup className="row">
                                <Label for="RoleName" className="control-label col-md-4" ><IntlMessages id="sidebar.isAffiliate" /></Label>
                                <div className="col-md-8">
                                    <Switch checked={isAffiliate} value={isAffiliate} color="primary" onChange={this.handleCheckChange('isAffiliate')} />
                                </div>
                            </FormGroup>
                            <FormGroup className="row">
                                <Label for="RoleName" className="control-label col-md-4" ><IntlMessages id="sidebar.isSignupCommission" /></Label>
                                <div className="col-md-8">
                                    <Switch checked={isSignupComission} value={isSignupComission} color="primary" onChange={this.handleCheckChange('isSignupComission')} />
                                </div>
                            </FormGroup>
                            <FormGroup className="row">
                                <Label for="RoleName" className="control-label col-md-4" ><IntlMessages id="sidebar.withdrawOption" /></Label>
                                <div className="col-md-8">
                                    <Switch checked={isWithdraw} value={isWithdraw} color="primary" onChange={this.handleCheckChange('isWithdraw')} />
                                </div>
                            </FormGroup>
                            <FormGroup className="row">
                                <Label for="withdrawLimit" className="control-label col-md-4" ><IntlMessages id="sidebar.withdrawLimit" /></Label>
                                <div className="col-md-8">
                                    <IntlMessages id="sidebar.enterwithdrawLimit">
                                        {(placeholder) =>
                                            <Input type="text" name="withdrawLimit" value={withdrawLimit} placeholder={placeholder} id="withdrawLimit" onChange={(e) => this.onChange(e)} />
                                        }
                                    </IntlMessages>
                                    {errors.withdrawLimit && <span className="text-danger text-left"><IntlMessages id={errors.withdrawLimit} /></span>}
                                </div>
                            </FormGroup>
                            <FormGroup className="row">
                                <Label for="emailTemplate" className="control-label col-md-4" ><IntlMessages id="sidebar.emailTemplate" /></Label>
                                <div className="col-md-8">
                                    <IntlMessages id="sidebar.enterEmailTemplate">
                                        {(placeholder) =>
                                            <Input type="textarea" name="emailTemplate" rows="5" value={emailTemplate} placeholder={placeholder} id="emailTemplate" onChange={(e) => this.onChange(e)} />
                                        }
                                    </IntlMessages>
                                    {errors.emailTemplate && <span className="text-danger text-left"><IntlMessages id={errors.emailTemplate} /></span>}
                                </div>
                            </FormGroup>
                            <FormGroup className="row">
                                <Label for="smsTemplate" className="control-label col-md-4" ><IntlMessages id="sidebar.smsTemplate" /></Label>
                                <div className="col-md-8">
                                    <IntlMessages id="sidebar.enterSMSTemplate">
                                        {(placeholder) =>
                                            <Input type="textarea" name="smsTemplate" rows="5" value={smsTemplate} placeholder={placeholder} id="smsTemplate" onChange={(e) => this.onChange(e)} />
                                        }
                                    </IntlMessages>
                                    {errors.smsTemplate && <span className="text-danger text-left"><IntlMessages id={errors.smsTemplate} /></span>}
                                </div>
                            </FormGroup>
                            <FormGroup className="row">
                                <div className="offset-md-4 col-md-8 p-0">
                                    <div className="ds-block">
                                        <Button disabled={this.props.loading} variant="raised" color="primary" className="mr-15" onClick={(e) => this.onSetupAffiliateConfiguration(e)}><IntlMessages id="sidebar.btnSave" /></Button>
                                        <Button disabled={this.props.loading} variant="raised" color="danger" onClick={() => this.resetData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapToProps = ({ affiliateConfigureRdcer }) => {
    const { data, setupConfig, loading } = affiliateConfigureRdcer;
    return { data, setupConfig, loading };
}

export default connect(mapToProps, {
    saveAffiliateSetupConfigure,
    getAffiliateSetupConfigure
})(AffiliateConfiguration);