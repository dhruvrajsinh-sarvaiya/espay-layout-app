// component for Set API Custom limits By Tejas 14/9/2019
import React, { Component, Fragment } from 'react';
// import for design
import {
    Row,
    Col,
    Label,
    Button,
    FormGroup,
    Input,
    Card
} from 'reactstrap';

//used fro jquery
import $ from 'jquery';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';
import validator from 'validator';
// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// used for connect
import { NotificationManager } from "react-notifications";

// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// import neccessary actions for fetch records
import {
    setCustomLimits,
    updateCustomLimits
} from 'Actions/ApiPlan';

// used for connect
import { connect } from "react-redux"

// class for Set API Custom Limits
class SetCustomLimits extends Component {

    // construcrtor
    constructor(props) {
        super(props)
        var readOnlyMethods = [], fullAccessMethods = []
        if (props.IsUpdate) {

            readOnlyMethods = Object.keys(props.customLimits.ReadOnlyAPI)
            fullAccessMethods = Object.keys(props.customLimits.FullAccessAPI)
        }


        this.state = {
            customLimits: props.customLimits ? props.customLimits : {},
            SubscribeID: props.SubscribeID !== 0 ? props.SubscribeID : 0,
            FullAccessAPI: props.FullAccessAPI !== null ? props.FullAccessAPI : [],
            ReadOnlyAPI: props.ReadOnlyAPI !== null ? props.ReadOnlyAPI : [],
            isDefaultSet: false,
            maxCallPerDay: props.IsUpdate && props.customLimits.MaxPerDay !== "" ? props.customLimits.MaxPerDay : "",
            maxCallPerMin: props.IsUpdate && props.customLimits.MaxPerMinute !== "" ? props.customLimits.MaxPerMinute : "",
            maxCallPerMonth: props.IsUpdate && props.customLimits.MaxPerMonth !== "" ? props.customLimits.MaxPerMonth : "",
            maxOrderPerSec: props.IsUpdate && props.customLimits.MaxOrderPerSec !== "" ? props.customLimits.MaxOrderPerSec : "",
            maxRecRequest: props.IsUpdate && props.customLimits.MaxRecPerRequest !== "" ? props.customLimits.MaxRecPerRequest : "",
            whiteListIPLimit: props.IsUpdate && props.customLimits.WhitelistedEndPoints !== "" ? props.customLimits.WhitelistedEndPoints : "",
            concurrentIPAllow: props.IsUpdate && props.customLimits.ConcurrentEndPoints !== "" ? props.customLimits.ConcurrentEndPoints : "",
            maxReqSize: props.IsUpdate && props.customLimits.MaxReqSize !== "" ? props.customLimits.MaxReqSize : "",
            maxResSize: props.IsUpdate && props.customLimits.MaxResSize !== "" ? props.customLimits.MaxResSize : "",
            historicalData: props.IsUpdate && props.customLimits.HistoricalDataMonth !== "" ? props.customLimits.HistoricalDataMonth : "",
            readOnlyAPI: props.IsUpdate && readOnlyMethods ? readOnlyMethods : [],
            fullAccessAPI: props.IsUpdate && fullAccessMethods ? fullAccessMethods : [],
            limitID: props.IsUpdate && props.customLimits.LimitID !== "" ? props.customLimits.LimitID : 0,
            isUpdateCustomLimit: 0,
            isSetCustomLimit: 0,
            updateRecord: false
        }

    }

    //used fro set custom limits
    SetCustomLimits = () => {

        const {
            SubscribeID,
            maxCallPerDay,
            maxCallPerMin,
            maxCallPerMonth,
            maxOrderPerSec,
            maxRecRequest,
            whiteListIPLimit,
            concurrentIPAllow,
            maxReqSize,
            maxResSize,
            historicalData,
            readOnlyAPI,
            fullAccessAPI
        } = this.state

        if (maxCallPerDay === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerDay" />)
        } else if (maxCallPerMin === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerMin" />)
        } else if (maxCallPerMonth === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerMonth" />)
        } else if (maxOrderPerSec === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxOrderPerSec" />)
        } else if (maxRecRequest === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxRecRequest" />)
        } else if (whiteListIPLimit === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.whiteListIPLimit" />)
        } else if (concurrentIPAllow === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.concurrentIPAllow" />)
        } else if (maxReqSize === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxReqSize" />)
        } else if (maxResSize === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxResSize" />)
        } else if (historicalData === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.historicalData" />)
        } else {
            const data = {
                SubscribeID: SubscribeID,
                MaxPerDay: maxCallPerDay,
                MaxPerMinute: maxCallPerMin,
                MaxPerMonth: maxCallPerMonth,
                MaxOrderPerSec: maxOrderPerSec,
                MaxRecPerRequest: maxRecRequest,
                WhitelistedEndPoints: whiteListIPLimit,
                ConcurrentEndPoints: concurrentIPAllow,
                MaxReqSize: maxReqSize,
                MaxResSize: maxResSize,
                HistoricalDataMonth: historicalData,
                ReadonlyAPI: readOnlyAPI,
                FullAccessAPI: fullAccessAPI,
            }

            this.setState({
                isSetCustomLimit: 1
            })
            this.props.setCustomLimits(data)

        }
    }

    //used for update custom limits
    UpdateCustoLimits = () => {
        const {
            SubscribeID,
            maxCallPerDay,
            maxCallPerMin,
            maxCallPerMonth,
            maxOrderPerSec,
            maxRecRequest,
            whiteListIPLimit,
            concurrentIPAllow,
            maxReqSize,
            maxResSize,
            historicalData,
            readOnlyAPI,
            fullAccessAPI,
            limitID
        } = this.state

        if (maxCallPerDay === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerDay" />)
        } else if (maxCallPerMin === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerMin" />)
        } else if (maxCallPerMonth === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerMonth" />)
        } else if (maxOrderPerSec === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxOrderPerSec" />)
        } else if (maxRecRequest === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxRecRequest" />)
        } else if (whiteListIPLimit === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.whiteListIPLimit" />)
        } else if (concurrentIPAllow === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.concurrentIPAllow" />)
        } else if (maxReqSize === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxReqSize" />)
        } else if (maxResSize === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxResSize" />)
        } else if (historicalData === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.historicalData" />)
        } else {

            if (this.state.updateRecord) {
                const data = {
                    LimitID: limitID,
                    SubscribeID: SubscribeID,
                    MaxPerDay: maxCallPerDay,
                    MaxPerMinute: maxCallPerMin,
                    MaxPerMonth: maxCallPerMonth,
                    MaxOrderPerSec: maxOrderPerSec,
                    MaxRecPerRequest: maxRecRequest,
                    WhitelistedEndPoints: whiteListIPLimit,
                    ConcurrentEndPoints: concurrentIPAllow,
                    MaxReqSize: maxReqSize,
                    MaxResSize: maxResSize,
                    HistoricalDataMonth: historicalData,
                    ReadonlyAPI: readOnlyAPI ? readOnlyAPI : [],
                    FullAccessAPI: fullAccessAPI ? fullAccessAPI : [],
                }

                this.setState({
                    isUpdateCustomLimit: 1
                })
                this.props.updateCustomLimits(data)
            } else {

                NotificationManager.error(<IntlMessages id="sidebar.customLimits.please.change" />)
            }


        }

    }

    // used fro set state for textbozes
    HandleChangeMaxCall = (event) => {

        const regexNumeric = /^[0-9]+$/;

        if (this.props.IsUpdate) {
            if (event.target.value === "") {

                this.setState({
                    [event.target.name]: event.target.value,
                    updateRecord: true
                })

            }
            else if (validator.matches(event.target.value, regexNumeric)) {
                this.setState({
                    [event.target.name]: event.target.value,
                    updateRecord: true
                })

            }
        } else {
            if (event.target.value === "") {

                this.setState({
                    [event.target.name]: event.target.value
                })
            } else if (validator.matches(event.target.value, regexNumeric)) {

                this.setState({
                    [event.target.name]: event.target.value
                })

            }

        }
    }

    // invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {

        if (this.state.isSetCustomLimit === 1 && nextprops.setCustomLimitData.ReturnCode === 0) {

            this.setState({
                isSetCustomLimit: 0
            })
            NotificationManager.success(<IntlMessages id="sidebar.customLimits.success.add" />)
            this.props.CallCustomLimits();
        } else if (this.state.isSetCustomLimit === 1 && nextprops.setCustomLimitError.ReturnCode === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.setCustomLimitError.ErrorCode}`} />);
            this.setState({
                isSetCustomLimit: 0
            })
        }

        if (this.state.isUpdateCustomLimit === 1 && nextprops.updateCustomLimitData.ReturnCode === 0) {

            this.setState({
                isUpdateCustomLimit: 0
            })
            NotificationManager.success(<IntlMessages id="sidebar.customLimits.success.update" />)
            this.props.CallCustomLimits();
        } else if (this.state.isUpdateCustomLimit === 1 && nextprops.updateCustomLimitError.ReturnCode === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateCustomLimitError.ErrorCode}`} />);
            this.setState({
                isUpdateCustomLimit: 0
            })
        }

    }

    //used for close modal
    handleClose = (event) => {
        event.preventDefault();
        this.setState({
            modal: false,
            openUpgrade: false,
            OpenDownGrade: false
        })
    }

    // set state for readonly methods
    onChangeReadOnlyAPI = (event) => {

        var values = [];
        $("input[name='readonly']:checked").each(function () {
            values.push($(this).val());
        });
        if (this.props.IsUpdate) {


            this.setState({
                readOnlyAPI: values,
                updateRecord: true
            })


        } else {
            this.setState({
                readOnlyAPI: values,
                updateRecord: true
            })

        }


    }

    // set state for full access api
    onChangeFullAccessAPI = (event) => {
        var values = [];
        $("input[name='fullAccess']:checked").each(function () {
            values.push($(this).val());
        });
        if (this.props.IsUpdate) {


            this.setState({
                fullAccessAPI: values,
                updateRecord: true
            })


        } else {
            this.setState({
                fullAccessAPI: values,
                updateRecord: true
            })

        }

    }

    //renders the component
    render() {
        return (
            <Fragment>
                {
                    (this.props.setCustomLimitLoading || this.props.updateCustomLimitLoading)
                    &&
                    <JbsSectionLoader />}

                <Card className="m-5 p-10">
                    <div className="m-0 font-weight-bold text-center" style={{ fontSize: "24px" }}>
                        {<IntlMessages id="sidebar.customLimits.note.title.set" />}
                    </div>
                    <div className="m-0 h-90 row">

                        <Col md={4} sm={6}>
                            <Card className="m-5 p-10">
                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxCallPerDay" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxCallPerDay"
                                            value={this.state.maxCallPerDay}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxCallPermin" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxCallPerMin"
                                            value={this.state.maxCallPerMin}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxCallPermonth" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxCallPerMonth"
                                            value={this.state.maxCallPerMonth}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxOrderPerSecond" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxOrderPerSec"
                                            value={this.state.maxOrderPerSec}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxRecRequest" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxRecRequest"
                                            value={this.state.maxRecRequest}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.whiteListIPLimit" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="whiteListIPLimit"
                                            value={this.state.whiteListIPLimit}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.concurrentIPAllow" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="concurrentIPAllow"
                                            value={this.state.concurrentIPAllow}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxReqSize" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxReqSize"
                                            value={this.state.maxReqSize}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.maxResSize" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="maxResSize"
                                            value={this.state.maxResSize}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="mb-5">
                                    <Label sm={6} for="Total">
                                        {<IntlMessages id="sidebar.customLimits.field.title.historicalData" />}
                                    </Label>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            name="historicalData"
                                            value={this.state.historicalData}
                                            onChange={this.HandleChangeMaxCall}
                                        />
                                    </Col>
                                </FormGroup>
                            </Card>
                        </Col>

                        <Col md={3} sm={6}>
                            <Card className="m-5 p-10">
                                <div className="h-90">
                                    <Row className="Subscrine-plan-font">
                                        <Col md={12} className="text-center font-weight-bold m-10">
                                            {<IntlMessages id="sidebar.apiplan.readonly.methods" />}
                                        </Col>
                                        {
                                            this.props.IsUpdate ? this.state.ReadOnlyAPI && this.state.ReadOnlyAPI.map((value, key) => {
                                                return <Col md={12} className="Subscrine-plan-font d-flex" key={key}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={this.state.readOnlyAPI.indexOf((value.key)) === -1 ? false : true}
                                                                onChange={this.onChangeReadOnlyAPI}
                                                                icon={<CheckBoxOutlineBlankIcon />}
                                                                checkedIcon={<CheckBoxIcon />}
                                                                name="readonly" id="readOnlyAPI"
                                                                value={value.key}
                                                            />
                                                        }
                                                        label={value.value}
                                                    />

                                                </Col>
                                            })
                                                :

                                                this.state.ReadOnlyAPI && this.state.ReadOnlyAPI.map((value, key) => {

                                                    return <Col md={12} className="Subscrine-plan-font d-flex" key={key}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    onChange={this.onChangeReadOnlyAPI}
                                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                                    checkedIcon={<CheckBoxIcon />}
                                                                    name="readonly" id="readOnlyAPI"
                                                                    value={value.key}
                                                                />
                                                            }
                                                            label={value.value}
                                                        />
                                                    </Col>
                                                })

                                        }

                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Col md={12} className="text-center font-weight-bold m-10">
                                            {<IntlMessages id="sidebar.apiplan.fullaccess.methods" />}
                                        </Col>

                                        {
                                            this.props.IsUpdate ? this.state.FullAccessAPI && this.state.FullAccessAPI.map((value, key) => {
                                                return <Col md={12} className="Subscrine-plan-font d-flex" key={key}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={this.state.fullAccessAPI.indexOf((value.key)) === -1 ? false : true}
                                                                onChange={this.onChangeFullAccessAPI}
                                                                icon={<CheckBoxOutlineBlankIcon />}
                                                                checkedIcon={<CheckBoxIcon />}
                                                                name="fullAccess" id="fullaccessAPI"
                                                                value={value.key}
                                                            />
                                                        }
                                                        label={value.value}
                                                    />

                                                </Col>
                                            })
                                                :
                                                this.state.FullAccessAPI && this.state.FullAccessAPI.map((value, key) => {
                                                    return <Col md={12} className="Subscrine-plan-font d-flex" key={key}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    onChange={this.onChangeFullAccessAPI}
                                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                                    checkedIcon={<CheckBoxIcon />}
                                                                    name="fullAccess" id="fullaccessAPI"
                                                                    value={value.key}
                                                                />
                                                            }
                                                            label={value.value}
                                                        />
                                                    </Col>
                                                })
                                        }

                                    </Row>
                                </div>

                                <div className="m-0">

                                    <Button
                                        variant="raised"
                                        onClick={(event) => this.props.CloseEditField(event)}
                                        className="btn-danger text-white m-5 pull-right"
                                    >
                                        <span>
                                            <IntlMessages id="button.cancel" />
                                        </span>
                                    </Button>

                                    {this.props.IsUpdate ?
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className="text-white m-5 pull-right"
                                            onClick={() => this.UpdateCustoLimits()}
                                        >
                                            <span>
                                                <IntlMessages id="sidebar.apikey.title.btnupdate" />
                                            </span>
                                        </Button>
                                        :


                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className="text-white m-5 pull-right"
                                            onClick={() => this.SetCustomLimits()}
                                        >
                                            <span>
                                                <IntlMessages id="sidebar.customLimits.note.title.set" />
                                            </span>
                                        </Button>
                                    }
                                </div>

                            </Card>
                        </Col>

                    </div>
                </Card>


            </Fragment>
        )
    }
}


// map states to props when changed in states from reducer
const mapStateToProps = ({ customLimits }) => {
    const {
        setCustomLimitData,
        setCustomLimitLoading,
        setCustomLimitError,
        updateCustomLimitData,
        updateCustomLimitLoading,
        updateCustomLimitError,
    } = customLimits;
    return {
        setCustomLimitData,
        setCustomLimitLoading,
        setCustomLimitError,
        updateCustomLimitData,
        updateCustomLimitLoading,
        updateCustomLimitError,
    }
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        setCustomLimits,
        updateCustomLimits
    })(SetCustomLimits);