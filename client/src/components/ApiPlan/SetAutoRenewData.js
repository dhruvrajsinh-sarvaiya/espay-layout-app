// component for Set Auto Renew Api plan Data By Tejas 28/2/2019

import React, { Fragment } from 'react';
// used for display card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import validator from 'validator';
// import for design
import {
    Row,
    Col,
    Label,
    Button,
    Input
} from 'reactstrap';
// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';
// used for display notification
import { NotificationManager } from 'react-notifications';
// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
// import neccessary actions for fetch records
import {
    setAutoRenewal,
    getApiPlanList,
    getUserActivePlan
} from 'Actions/ApiPlan';
// used for connect to store and reducers
import { connect } from "react-redux"

//class for set auto renew 
class SetAutoRenew extends React.Component {

    // define constrctor and set default state
    constructor(props) {
        super(props)

        this.state = {
            renewData: props.selectedData,
            SubscribeID: props.SubscribeID,
            modal: false, // Defines Whether Modal Is displayed Or Not
            renewalDate: props.selectedData.ExpiryDate,
            Days: "",
        }
    }

    //invoke when component is about to get props
    componentWillReceiveProps(nextprops) {

        // used for display erro for auto renew
        if (nextprops.setAutoRenewError && nextprops.setAutoRenewError.ReturnCode === 1) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.setAutoRenewError.ErrorCode}`} />);
            this.props.handleCloseAutoRenew();
        } else if (nextprops.setAutoRenewData && nextprops.setAutoRenewData.ErrorCode === 2253 && nextprops.setAutoRenewData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.setautorenew" />);
            this.props.handleCloseAutoRenew();
            this.props.callRecords()
        }
    }

    // used for handle change days
    handleChangeDays = event => {
        const regexNumeric = /^[0-9]+$/;

        if (event.target.value === "") {
            this.setState({
                Days: "",
                renewalDate: this.state.renewData.ExpiryDate
            })
        }
        else if (validator.matches(event.target.value, regexNumeric)) {
            if (event.target.value > 10) {

                NotificationManager.error(<IntlMessages id="sidebar.ApiPlan.title.days" />)
            }
            else {
                var renewalDate = new Date(this.state.renewData.ExpiryDate);
                renewalDate.setDate(renewalDate.getDate() - event.target.value)
                renewalDate.setHours(renewalDate.getHours() + 5)
                renewalDate.setMinutes(renewalDate.getMinutes() + 30)

                this.setState({
                    Days: event.target.value,
                    renewalDate: renewalDate.toISOString()
                })
            }

        }

    };

    // call api for set auto renew api
    setAutoRenew = () => {

        if (this.state.Days === "") {
            NotificationManager.error(<IntlMessages id="sidebar.ApiPlan.days.title.days" />)
        } else if (this.state.Days < 1) {
            NotificationManager.error(<IntlMessages id="sidebar.ApiPlan.title.days" />)
        } else if (this.state.Days > 10) {
            NotificationManager.error(<IntlMessages id="sidebar.ApiPlan.title.mindays" />)
        } else {
            const data = {
                SubscribePlanID: this.state.renewData.SubscribeID,
                DaysBeforeExpiry: this.state.Days
            }
            this.props.setAutoRenewal(data)
        }
    }

    // render the component
    render() {

        return (
            <Fragment>
                <JbsCollapsibleCard
                    customClasses="text-center"
                    colClasses="col-md-6 col-offset-6"
                >
                    {this.props.setAutoRenewLoading && <JbsSectionLoader />}

                    <Col md={12} className="font-weight-bold text-left" style={{ fontSize: "20px" }}>
                        {<IntlMessages id="sidebar.ApiPlan.title.autorenewal" />}
                    </Col>

                    <Row className="mt-5">
                        <Col md={12} >
                            <JbsCollapsibleCard>
                                <Row className="text-left">
                                    <Label for="planname" sm={6}>
                                        {<IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire" />}
                                    </Label>
                                    <Col md={6} className="d-flex">
                                        <Input
                                            md={8}
                                            type="text"
                                            name="price"
                                            id="price"
                                            value={this.state.Days}
                                            onChange={this.handleChangeDays}
                                        />
                                        <Col md={4} className="mt-5">
                                            {<IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire.days" />}
                                        </Col>
                                    </Col>
                                </Row>
                                <Row className="text-left">{}
                                    <Label for="planname" sm={6}>
                                        {<IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire.date" />}
                                    </Label>
                                    <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                        {this.state.renewalDate.replace('T', ' ').split('.')[0]}
                                    </Label>
                                </Row>
                                <Row className="text-left">
                                    <Label for="planname" sm={6}>
                                        {<IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire.planname" />}
                                    </Label>
                                    <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                        {this.state.renewData.PlanName}
                                    </Label>
                                </Row>
                                <Row className="text-left">
                                    <Label for="planname" sm={6}>
                                        {<IntlMessages id="components.expiryDate" />}
                                    </Label>
                                    <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                        {this.state.renewData.ExpiryDate.replace('T', ' ').split('.')[0]}
                                    </Label>
                                </Row>
                                <Row style={{ fontSize: "16px" }} className="font-weight-bold">
                                    <IntlMessages id={`sidebar.ApiPlan.auto.confirm.title`}
                                        values={{
                                            Param1: this.state.renewData.PlanName,
                                            Param2: this.state.Days,
                                            Param3: this.state.renewData.ExpiryDate.replace('T', ' ').split('.')[0]
                                        }} />
                                </Row>
                                <Col sm={{ size: "4", offset: "8" }} className="text-center d-inline mt-10">
                                    <Button
                                        variant="raised"
                                        color="success"
                                        className="text-white m-5"
                                        onClick={this.setAutoRenew}
                                    >
                                        <span>
                                            <IntlMessages id="wallet.btnConfirm" />
                                        </span>
                                    </Button>
                                    <Button
                                        variant="raised"
                                        onClick={this.props.handleCloseAutoRenew}
                                        className="btn-danger text-white m-5"
                                    >
                                        <span>
                                            <IntlMessages id="button.cancel" />
                                        </span>
                                    </Button>
                                </Col>
                            </JbsCollapsibleCard>
                        </Col>
                    </Row>
                </JbsCollapsibleCard>
            </Fragment>
        )
    }
}

//export default SetAutoRenew;
const mapStateToProps = ({ apiPlan }) => {
    const {
        setAutoRenewError,
        setAutoRenewLoading,
        setAutoRenewData
    } = apiPlan;
    return {
        setAutoRenewError,
        setAutoRenewLoading,
        setAutoRenewData
    }
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    setAutoRenewal,
    getApiPlanList,
    getUserActivePlan
})(SetAutoRenew);