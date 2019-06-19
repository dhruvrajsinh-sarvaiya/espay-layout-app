/* 
    Developer : Salim Deraiya
    Date : 04-03-2018
    File Comment : MyAccount Affiliate Commission Pattern Component
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { FormGroup, Label, Input, Alert, Row, Form, Col, Button } from "reactstrap";
// import { addProfileConfigData, getKYCLevelList, getProfileLevelList, getCurrencyList } from 'Actions/MyAccount';
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { DashboardPageTitle } from './DashboardPageTitle';
import { } from "Helpers/helpers";
// var validateProfileConfig = require("../../../validation/MyAccount/profile_configuration");
const commissionLevelLimit = 10;

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
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.profileConfiguration" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.addProfileConfigDashboard" />,
        link: '',
        index: 0
    }
];

// initial state
const initialStateData = {
    TypeId: "",
    Description: "",
    OtherInfo: "",
    DepositScheme: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    BuyTradeScheme: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    SellTradeScheme: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    open: false,
    loading: false,
    errors: {},
};

class AffiliateCommissionPattern extends Component {
    constructor(props) {
        super(props);
        this.state = initialStateData;
        this.initState = this.state;
        this.onChange = this.onChange.bind(this);
    }

    closeAll = () => {
        this.resetState();
        this.props.closeAll();
        this.setState({
            open: false
        });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    };


    handleCancel(e) {
        e.preventDefault();
        this.resetState();
        this.props.drawerClose();
    }

    onSubmit(e) {
        e.preventDefault();
        console.log('onSubmit :',this.state);
        /* const { errors, isValid } = validateProfileConfig(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            let self = this;
            const { TypeId, ProfileFree, Description, KYCLevel, LevelName, DepositFee, Withdrawalfee, Tradingfee, Profilelevel, IsProfileExpiry, IsRecursive, SubscriptionAmount, TransactionLimit, WithdrawalLimit, TradeLimit, DepositLimit, DeviceId, Mode, HostName } = this.state
            getIPAddress().then(function (IPAddress) {
                self.props.addProfileConfigData({ TypeId, ProfileFree, Description, KYCLevel, LevelName, DepositFee, Withdrawalfee, Tradingfee, Profilelevel, IsProfileExpiry, IsRecursive, SubscriptionAmount, TransactionLimit, WithdrawalLimit, TradeLimit, DepositLimit, IPAddress, DeviceId, Mode, HostName });
            });
            this.resetState();
        } */
    }

    // add dynamic column
    addNewColumn(value) {
        console.log('addNewColumn :',value);
        if (errors.hasOwnProperty("depositScheme")) {
            const tempErrors = Object.assign([], errors);
            const tempObj = {};
            tempErrors.depositScheme.push(tempObj);
            this.setState({ errors: tempErrors });
        }
        let newObj1 = { TypeId: "", Commission: "", Type: "", Note: "" };
        this.setState({ DepositScheme: DepositScheme.concat(newObj1) });
        // if (value === "TransactionLimit") {
        //     /* check if already submited and error object has been created */
        //     if (errors.hasOwnProperty("transLimit")) {
        //         const tempErrors = Object.assign([], errors);
        //         const tempObj = {};
        //         tempErrors.transLimit.push(tempObj);
        //         this.setState({ errors: tempErrors });
        //     }
        //     let newObj1 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
        //     this.setState({ TransactionLimit: DepositScheme.concat(newObj1) });
        // }
        // if (value === "WithdrawalLimit") {
        //     /* check if already submited and error object has been created */
        //     if (errors.hasOwnProperty("withLimit")) {
        //         const tempErrors = Object.assign([], errors);
        //         const tempObj = {};
        //         tempErrors.withLimit.push(tempObj);
        //         this.setState({ errors: tempErrors });
        //     }
        //     let newObj2 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
        //     this.setState({ WithdrawalLimit: this.state.WithdrawalLimit.concat(newObj2) });
        // }
        // if (value === "TradeLimit") {
        //     /* check if already submited and error object has been created */
        //     if (errors.hasOwnProperty("tradLimit")) {
        //         const tempErrors = Object.assign([], errors);
        //         const tempObj = {};
        //         tempErrors.tradLimit.push(tempObj);
        //         this.setState({ errors: tempErrors });
        //     }
        //     let newObj3 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
        //     this.setState({ TradeLimit: this.state.TradeLimit.concat(newObj3) });
        // }
        // if (value === "DepositLimit") {
        //     /* check if already submited and error object has been created */
        //     if (errors.hasOwnProperty("depositLimit")) {
        //         const tempErrors = Object.assign([], errors);
        //         const tempObj = {};
        //         tempErrors.depositLimit.push(tempObj);
        //         this.setState({ errors: tempErrors });
        //     }
        //     let newObj4 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
        //     this.setState({ DepositLimit: this.state.DepositLimit.concat(newObj4) });
        // }
    }

    // handle change
    handleChange(e, index, key, vlaue1) {
        console.log('handleChange :',e,index,key,value);
        /* if (vlaue1 === "TransactionLimit") {
            let tmpObject1 = Object.assign([], DepositScheme);
            tmpObject1[index][key] = e.target.value;
            this.setState({ TransactionLimit: tmpObject1 });
        }
        if (vlaue1 === "WithdrawalLimit") {
            let tmpObject2 = Object.assign([], this.state.WithdrawalLimit);
            tmpObject2[index][key] = e.target.value;
            this.setState({ WithdrawalLimit: tmpObject2 });
        }
        if (vlaue1 === "TradeLimit") {
            let tmpObject3 = Object.assign([], this.state.TradeLimit);
            tmpObject3[index][key] = e.target.value;
            this.setState({ TradeLimit: tmpObject3 });
        }
        if (vlaue1 === "DepositLimit") {
            let tmpObject4 = Object.assign([], this.state.DepositLimit);
            tmpObject4[index][key] = e.target.value;
            this.setState({ DepositLimit: tmpObject4 });
        } */
    }

    componentWillMount() {
        /* this.props.getKYCLevelList();
        this.props.getProfileLevelList();
        this.props.getProfileType();
        this.props.getCurrencyList(); */
    }

    //Handle Change
    onChange(event) { this.setState({ [event.target.name]: event.target.value }); }

    // handle back to page
    handleBack() { this.resetState(); this.props.drawerClose(); }

    //reset state to default
    resetState() {
        this.setState(initialStateData);

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });        
    }

    render() {
        const { TypeId, Description, OtherInfo, DepositScheme, BuyTradeScheme, SellTradeScheme, errors } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.addProfileConfigDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {this.props.loading && <JbsSectionLoader />}
                <JbsCollapsibleCard contentCustomClasses="p-30">
                    <Form>
                        <div className="row">
                            <FormGroup className="col-md-12 mr-0">
                                <Label for="TypeId">Type</Label>
                                <Input type="select" name="TypeId" id="TypeId" value="" className="w-25">
                                    <option value="">-- Select Type --</option>
                                    <option value="1">Type A (MLM)</option>
                                    <option value="2">Type B (Slab)</option>
                                    <option value="3">Type C (Flat)</option>
                                </Input>
                                {errors.TypeId && (<span className="text-danger"><IntlMessages id={errors.TypeId} /></span>)}
                            </FormGroup>
                            <FormGroup className="col-md-12 mr-0">
                                <Label for="Description"><IntlMessages id="my_account.description" /></Label>
                                <Input type="textarea" name="Description" rows="5" id="Description" placeholder="Enter Description" value={Description} onChange={this.onChange} />
                                {errors.Description && (<span className="text-danger"><IntlMessages id={errors.Description} /></span>)}
                            </FormGroup>
                            <FormGroup className="col-md-12 mr-0">
                                <Label for="OtherInfo">Other Information</Label>
                                <Input type="text" name="OtherInfo" id="OtherInfo" placeholder="Enter OtherInfo" value={OtherInfo} onChange={this.onChange} />
                                {errors.OtherInfo && (<span className="text-danger"><IntlMessages id={errors.OtherInfo} /></span>)}
                            </FormGroup>
                        </div>
                        {/* Transaction Limit */}
                        {errors.selectTransLimit && (
                            <FormGroup className="d-flex mb-0">
                                <Label><span className="text-danger"><IntlMessages id={errors.selectTransLimit} /> </span> </Label>
                            </FormGroup>
                        )}
                        <div className="activity-board-wrapper">
                            <div className="comment-box mb-4 p-20">
                                <h1>Deposition Scheme</h1>
                                {DepositScheme.length && DepositScheme.map((transLimit, index) => (
                                    <div key={index} className="affcmsptrn">
                                        <div className="d-inline-block mr-15">
                                            <FormGroup>
                                                <Label className="">Level</Label>
                                                <Input type="select" className={(errors.transLimit && errors.transLimit[index].Level) ? "is-invalid" : ""} name={"Level" + index} value={DepositScheme[index].Level} onChange={e => this.handleChange(e, index, "Level", "DepositionScheme")}>
                                                    <option value="">-- Select Level --</option>
                                                    {Array.apply(0, Array(commissionLevelLimit)).map(function (x, i) {
                                                        return <option value={i}>{i + " Level"}</option>;
                                                    })}
                                                    <option value="N">N Level</option>
                                                </Input>
                                            </FormGroup>
                                        </div>
                                        <div className="d-inline-block mr-15">
                                            <FormGroup>
                                                <Label className="">Commission</Label>
                                                <Input type="number" className={(errors.transLimit && errors.transLimit[index].Commission) ? "is-invalid" : ""} name={"Commission" + index} value={DepositScheme[index].Commission} onChange={e => this.handleChange(e, index, "Commission", "DepositionScheme")} />
                                            </FormGroup>
                                        </div>
                                        <div className="d-inline-block mr-15">
                                            <FormGroup>
                                                <Label className="">Type</Label>
                                                <Input type="select" className={(errors.transLimit && errors.transLimit[index].Type) ? "is-invalid" : ""} name={"Type" + index} value={DepositScheme[index].Type} onChange={e => this.handleChange(e, index, "Type", "DepositionScheme")}>
                                                    <option value="">-- Select Type --</option>
                                                    <option value="1">Percentage</option>
                                                    <option value="2">Fixed</option>
                                                </Input>
                                            </FormGroup>
                                        </div>
                                        <div className="d-inline-block mr-15">
                                            <FormGroup>
                                                <Label className="">Note</Label>
                                                <Input type="text" className={(errors.transLimit && errors.transLimit[index].Note) ? "is-invalid" : ""} name={"Note" + index} value={DepositScheme[index].Note} onChange={e => this.handleChange(e, index, "Note", "DepositionScheme")} />
                                            </FormGroup>
                                        </div>
                                        <div className="d-inline-block">
                                            <FormGroup>
                                                <a className="font-2x" href="javascript:void(0)" onClick={e => this.setState({ DepositionScheme: DepositScheme.filter((_, i) => i !== index) })}> <i className="zmdi zmdi-delete"></i> </a>
                                            </FormGroup>
                                        </div>
                                    </div>
                                ))}
                                <Row>
                                    <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block">
                                        <MatButton variant="raised" className="btn-primary text-white" onClick={e => this.addNewColumn("TransactionLimit")} > <IntlMessages id="wallet.btnAddRoutes" /> </MatButton>
                                    </div>
                                </Row>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 justify-content-center d-flex">
                            <FormGroup className="mb-10">
                                <MatButton variant="raised" size="small" className="btn-primary text-white mr-10" onClick={e => this.onSubmit(e)}> <IntlMessages id={"button.add"} /> </MatButton>
                                <MatButton variant="raised" size="small" className="btn-danger text-white" onClick={e => this.handleCancel(e)}> <IntlMessages id="button.cancel" /> </MatButton>{" "}
                            </FormGroup>
                        </div>                    
                    </Form>
                </JbsCollapsibleCard>
            </div>
        );
    }
}

/* const mapStateToProps = ({ profileConfigurationRdcer }) => {
    const { data, currencyList, profileType, loading, kycLevelList, profileLevelList, ext_flag } = profileConfigurationRdcer;
    return { data, currencyList, profileType, loading, kycLevelList, profileLevelList, ext_flag };
};

export default connect(mapStateToProps, {
    addProfileConfigData, getProfileType, getKYCLevelList, getProfileLevelList, getCurrencyList
})(AffiliateCommissionPattern); */

export default AffiliateCommissionPattern;
