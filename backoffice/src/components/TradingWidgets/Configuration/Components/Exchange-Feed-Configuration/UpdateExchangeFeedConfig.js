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
    updateExchangeConfigurationList,
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

//  Class for Update Exchange feed configuration 
class UpdateExchangeFeedConfig extends Component {
    // constructor 
    constructor(props) {
        super(props);
        // define default state
        this.state = {
            updateNewData: false,
            selectedFeedLimitId: this.props.selectedData.LimitID ? this.props.selectedData.LimitID : "",
            selectedMethodId: this.props.selectedData.MethodID ? this.props.selectedData.MethodID : "",
            socketMethods: [],
            limitMethods: [],
            selectedStatus: this.props.selectedData.Status ? this.props.selectedData.Status : "",
            Id: this.props.selectedData.Id ? this.props.selectedData.Id : 0,
            isUpdate: false,
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
            isUpdate: false
        });
    }

    // Close drawer 
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            isUpdate: false
        });
    };

    // set value from dropdown box for feed limit
    handleChangeFeedLimit = (e) => {
        this.state.limitMethods.map((value, key) => {
            if (value.ID == e.target.value) {
                this.setState({ selectedFeedLimitId: e.target.value, isUpdate: true });
            }
        })
    }

    // set value from dropdown box for Socket methods
    handleChangeSocketMethod = (e) => {
        this.state.socketMethods.map((value, key) => {
            if (value.ID == e.target.value) {
                this.setState({ selectedMethodId: e.target.value, isUpdate: true });
            }
        })
    }

    // set value for status
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value, isUpdate: true });
    };

    // invoke when component get props
    componentWillReceiveProps(nextprops) {
        // set data for update
        if (nextprops.selectedData) {
            this.setState({
                selectedMethodId: nextprops.selectedData.MethodID,
                selectedFeedLimitId: nextprops.selectedData.LimitID,
                selectedStatus: nextprops.selectedData.Status,
                Id: nextprops.selectedData.Id
            })
        }

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

        // when call for update display notification whether success or failure
        if (nextprops.updateexchangeFeedList && nextprops.updateError.length == 0 && this.state.updateNewData) {
            NotificationManager.success(<IntlMessages id="exchangefeedLimit.update.currency.success" />);
            this.setState({
                updateNewData: false,
                open: false,
                isUpdate: false
            })
            this.props.drawerClose();
            this.props.getExchangeFeedConfigList({});
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateNewData: false,
                isUpdate: false
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

    // Request for Update data
    updateExchangeFeedData = () => {

        if (this.state.isUpdate) {
            const {
                selectedFeedLimitId, selectedMethodId,
                selectedStatus, Id
            } = this.state;

            const data = {
                MethodID: selectedMethodId,
                FeedLimitID: selectedFeedLimitId,
                Status: selectedStatus,
                ID: Id
            };

            if (selectedFeedLimitId === "" || selectedFeedLimitId == null) {
                NotificationManager.error(<IntlMessages id="exchangefeed.title.select.enter.feedID" />);
            } else if (selectedMethodId === "" || selectedMethodId == null) {
                NotificationManager.error(<IntlMessages id="exchangefeed.title.select.enter.methodId" />);
            }
            else {
                this.setState({
                    updateNewData: true
                })
                this.props.updateExchangeConfigurationList(data);
            }
        } else {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
        }
    };

    // // invoke after render 
    // componentDidMount() {
    //     this.props.getExchangeFeedConfigSocket({})
    //     this.props.getExchangeFeedConfigLimits({})
    // }


    // reset  component data
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            updateNewData: false,
            selectedFeedLimitId: "",
            selectedMethodId: "",
            socketMethods: [],
            limitMethods: [],
            selectedStatus: "",
            isUpdate: false
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
        var menuDetail = this.checkAndGetMenuAccessDetail('71C3325A-4CEA-29EB-8554-1313691172F7');//71C3325A-4CEA-29EB-8554-1313691172F7
        return (
            <div className="m-10 p-5">
                {(
                    this.props.loading
                    || this.props.socketMethodLoading
                    || this.props.limitMethodLoading
                    || this.props.updateLoading
                    || this.props.menuLoading
                )
                    && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="exchangefeed.title.select.update" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                        <Form className="m-10 tradefrm">
                            {((menuDetail["CBD730DE-6BE4-3063-0946-3B85048D56EF"]) && (menuDetail["CBD730DE-6BE4-3063-0946-3B85048D56EF"].Visibility === "E925F86B")) && //CBD730DE-6BE4-3063-0946-3B85048D56EF
                                <FormGroup row>
                                    <Label sm={4} for="curency" className='d-inline'>
                                        {<IntlMessages id="exchangefeed.title.methodid" />}<span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            disabled={(menuDetail["CBD730DE-6BE4-3063-0946-3B85048D56EF"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["5AADD18D-635F-4CF6-4A30-3687BCBB3F77"]) && (menuDetail["5AADD18D-635F-4CF6-4A30-3687BCBB3F77"].Visibility === "E925F86B")) && //5AADD18D-635F-4CF6-4A30-3687BCBB3F77
                                <FormGroup row>
                                    <Label sm={4} for="curency" className='d-inline'>
                                        {<IntlMessages id="exchangefeed.title.feedLimitid" />}<span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            disabled={(menuDetail["5AADD18D-635F-4CF6-4A30-3687BCBB3F77"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["40181257-47AA-894D-8283-C2247C2E4DB4"]) && (menuDetail["40181257-47AA-894D-8283-C2247C2E4DB4"].Visibility === "E925F86B")) && //40181257-47AA-894D-8283-C2247C2E4DB4
                                <FormGroup row>
                                    <Label sm={4} for="status" className='d-inline'>
                                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            disabled={(menuDetail["40181257-47AA-894D-8283-C2247C2E4DB4"].AccessRight === "11E6E7B0") ? true : false}
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
                                            onClick={() => this.updateExchangeFeedData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="sidebar.pairConfiguration.button.update" />
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
    updateexchangeFeedList: state.exchangeFeed.updateexchangeFeedList,
    updateLoading: state.exchangeFeed.updateLoading,
    updateError: state.exchangeFeed.updateError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

//connet component to store
export default connect(
    mapStateToProps,
    {
        updateExchangeConfigurationList,
        getExchangeFeedConfigSocket,
        getExchangeFeedConfigLimits,
        getExchangeFeedConfigList,
        getMenuPermissionByID
    }
)(UpdateExchangeFeedConfig);