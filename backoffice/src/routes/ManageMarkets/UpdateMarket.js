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
    Button
} from "reactstrap";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import Tooltip from "@material-ui/core/Tooltip";

//Action Import for Payment Method  Report Add And Update
import {
    updateMarketList,

} from "Actions/ManageMarkets";

import {getLedgerCurrencyList} from "Actions/TradingReport";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";


class UpdateMarketData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateData: false,
            selectedCurrency: this.props.selectedData.CurrencyName,
            currencyList: [],
            selectedStatus: this.props.selectedData.Status == "Active" ? 1 : 0,
            serviceId: this.props.selectedData.ServiceID,
            Id: 0,
            isChangeStatus: false,
            isChangeCurrency: false
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            updateData: false,
            selectedCurrency: "",
            selectedStatus: "",
            serviceId: 0,
            Id: 0,
            isChangeStatus: false,
            isChangeCurrency: false
        });
    };

    componentWillReceiveProps(nextprops) {

        if (nextprops.selectedData) {
            this.setState({
                selectedCurrency: nextprops.selectedData.CurrencyName,
                selectedStatus: nextprops.selectedData.Status == "Active" ? 1 : 0,
                serviceId: nextprops.selectedData.ServiceID,
                Id: nextprops.selectedData.ID,
            })
        }
        if (nextprops.updateMarketList && nextprops.updateError.length == 0 && this.state.updateData) {
            //NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addMarketList.ErrorCode}`} />);
            NotificationManager.success(<IntlMessages id="market.update.currency.success"/>);
            this.setState({
                updateData: false,
                open: false,
                isChangeStatus: false,
                isChangeCurrency: false
            })
            this.props.closeAll();
            this.props.getMarketList({})
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
            NotificationManager.error(<IntlMessages
                id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`}/>);
            this.setState({
                updateData: false,
                open: false,
                isChangeStatus: false,
                isChangeCurrency: false
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
                this.setState({
                    selectedCurrency: event.target.value,
                    serviceId: value.ServiceId,
                    isChangeCurrency: true
                });
            }
        })
    };

    handleChangeStatus = event => {
        this.setState({selectedStatus: event.target.value, isChangeStatus: true});
    };

    updateCurrencyData = () => {

        const {selectedCurrency, selectedStatus, serviceId, Id} = this.state;

        const data = {
            CurrencyName: selectedCurrency,
            Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0),
            ServiceID: serviceId,
            ID: Id
        };

        if (selectedCurrency === "") {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency"/>);
        } else if (selectedStatus === "") {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status"/>);
        } else {

            if (this.state.isChangeCurrency || this.state.isChangeStatus) {
                this.setState({
                    updateData: true
                })
                this.props.updateMarketList(data);
            }

        }
    };

    render() {

        const {drawerClose} = this.props;
        return (
            <React.Fragment>
                {this.props.loading && <JbsSectionLoader/>}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>{<IntlMessages id="manageMarkets.title.update"/>}</h2>
                    </div>
                    <div className="page-title-wrap">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall}
                                     variant="fab" mini onClick={drawerClose}><i
                            className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                     mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                {/* <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="manageMarkets.title.update" />}
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
                            <hr/>
                            <FormGroup row>
                                <Label sm={2}></Label>
                                <Col sm={4}>
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        className="text-white"
                                        onClick={() => this.updateCurrencyData()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="manageMarkets.list.button.update"/>
                                    </Button>
                                </Col>
                                <Col sm={4}>
                                    <Button
                                        variant="raised"
                                        color="danger"
                                        className="text-white"
                                        onClick={() => this.handleClose()}
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
    loading: state.manageMarkets.updateLoading,
    updateError: state.manageMarkets.updateError,
    pairList: state.tradingledger.currencyList,
    addMarketList: state.manageMarkets.addMarketList,

});

export default connect(
    mapStateToProps,
    {
        updateMarketList,
        getLedgerCurrencyList
    }
)(UpdateMarketData);
