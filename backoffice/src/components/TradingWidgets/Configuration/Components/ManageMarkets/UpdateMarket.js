//component for update amrket list BY Tejas

// import necessary component
import React, { Component } from "react";

// used for connect
import { connect } from "react-redux";

// display sucess or failure
import { NotificationManager } from "react-notifications";

// impor tbutton for close and sert style
import CloseButton from '@material-ui/core/Button';

// used for design
import { Form, FormGroup, Label, Input, Col, Row, Button } from "reactstrap";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
    updateMarketList,
} from "Actions/ManageMarkets";

// action for get currency list
import { getLedgerCurrencyList } from "Actions/TradingReport";

// used for display section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}
// component for update market data
class UpdateMarketData extends Component {

    // constructor and defines default state
    constructor(props) {
        super(props);
        this.state = {
            updateData: false,
            selectedCurrency: this.props.selectedData.CurrencyName,
            currencyList: [],
            selectedStatus: this.props.selectedData.Status === "Active" ? 1 : 0,
            serviceId: this.props.selectedData.ServiceID,
            Id: 0,
            isChangeStatus: false,
            isChangeCurrency: false,
            //adde by parth andhariya
            ConfigurationShowCard: props.ConfigurationShowCard
        };
    }

    // used for close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // used for close drawer
    handleClose = () => {
        this.props.drawerClose();
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

    // invoke  when component is about to get props
    componentWillReceiveProps(nextprops) {

        // set stat for selected data for update
        if (nextprops.selectedData) {
            this.setState({
                selectedCurrency: nextprops.selectedData.CurrencyName,
                selectedStatus: nextprops.selectedData.Status === "Active" ? 1 : 0,
                serviceId: nextprops.selectedData.ServiceID,
                Id: nextprops.selectedData.ID,
            })
        }

        // display success or error message when clla api for update
        if (nextprops.updateMarketList && nextprops.updateError.length === 0 && this.state.updateData) {
            NotificationManager.success(<IntlMessages id="market.update.currency.success" />);
            this.setState({
                updateData: false,
                open: false,
                isChangeStatus: false,
                isChangeCurrency: false
            })
            this.props.drawerClose();
            //adde by parth andhariya
            if (this.state.ConfigurationShowCard === 1) {
                this.props.getMarketList({ IsMargin: 1 });
            } else {
                this.props.getMarketList({});
            }
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
            NotificationManager.error(<IntlMessages
                id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateData: false,
                open: false,
                isChangeStatus: false,
                isChangeCurrency: false
            })
        }
        // set state for pair list
        if (nextprops.pairList) {
            this.setState({
                currencyList: nextprops.pairList
            });
        }
    }

    // call api for get ledger list
    componentDidMount() {
        //adde by parth andhariya
        if (this.state.ConfigurationShowCard === 1) {
            this.props.getLedgerCurrencyList({ IsMargin: 1 });
        } else {
            this.props.getLedgerCurrencyList({});
        }
    }

    // set currency name on change of dropdown
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

    // set state for status on change of dropdown 
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value, isChangeStatus: true });
    };

    //  create request and call api for update record
    updateCurrencyData = () => {

        const { selectedCurrency, selectedStatus, serviceId, Id } = this.state;

        const data = {
            CurrencyName: selectedCurrency,
            Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0),
            ServiceID: serviceId,
            ID: Id
        };

        if (selectedCurrency === "") {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency" />);
        } else if (selectedStatus === "") {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
        } else {

            if (this.state.isChangeCurrency || this.state.isChangeStatus) {
                this.setState({
                    updateData: true
                })
                //adde by parth andhariya
                if (this.state.ConfigurationShowCard === 1) {
                    data.IsMargin = 1;
                    this.props.updateMarketList(data);
                } else {
                    this.props.updateMarketList(data);
                }
            } else {
                NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
            }

        }
    };

    // render the component
    render() {

        const { drawerClose } = this.props;
        return (
            <React.Fragment>
                {(this.state.loadingCurrency || this.props.loading) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>{<IntlMessages id="manageMarkets.title.update" />}</h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall}
                            variant="fab" mini onClick={drawerClose}><i
                                className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                            mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <div className="m-15 p-10">
                        <Form className="tradefrm">
                            <FormGroup row>
                                <Label sm={4} md={4} xs={12} for="curency">
                                    {<IntlMessages id="manageMarkets.list.form.label.currency" />}
                                </Label>
                                {/* dropdown is disabled by parth andhariya */}
                                <Col sm={8} md={8} xs={12}>
                                    <Input
                                        type="select"
                                        name="currency"
                                        value={this.state.selectedCurrency}
                                        onChange={(e) => this.handleChangeCurrency(e)}
                                        disabled
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
                                <Label sm={4} md={4} xs={12} for="status">
                                    <IntlMessages id="manageMarkets.list.form.label.status" />
                                </Label>
                                <Col sm={8} md={8} xs={12}>
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
                            {/* <hr /> */}
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                    <div className="btn_area">
                                    <Button color="primary" onClick={() => this.updateCurrencyData()} disabled={this.props.loading}><IntlMessages id="manageMarkets.list.button.update" /></Button>
                                    <Button  color="danger" className="ml-15" onClick={() => this.handleClose()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.cancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
            </React.Fragment>
        )
    }

}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    loading: state.manageMarkets.updateLoading,
    updateError: state.manageMarkets.updateError,
    pairList: state.tradingledger.currencyList,
    loadingCurrency: state.tradingledger.loadingCurrency,
    addMarketList: state.manageMarkets.addMarketList,

});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        updateMarketList,
        getLedgerCurrencyList
    }
)(UpdateMarketData);
