// component for view Plan subscription Date 6/3/2019 By Tejas

import React from "react";

// import for design
import { Col, Label, Row } from "reactstrap";

// import for conver language 
import IntlMessages from "Util/IntlMessages";

// used for button 
import Button from '@material-ui/core/Button';

// display card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

//used for apply multiple classes
import classnames from 'classnames';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { connect } from "react-redux";
// style for button
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
};


//class for view API subscription history
class ViewApiPlanSubscription extends React.Component {

    // constructor and set default state
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            viewData: props.selectedData ? props.selectedData : {},
            validityType: props.selectedData.PlanValidityType === 1 ?
                <IntlMessages id="sidebar.day" />
                : props.selectedData.PlanValidityType === 2 ?
                    <IntlMessages id="sidebar.month" /> :
                    props.selectedData.PlanValidityType === 3 ?
                        <IntlMessages id="sidebar.year" /> : "",
            open: false,
            notificationFlag: true,
            menudetail: [],
        };

    }

    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('9476C9B2-4057-60A2-6057-4B1712870CDA'); // get Trading menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    //render the component
    render() {
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7238C6FD-66F8-71A9-5CF5-965FE3E0405E'); //7238C6FD-66F8-71A9-5CF5-965FE3E0405E
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose } = this.props;

        return (
            <div>
                <JbsCollapsibleCard>
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>{this.state.viewData ? this.state.viewData.PlanName : ""}</h2>
                        </div>
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
                                onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
                    </div>
                </JbsCollapsibleCard>
                {this.props.menuLoading && <JbsSectionLoader />}
                {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 &&
                    <Col md={12}>
                        <Row>
                            <Col md={6} sm={6} xs={12}>

                                <Row>
                                    <Label for="planname" sm={6} xs={6}>
                                        {<IntlMessages id="tradingLedger.filterLabel.userID" />}
                                    </Label>

                                    <Label for="planname" sm={6} xs={6} className="d-inline">

                                        {this.state.viewData ? this.state.viewData.UserID : ""}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="planname" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.planvalidity" />}
                                    </Label>

                                    <Label for="planname" sm={6} xs={6} className="d-inline">

                                        {this.state.viewData ? this.state.viewData.PlanValidity : ""} {this.state.validityType}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="planname" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.autorenew" />}
                                    </Label>

                                    <Label for="planname" sm={6} xs={6}
                                        className={this.state.viewData.IsPlanRecursive === 1 ? "text-primary d-inline font-weight-bold" :
                                            "text-warning d-inline font-weight-bold"}>
                                        {this.state.viewData.IsPlanRecursive === 1 ? <IntlMessages id="button.yes" /> : <IntlMessages id="sidebar.no" />}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="planname" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.planstatus" />}
                                    </Label>

                                    <Label for="planname" sm={6} xs={6}
                                        className={classnames(this.state.viewData.Status === 1 ? "text-success" : this.state.viewData.Status === 0 ? "text-warning" : this.state.viewData.Status === 9 ? "text-danger" : "", "d-inline font-weight-bold")}>
                                        {this.state.viewData.Status === 1 ? <IntlMessages id="sidebar.active" /> :
                                            this.state.viewData.Status === 9 ? <IntlMessages id="apiplanconfiguration.title.expire" /> :
                                                this.state.viewData.Status === 0 ? <IntlMessages id="apiplanconfiguration.title.inprocess" /> : "-"
                                        }

                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.planActivated" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>

                                        {this.state.viewData.ActivationDate ?
                                            this.state.viewData.ActivationDate.replace('T', ' ').split('.')[0] : "-"}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.totalapikeys" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>
                                        {this.state.viewData ? this.state.viewData.KeyCount + "/" +
                                            this.state.viewData.KeyTotCount
                                            : "-"}
                                    </Label>
                                </Row>


                            </Col>

                            <Col md={6} sm={6} xs={12}>
                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="widgets.price" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>
                                        {this.state.viewData ? this.state.viewData.Price : "-"}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="change" sm={6} xs={6}>
                                        {<IntlMessages id="table.charge" />}
                                    </Label>

                                    <Label for="change" sm={6} xs={6}>
                                        {this.state.viewData ? this.state.viewData.Charge : "-"}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.totalamount" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>
                                        {this.state.viewData ? this.state.viewData.TotalAmt : "-"}
                                    </Label>
                                </Row>


                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="components.expiryDate" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>
                                        {this.state.viewData.ExpiryDate ?
                                            this.state.viewData.ExpiryDate.replace('T', ' ').split('.')[0]
                                            : "-"}
                                    </Label>
                                </Row>

                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.planRequested" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>
                                        {this.state.viewData.RequestedDate ?
                                            this.state.viewData.RequestedDate.replace('T', ' ').split('.')[0] : "-"}
                                    </Label>
                                </Row>


                                <Row>
                                    <Label for="price" sm={6} xs={6}>
                                        {<IntlMessages id="apiplanconfiguration.title.totalipwhitelisted" />}
                                    </Label>

                                    <Label for="price" sm={6} xs={6}>
                                        {this.state.viewData ? this.state.viewData.WhitelistedEndPointsCount + "/" +
                                            this.state.viewData.WhitelistedEndPoints
                                            : "-"}
                                    </Label>
                                </Row>


                            </Col>

                        </Row>
                    </Col>
                }
            </div>
        )
    }
}
// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getMenuPermissionByID
    }
)(ViewApiPlanSubscription);
