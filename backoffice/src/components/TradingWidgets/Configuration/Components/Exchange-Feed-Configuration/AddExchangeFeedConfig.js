// component for add Exchange feed configuration By Tejas 15/2/2019

import React, { Component } from 'react';

// Used for connect to store
import { connect } from "react-redux";

// used for set design
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from "reactstrap";

// used for close buttons
import CloseButton from '@material-ui/core/Button';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
    addExchangeConfigurationList,
    getExchangeFeedConfigSocket,
    getExchangeFeedConfigLimits,
    getExchangeFeedConfigList
} from "Actions/ExchangeFeedConfig";

// import section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

//  Class for Add Exchange feed configuration 
class AddExchangeFeedConfig extends Component {
    // constructor 
    constructor(props) {
        super(props);
        //defines default state
        this.state = {
            addNewData: false,
            selectedFeedLimitId: "",
            selectedMethodId: "",
            socketMethods: [],
            limitMethods: [],
            selectedStatus: "",
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7'); // get Trading menu permission
        // code added by parth andhariya for handle and check menu detail and store (18-4-2019)
        // var fieldList = {};
        // if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
        // this.props.menuDetail.Fields.forEach(function (item) {
        // fieldList[item.GUID] = item;
        // });
        // this.setState({
        // fieldList: fieldList
        // });
        // }
        // code end
    }
    // Close drawer 
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // Close drawer 
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };

    // set value from dropdown box for feed limit
    handleChangeFeedLimit = (e) => {
        this.state.limitMethods.map((value, key) => {
            if (value.ID == e.target.value) {
                this.setState({ selectedFeedLimitId: e.target.value });
            }
        })
    }

    // set value from dropdown box for Socket methods
    handleChangeSocketMethod = (e) => {
        this.state.socketMethods.map((value, key) => {
            if (value.ID == e.target.value) {
                this.setState({ selectedMethodId: e.target.value });
            }
        })
    }

    // set value for status
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value });
    };

    // invoke when component get props
    componentWillReceiveProps(nextprops) {
        // set state for socketmethods
        if (nextprops.socketMethods && nextprops.socketMethods.length > 0) {
            this.setState({
                socketMethods: nextprops.socketMethods
            })
        }
        // set state for limit data
        if (nextprops.limitMethods && nextprops.limitMethods.length > 0) {
            this.setState({
                limitMethods: nextprops.limitMethods
            })
        }
        // when call for Add, display notification whether success or failure
        if (nextprops.addexchangeFeedList && nextprops.addError.length == 0 && this.state.addNewData) {

            NotificationManager.success(<IntlMessages id="exchangefeedLimit.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();
            this.props.getExchangeFeedConfigList({});
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getExchangeFeedConfigSocket({})
                this.props.getExchangeFeedConfigLimits({})
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // Request for Add data
    addExchangeFeedData = () => {
        const {
            selectedFeedLimitId, selectedMethodId,
            selectedStatus
        } = this.state;
        const data = {
            MethodID: selectedMethodId,
            FeedLimitID: selectedFeedLimitId,
            Status: selectedStatus
        };
        if (selectedFeedLimitId === "" || selectedFeedLimitId == null) {
            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.enter.feedID" />);
        } else if (selectedMethodId === "" || selectedMethodId == null) {
            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.enter.methodId" />);
        }
        else {
            this.setState({
                addNewData: true
            })
            this.props.addExchangeConfigurationList(data);
        }
    };

    // invoke after render 
    // componentDidMount() {
    //     this.props.getExchangeFeedConfigSocket({})
    //     this.props.getExchangeFeedConfigLimits({})
    // }

    // reset  component data
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
            selectedFeedLimitId: "",
            selectedMethodId: "",
            socketMethods: [],
            limitMethods: [],
            selectedStatus: "",
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
    // render component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('C7CCD6F4-1B82-498B-4B94-465B881D6AB1');//C7CCD6F4-1B82-498B-4B94-465B881D6AB1
        // returns the component
        return (
            <div className="m-10 p-5">
                {(
                    this.props.loading
                    || this.props.socketMethodLoading
                    || this.props.limitMethodLoading
                    || this.props.addLoading
                    || this.props.menuLoading
                )
                    && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="exchangefeed.title.select.add" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                        <Form className="m-10 tradefrm">
                            {((menuDetail["BAF9D20F-8599-3520-A681-EEAAFCBA64C2"]) && (menuDetail["BAF9D20F-8599-3520-A681-EEAAFCBA64C2"].Visibility === "E925F86B")) && //BAF9D20F-8599-3520-A681-EEAAFCBA64C2
                                <FormGroup row>
                                    <Label sm={4} for="curency" className='d-inline'>
                                        {<IntlMessages id="exchangefeed.title.methodid" />}<span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            disabled={(menuDetail["BAF9D20F-8599-3520-A681-EEAAFCBA64C2"].AccessRight === "11E6E7B0") ? true : false}
                                            type="select"
                                            name="methodId"
                                            value={this.state.selectedMethodId}
                                            onChange={(e) => this.handleChangeSocketMethod(e)}
                                        >
                                            <IntlMessages id="exchangefeed.title.select.methodid">
                                                {(select) =>
                                                    <option value="">{select}</option>
                                                }
                                            </IntlMessages>
                                            {this.state.socketMethods.length && this.state.socketMethods.map((item, key) => (
                                                <option
                                                    value={item.ID}
                                                    key={key}
                                                >
                                                    {item.MethodName}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </FormGroup>
                            }
                            {((menuDetail["9AC16A5D-7F70-056A-670E-C14243219C83"]) && (menuDetail["9AC16A5D-7F70-056A-670E-C14243219C83"].Visibility === "E925F86B")) && //9AC16A5D-7F70-056A-670E-C14243219C83
                                <FormGroup row>
                                    <Label sm={4} for="curency" className='d-inline'>
                                        {<IntlMessages id="exchangefeed.title.feedLimitid" />}<span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            disabled={(menuDetail["9AC16A5D-7F70-056A-670E-C14243219C83"].AccessRight === "11E6E7B0") ? true : false}
                                            type="select"
                                            name="methodId"
                                            value={this.state.selectedFeedLimitId}
                                            onChange={(e) => this.handleChangeFeedLimit(e)}
                                        >
                                            <IntlMessages id="exchangefeed.title.select.feedLimitid">
                                                {(select) =>
                                                    <option value="">{select}</option>
                                                }
                                            </IntlMessages>
                                            {this.state.limitMethods.length && this.state.limitMethods.map((item, key) => (
                                                <option
                                                    value={item.ID}
                                                    key={key}
                                                >
                                                    {item.LimitDesc ? item.LimitDesc : "-"}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </FormGroup>
                            }
                            {((menuDetail["00CCA315-A6F1-3412-111E-7D4F5FDA3923"]) && (menuDetail["00CCA315-A6F1-3412-111E-7D4F5FDA3923"].Visibility === "E925F86B")) && //00CCA315-A6F1-3412-111E-7D4F5FDA3923
                                <FormGroup row>
                                    <Label sm={4} for="status" className='d-inline'>
                                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            disabled={(menuDetail["00CCA315-A6F1-3412-111E-7D4F5FDA3923"].AccessRight === "11E6E7B0") ? true : false}
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
                            <hr />
                            {menuDetail &&
                                <FormGroup row>
                                <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className="text-white"
                                            onClick={() => this.addExchangeFeedData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="button.add" />
                                        </Button>

                                        <Button
                                            variant="raised"
                                            color="danger"
                                            className="text-white ml-15"
                                            onClick={() => this.resetData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                                        </Button>
                                    </div>
                                    </div>
                                </FormGroup>
                            }
                        </Form>
            </div>
        )
    }
}

// map state to props for store data
const mapStateToProps = state => ({
    socketMethods: state.exchangeFeed.socketMethods,
    limitMethods: state.exchangeFeed.limitMethods,
    socketMethodLoading: state.exchangeFeed.socketMethodLoading,
    limitMethodLoading: state.exchangeFeed.limitMethodLoading,
    addexchangeFeedList: state.exchangeFeed.addexchangeFeedList,
    addLoading: state.exchangeFeed.addLoading,
    addError: state.exchangeFeed.addError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

//connet component to store
export default connect(
    mapStateToProps,
    {
        addExchangeConfigurationList,
        getExchangeFeedConfigSocket,
        getExchangeFeedConfigLimits,
        getExchangeFeedConfigList,
        getMenuPermissionByID
    }
)(AddExchangeFeedConfig);