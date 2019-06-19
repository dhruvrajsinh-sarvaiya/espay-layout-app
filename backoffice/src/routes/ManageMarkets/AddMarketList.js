import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import {NotificationManager} from "react-notifications";
import MatButton from "@material-ui/core/Button";

import CloseButton from '@material-ui/core/Button';

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

import {
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
    Row,
    Button // added By Jinesh bhatt for cancel button and submit button
} from "reactstrap";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import Tooltip from "@material-ui/core/Tooltip";

//Action Import for Payment Method  Report Add And Update
import {
    getMarketList,
    addMarketList,

} from "Actions/ManageMarkets";

import {getLedgerCurrencyList} from "Actions/TradingReport";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";


class AddMarketData extends Component {
    constructor() {
        super();
        this.state = {
            addNewData: false,
            selectedCurrency: "",
            currencyList: [],
            selectedStatus: "",
            serviceId: 0,
            Id: 0,
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    //   handleClose = () => {
    //     this.setState({
    //       open: false,
    //       confirm: false
    //     });
    //   };

    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addNewData: false,
            selectedCurrency: "",
            selectedStatus: "",
            serviceId: 0,
            Id: 0,
        });
    };

    componentWillReceiveProps(nextprops) {

        if (nextprops.addMarketList && nextprops.addError.length == 0 && this.state.addNewData) {
            //NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addMarketList.ErrorCode}`} />);
            NotificationManager.success(<IntlMessages id="market.add.currency.success"/>);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.closeAll();
            this.props.getMarketList({});
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`}/>);
            this.setState({
                addNewData: false
            })
            //this.props.getMarketList({})
        }

        if (nextprops.pairList) {
            this.setState({
                currencyList: nextprops.pairList
            });
        }

    }

    componentDidMount() {
        this.props.getLedgerCurrencyList({});
    }

    handleChangeCurrency = event => {

        this.state.currencyList.map((value, key) => {
            if (value.SMSCode === event.target.value) {
                this.setState({selectedCurrency: event.target.value, serviceId: value.ServiceId});
            }
        })
    };

    handleChangeStatus = event => {
        this.setState({selectedStatus: event.target.value});
    };

    addCurrencyData = () => {

        const {selectedCurrency, selectedStatus, serviceId} = this.state;

        const data = {
            CurrencyName: selectedCurrency,
            Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0),
            ServiceID: serviceId
        };

        if (selectedCurrency === "") {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency"/>);
        } else if (selectedStatus === "") {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status"/>);
        }
        else {
            this.setState({
                addNewData: true
            })
            this.props.addMarketList(data);
        }
    };
    // added By jinesh bhatt for cancel button event handle 04-02-2019
    resetData = () => {

        this.props.drawerClose();

        this.setState({
            addNewData: false,
            selectedCurrency: "",
            currencyList: [],
            selectedStatus: "",
            serviceId: 0,
            Id: 0,
        });
    };

    render() {
        const {drawerClose} = this.props;
        return (
            <React.Fragment>
                {this.props.loading && <JbsSectionLoader/>}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="manageMarkets.title.add"/></h2>
                    </div>
                    <div className="page-title-wrap">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall}
                                     variant="fab" mini onClick={() => this.resetData()}><i
                            className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                     mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>


                {/* <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="manageMarkets.title.add" />}
            </h1>
          </div> */}

                <Row className="m-15 p-10">
                    <Col md={12}>
                        <Form className="m-10 tradefrm">
                            <FormGroup row>
                                <Label sm={4} for="curency">
                                    {<IntlMessages id="manageMarkets.list.form.label.currency"/>}
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="currency"
                                        value={this.state.selectedCurrency}
                                        onChange={(e) => this.handleChangeCurrency(e)}
                                    >
                                        <IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency">
                                            {(select) =>
                                                <option value="">{select}</option>
                                            }
                                        </IntlMessages>

                                        {this.state.currencyList.length && this.state.currencyList.map((item, key) => (
                                            <option
                                                value={item.SMSCode}
                                                key={key}
                                            >
                                                {item.SMSCode}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label sm={4} for="status">
                                    <IntlMessages id="manageMarkets.list.form.label.status"/>
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        type="select"
                                        name="status"
                                        value={this.state.selectedStatus}
                                        onChange={(e) => this.handleChangeStatus(e)}
                                    >
                                        <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                                            {(select) =>
                                                <option value="">{select}</option>
                                            }
                                        </IntlMessages>

                                        <IntlMessages id="manageMarkets.list.column.label.status.active">
                                            {(select) =>
                                                <option value="1">{select}</option>
                                            }
                                        </IntlMessages>

                                        <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                                            {(select) =>
                                                <option value="0">{select}</option>
                                            }
                                        </IntlMessages>
                                    </Input>
                                </Col>
                            </FormGroup>
                            {/* // added by jinesh bhatt for cancel button and change button alignment into cetner*/}
                            <hr/>
                            <FormGroup row>
                                <Label sm={2}></Label>
                                <Col sm={4}>
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        className="text-white"
                                        onClick={() => this.addCurrencyData()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="manageMarkets.list.button.save"/>
                                    </Button>
                                </Col>
                                <Col sm={4}>
                                    <Button
                                        variant="raised"
                                        color="danger"
                                        className="text-white"
                                        onClick={() => this.resetData()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="sidebar.pairConfiguration.button.cancel"/>
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    loading: state.manageMarkets.addLoading,
    addError: state.manageMarkets.addError,
    pairList: state.tradingledger.currencyList,
    addMarketList: state.manageMarkets.addMarketList,

});

export default connect(
    mapStateToProps,
    {
        addMarketList,
        getLedgerCurrencyList
    }
)(AddMarketData);
