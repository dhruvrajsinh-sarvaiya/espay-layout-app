/**
 * Created By Sanjay
 * Creadted Date : 09/02/2019
 * Configuration Setup For Referral System
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import Switch from '@material-ui/core/Switch';
import IntlMessages from "Util/IntlMessages";
import { DashboardPageTitle } from './DashboardPageTitle';
import { Form, Input, Label, FormGroup } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from "@material-ui/core/Button";
import { addConfigurationSetup } from "Actions/MyAccount";
import { getLedgerCurrencyList } from "Actions/TradingReport";
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
//Validation
const validateConfigSetup = require("../../../validation/MyAccount/configuration_setup");

class ConfigurationSetupDashboard extends Component {

    state = {
        open: false,
        data: {
            Reward: "",
            ReferralOnOff: "1",
            RewardCurrency: "",
            RewardTime: '',
            DeviceId: getDeviceInfo(),
            Mode: getMode(),
            IPAddress: '',
            HostName: getHostName(),
        },
        currencyList: [],
        loading: false,
        checked: true,
        errors: ""
    }

    componentWillMount() {
        this.props.getLedgerCurrencyList({});
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.currencyList !== 'undefined' && nextProps.currencyList.length) {
            this.setState({
                currencyList: nextProps.currencyList
            })
        }
    }

    resetData = () => {
        this.setState({
            data: {
                Reward: "",
                RewardCurrency: "",
                RewardTime: '',
                ReferralOnOff: "",
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            errors: ""
        });
        this.props.drawerClose();
    }

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    handleCheckChange = name => (event) => {
        this.setState({ [name]: event.target.checked });
        this.setState({
            data: {
                ...this.state.data,
                ReferralOnOff: (event.target.checked === true) ? "1" : "0"
            }
        })
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    OnAddConfigSetup = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateConfigSetup(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (IPAddress) {
                reqObj.IPAddress = IPAddress;
                self.props.addConfigurationSetup(reqObj);
            });
            this.resetData();
        }
    }

    render() {
        const { drawerClose, loading } = this.props;
        const { errors } = this.state;
        const { Reward, RewardCurrency, RewardTime } = this.state.data;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.configurationSetup" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading && <div><LinearProgress color="secondary" /></div>}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        <FormGroup row className="mb-20">
                            <Label className="control-label col-md-4 text-left mt-15">
                                <IntlMessages id="my_account.ReferralOnOff" />
                            </Label>
                            <div className="col-md-4">
                                <Switch
                                    checked={this.state.checked}
                                    onChange={this.handleCheckChange('checked')}
                                    value="checked"
                                    color="primary"
                                />
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20">
                            <Label for="Reward" className="control-label col-md-4 text-left"><IntlMessages id="my_account.Reward" /></Label>
                            <div className="col-md-4">
                                <IntlMessages id="my_account.Reward">
                                    {(placeholder) =>
                                        <Input type="text" name="Reward" value={Reward} placeholder={placeholder} id="Reward" onChange={this.handleChange} />
                                    }
                                </IntlMessages>
                                {errors.Reward && (<span className="text-danger text-left"><IntlMessages id={errors.Reward} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20">
                            <Label for="RewardCurrency" className="control-label col-md-4 text-left"><IntlMessages id="my_account.RewardCurrency" /></Label>
                            <div className="col-md-4">
                                <Input type="select" name="RewardCurrency" className="form-control" id="RewardCurrency" value={RewardCurrency} onChange={this.handleChange}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    {this.state.currencyList.map((currency, key) =>
                                        <option key={key} value={currency.SMSCode}>{currency.SMSCode}</option>
                                    )}
                                </Input>
                                {errors.RewardCurrency && (<span className="text-danger text-left"><IntlMessages id={errors.RewardCurrency} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20">
                            <Label for="RewardTime" className="control-label col-md-4 text-left"><IntlMessages id="my_account.RewardTime" /></Label>
                            <div className="col-md-4">
                                <Input type="select" name="RewardTime" className="form-control" id="RewardTime" value={RewardTime} onChange={this.handleChange}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.Week">{(selectOption) => <option value="Week">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.Month">{(selectOption) => <option value="Month">{selectOption}</option>}</IntlMessages>
                                </Input>
                                {errors.RewardTime && (<span className="text-danger text-left"><IntlMessages id={errors.RewardTime} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20">
                            <Label className="col-md-3" style={{marginLeft:"45px"}} />
                            <div className="col-md-2">
                                <Button variant="raised" className="btn-primary text-white" onClick={this.OnAddConfigSetup}><IntlMessages id="button.add" /></Button>
                            </div>
                            <div className="col-md-2">
                                <Button variant="raised" className="btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ ConfigurationSetupReducers, tradingledger }) => {
    const { addConfigSetupData } = ConfigurationSetupReducers;
    const { currencyList, loading } = tradingledger;
    return { addConfigSetupData, currencyList, loading };
}

export default connect(mapToProps, {
    addConfigurationSetup,
    getLedgerCurrencyList
})(ConfigurationSetupDashboard);
