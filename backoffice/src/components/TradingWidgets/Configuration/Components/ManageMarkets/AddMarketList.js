// component for add market list data

// import necessary component
import React, { Component, Fragment } from "react";

// used for connect component
import { connect } from "react-redux";

// used for display notification
import { NotificationManager } from "react-notifications";

// import button and set style
import CloseButton from '@material-ui/core/Button';

// used for design
import {
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

//Action Import for Payment Method  Report Add And Update
import { addMarketList } from "Actions/ManageMarkets";

// used for import currency list
import { getLedgerCurrencyList } from "Actions/TradingReport";

// used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}
// import buttton
import MatButton from "@material-ui/core/Button";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// class for add market data
class AddMarketData extends Component {
    constructor(props) {
        super(props);

        // defines default state
        this.state = {
            addNewData: false,
            selectedCurrency: "",
            currencyList: [],
            selectedStatus: "",
            serviceId: 0,
            Id: 0,
            //adde by parth andhariya
            ConfigurationShowCard: props.ConfigurationShowCard,
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }

    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // close drawer
    handleClose = () => {
        this.props.drawerClose();
        this.setState({
            open: false,
            addNewData: false,
            selectedCurrency: "",
            selectedStatus: "",
            serviceId: 0,
            Id: 0,
        });
    };
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? 'B1810547-2C10-4C1D-6CA5-263BAF8E2B07' : '8B793242-783C-9C1E-2FD2-7CF8EC0E0142'); // get Trading menu permission
    }
    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {

        // display success or failure when get resposne for add market list
        if (nextprops.addMarketList && nextprops.addError.length === 0 && this.state.addNewData) {

            NotificationManager.success(<IntlMessages id="market.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();
             //code change by jayshreeba gohil (13-6-2019) for handle arbitrage configuration detail
             var reqObject = {};
             if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                 reqObject.IsArbitrage = this.props.IsArbitrage;
             }
             this.props.getMarketList(reqObject);
             //end
 
            //adde by parth andhariya
            if (this.state.ConfigurationShowCard === 1) {
                this.props.getMarketList({ IsMargin: 1 });
            } else {
                this.props.getMarketList({});
            }
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })
        }

        // set state for pair list
        if (nextprops.pairList) {
            this.setState({
                currencyList: nextprops.pairList
            });
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                //adde by parth andhariya
                if (this.state.ConfigurationShowCard === 1) {
                    this.props.getLedgerCurrencyList({ IsMargin: 1 });
                } else {
                    this.props.getLedgerCurrencyList({});
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // call api for get currency list
    // componentDidMount() {
    //     //adde by parth andhariya
    //     if (this.state.ConfigurationShowCard === 1) {
    //         this.props.getLedgerCurrencyList({ IsMargin: 1 });
    //     } else {
    //         this.props.getLedgerCurrencyList({});
    //     }
    //     // code added by parth andhariya for handle and check menu detail and store (18-4-2019)
    //     var fieldList = {};
    //     if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
    //         this.props.menuDetail.Fields.forEach(function (item) {
    //             fieldList[item.GUID] = item;
    //         });
    //         this.setState({
    //             fieldList: fieldList
    //         });
    //     }
    //     // code end
    // }

    // on change of currency list drop down set state
    handleChangeCurrency = event => {
        this.state.currencyList.map((value, key) => {
            if (value.SMSCode === event.target.value) {
                this.setState({ selectedCurrency: event.target.value, serviceId: value.ServiceId });
            }
        })
    };

    // set staus on change of drop down
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value });
    };

    // create request and call api for add currency data
    addCurrencyData = () => {
        const { selectedCurrency, selectedStatus, serviceId } = this.state;
        const data = {
            CurrencyName: selectedCurrency,
            Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0),
            ServiceID: serviceId
        };

        if (selectedCurrency === "") {
            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency" />);
        } else if (selectedStatus === "") {
            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
        }
        else {
            this.setState({
                addNewData: true
            })
              //code change by jayshreeba gohil (13-6-2019) for handle arbitrage configuration detail
              var reqObject = data;
              if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                  reqObject.IsArbitrage = this.props.IsArbitrage;
              }
              this.props.addMarketList(reqObject);
              //end

            //adde by parth andhariya
            if (this.state.ConfigurationShowCard === 1) {
                data.IsMargin = 1;
                this.props.addMarketList(data);
            } else {
                this.props.addMarketList(data);
            }
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
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID.toUpperCase()] = item;
                        });
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    // render the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '57EAAA01-9E86-4D9F-72AB-8276721807DB' : '599E46F4-134F-6A4E-7EB0-9602D27FA72B');// 599E46F4-134F-6A4E-7EB0-9602D27FA72B  && margin_GUID 57EAAA01-9E86-4D9F-72AB-8276721807DB
        const { ConfigurationShowCard } = this.state;
        return (
            <React.Fragment>
                {(this.state.loadingCurrency || this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="manageMarkets.title.add" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall}
                            variant="fab" mini onClick={() => this.resetData()}><i
                                className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                            mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <div className="m-15 p-10">
                    <Form className="tradefrm">
                            {((ConfigurationShowCard === 1 ? menuDetail["CF702123-7570-4DFD-08CB-8EE63A12A43D"] : menuDetail["27D380C0-5233-33D6-32E6-9E3B394B7679"]) && (ConfigurationShowCard === 1 ? menuDetail["CF702123-7570-4DFD-08CB-8EE63A12A43D"].Visibility === "E925F86B" : menuDetail["27D380C0-5233-33D6-32E6-9E3B394B7679"].Visibility === "E925F86B")) && //27D380C0-5233-33D6-32E6-9E3B394B7679  && margin_GUID CF702123-7570-4DFD-08CB-8EE63A12A43D
                                <FormGroup row>
                                    <Label sm={4} md={4} xs={12} for="curency" className='d-inline'>
                                        {<IntlMessages id="manageMarkets.list.form.label.currency" />}<span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8} md={8} xs={12}>
                                        <Input
                                            disabled={(ConfigurationShowCard === 1 ? menuDetail["CF702123-7570-4DFD-08CB-8EE63A12A43D"].AccessRight === "11E6E7B0" : menuDetail["27D380C0-5233-33D6-32E6-9E3B394B7679"].AccessRight === "11E6E7B0") ? true : false}
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
                            }

                            {((ConfigurationShowCard === 1 ? menuDetail["5B632506-0902-702B-02CF-79249FA440DD"] : menuDetail["3923EE7C-1968-62E2-75E5-B1CF57070B59"]) && (ConfigurationShowCard === 1 ? menuDetail["5B632506-0902-702B-02CF-79249FA440DD"].Visibility === "E925F86B" : menuDetail["3923EE7C-1968-62E2-75E5-B1CF57070B59"].Visibility === "E925F86B")) && //3923EE7C-1968-62E2-75E5-B1CF57070B59  && margin_GUID 5B632506-0902-702B-02CF-79249FA440DD
                                <FormGroup row>
                                    <Label sm={4} md={4} xs={12} for="status" className='d-inline'>
                                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8} md={8} xs={12}>
                                        <Input
                                            disabled={(ConfigurationShowCard === 1 ? menuDetail["5B632506-0902-702B-02CF-79249FA440DD"].AccessRight === "11E6E7B0" : menuDetail["3923EE7C-1968-62E2-75E5-B1CF57070B59"].AccessRight === "11E6E7B0") ? true : false}
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
                            }
                            {/* // added by jinesh bhatt for cancel button and change button alignment into cetner*/}
                            {/* <hr /> */}
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                        <div className="btn_area">
                                            <Button color="primary" onClick={() => this.addCurrencyData()} disabled={this.props.loading}><IntlMessages id="manageMarkets.list.button.save" /></Button>
                                            <Button color="danger" className="ml-15" onClick={() => this.resetData()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.cancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                        </Form>
                    </div>
            </React.Fragment>
        )
    }

}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    loading: state.manageMarkets.addLoading,
    addError: state.manageMarkets.addError,
    pairList: state.tradingledger.currencyList,
    loadingCurrency: state.tradingledger.loadingCurrency,
    addMarketList: state.manageMarkets.addMarketList,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        addMarketList,
        getLedgerCurrencyList,
        getMenuPermissionByID
    }
)(AddMarketData);
