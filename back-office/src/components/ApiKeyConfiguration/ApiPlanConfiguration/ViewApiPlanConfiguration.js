// Component for View List Of Api Plan Configuration By Tejas 22/2/2019
import React from "react";
// import for design
import { Col, Label, Row } from "reactstrap";

// import for conver language 
import IntlMessages from "Util/IntlMessages";

// used for button 
import Button from '@material-ui/core/Button';

// display card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";
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

// class for view APi Plan Config List
class ViewApiPlanConfigList extends React.Component {

    constructor(props) {
        super(props);

        var readOnly = [], fullAccess = [];

        if (props.selectedData && props.selectedData.ReadOnlyAPI) {
            readOnly = Object.entries(props.selectedData.ReadOnlyAPI).map(([key, value]) => ({ key, value }));
        }

        if (props.selectedData && props.selectedData.FullAccessAPI) {
            fullAccess = Object.entries(props.selectedData.FullAccessAPI).map(([key, value]) => ({ key, value }));
        }

        this.state = {
            loading: false,
            ApiPlanList: props.selectedData ? props.selectedData : {},
            validityType: (props.selectedData && props.selectedData.PlanValidityType === 1) ?
                <IntlMessages id="sidebar.day" />
                : (props.selectedData && props.selectedData.PlanValidityType === 2) ?
                    <IntlMessages id="sidebar.month" /> :
                    (props.selectedData && props.selectedData.PlanValidityType === 3) ?
                        <IntlMessages id="sidebar.year" /> : "",
            open: false,
            ReadOnlyAPI: readOnly,
            fullAccessApi: fullAccess,
            isAPICall: false,
            type: props.type,
            HtmlBODY: props.selectedData && props.selectedData.PlanDesc ? props.selectedData.PlanDesc : "",
            __HTMLContent: "",
            notificationFlag: true,
            menudetail: [],
        };
    }
    componentWillMount() {
        // this.props.GUID
        this.props.getMenuPermissionByID(this.props.GUID); // get Trading menu permission
    }
    // invoke when component is about to get Props
    componentWillReceiveProps(nextProps) {
        this.setState({
            ApiPlanList: nextProps.selectedData
        });
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

    renderBodyContents = () => {

        return { __html: this.state.HtmlBODY }
    };

    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    drawerClose = () => {
        this.props.drawerClose();
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
    render() {

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0A04FF81-381D-A577-8A08-DB2D3ADD1B66'); //0A04FF81-381D-A577-8A08-DB2D3ADD1B66
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div>
                <JbsCollapsibleCard>
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>{this.state.ApiPlanList ? this.state.ApiPlanList.PlanName : ""}</h2>
                        </div>
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                mini onClick={this.drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
                                onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
                    </div>
                </JbsCollapsibleCard>
                {this.props.menuLoading && <JbsSectionLoader />}
                {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 &&
                    <Col md={12}>
                        <Row>
                            <Col md={6}>
                                <JbsCollapsibleCard>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.planvalidity" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6} className="d-inline">

                                            {this.state.ApiPlanList ? this.state.ApiPlanList.PlanValidity : ""} {this.state.validityType}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxperday" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxPerDay : ""}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxorderpersec" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxOrderPerSec : ""}
                                        </Label>
                                    </Row>


                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxreqsize" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxReqSize : ""}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6} className="d-inline">
                                            {<IntlMessages id="apiplanconfiguration.title.councurrentendpoints" />}
                                            {"           "}
                                            <Tooltip title={<IntlMessages id="exchangefeed.tooltip.concurrent" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>

                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.ConcurrentEndPoints : ""}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="whitelist" sm={6} xs={6} className="d-inline">

                                            {<IntlMessages id="apiplanconfiguration.title.whitelistendpoints" />}

                                            {"           "}
                                            <Tooltip title={<IntlMessages id="exchangefeed.tooltip.whitelist" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>
                                        </Label>

                                        <Label for="priority" sm={6} xs={6}>
                                            {this.state.ApiPlanList && this.state.ApiPlanList.Whitelistendpoints ? this.state.ApiPlanList.Whitelistendpoints : 0}
                                        </Label>

                                    </Row>

                                    {this.state.ApiPlanList && this.state.ApiPlanList.CreatedDate !== undefined ?
                                        <Row>
                                            <Label for="date" sm={6} xs={6}>

                                                {<IntlMessages id="widgets.date" />}
                                            </Label>

                                            <Label for="priority" sm={6} xs={6}>
                                                {this.state.ApiPlanList.CreatedDate.replace('T', ' ').split('.')[0]}
                                            </Label>

                                        </Row> :
                                        <Row>
                                            <Label for="date" sm={6} xs={6}>

                                                {<IntlMessages id="widgets.date" />}
                                            </Label>

                                            <Label for="priority" sm={6} xs={6}>
                                                {this.state.ApiPlanList ? this.state.ApiPlanList.LastModifyDate.replace('T', ' ').split('.')[0] : ""}
                                            </Label>

                                        </Row>

                                    }

                                    <Row>
                                        <Label for="priority" sm={6} xs={6} className="d-inline">
                                            {<IntlMessages id="sidebar.priority" />}

                                            {"           "}
                                            <Tooltip title={<IntlMessages id="exchangefeed.tooltip.priority" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>

                                        </Label>

                                        <Label for="priority" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.Priority : ""}
                                        </Label>
                                    </Row>

                                    {typeof this.state.ReadOnlyAPI !== 'undefined' &&
                                        <Row>
                                            <Label for="status" sm={6} xs={6}>
                                                {<IntlMessages id="apiplanconfiguration.title.readonlyapi" />}
                                            </Label>
                                            {
                                                this.state.ReadOnlyAPI.length > 0 &&
                                                this.state.ReadOnlyAPI.map((value, key) => {
                                                    return key === 0 ?
                                                        <Label for="readonly" key={key} md={6}>
                                                            {value.value}
                                                        </Label> :
                                                        <Label for="readonly" key={key} md={{ offset: 6 }} className="pl-10">
                                                            {value.value}
                                                        </Label>
                                                })
                                            }
                                        </Row>
                                    }

                                    <Row>
                                        <Label for="status" sm={6} xs={6}>
                                            {<IntlMessages id="lable.status" />}
                                        </Label>

                                        <Label for="status" sm={6} xs={6} className={this.state.ApiPlanList && this.state.ApiPlanList.Status === 1 ? "text-success" : "text-danger"}>
                                            {this.state.ApiPlanList && this.state.ApiPlanList.Status === 1 ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inactive" />}
                                        </Label>
                                    </Row>

                                </JbsCollapsibleCard>
                            </Col>

                            <Col md={6}>

                                <JbsCollapsibleCard>


                                    <Row>
                                        <Label for="price" sm={6} xs={6}>
                                            {<IntlMessages id="widgets.price" />}
                                        </Label>

                                        <Label for="price" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.Price : "-"}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="change" sm={6} xs={6}>
                                            {<IntlMessages id="table.charge" />}
                                        </Label>

                                        <Label for="change" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.Charge : "-"}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxpermin" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxPerMinute : ""}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxpermonth" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxPerMonth : ""}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxrecperrequest" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxRecPerRequest : ""}
                                        </Label>
                                    </Row>

                                    <Row>
                                        <Label for="planname" sm={6} xs={6}>
                                            {<IntlMessages id="apiplanconfiguration.title.maxressize" />}
                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.MaxResSize : ""}
                                        </Label>
                                    </Row>

                                    {this.state.ApiPlanList && this.state.ApiPlanList.CreatedDate ?
                                        <Row>
                                            <Label for="date" sm={6} xs={6}>
                                                {<IntlMessages id="sidebar.colUpdatedDt" />}
                                            </Label>

                                            <Label for="planname" sm={6} xs={6}>
                                                {this.state.ApiPlanList.CreatedDate.replace('T', ' ').split('.')[0]}
                                            </Label>
                                        </Row>
                                        :
                                        <Row>
                                            <Label for="date" sm={6} xs={6}>
                                                {<IntlMessages id="sidebar.modifyDetail" />}
                                            </Label>

                                            <Label for="planname" sm={6} xs={6}>
                                                {this.state.ApiPlanList ? this.state.ApiPlanList.ModifyDetails : ""}
                                            </Label>
                                        </Row>
                                    }

                                    <Row>
                                        <Label for="planname" sm={6} xs={6} className="d-inline">
                                            {<IntlMessages id="apiplanconfiguration.title.historicaldatamonth" />}

                                            {"           "}
                                            <Tooltip title={<IntlMessages id="exchangefeed.tooltip.historical" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>

                                        </Label>

                                        <Label for="planname" sm={6} xs={6}>
                                            {this.state.ApiPlanList ? this.state.ApiPlanList.HistoricalDataMonth : ""}
                                        </Label>
                                    </Row>

                                    {typeof this.state.fullAccessApi !== 'undefined' &&
                                        <Row>
                                            <Label for="status" sm={6} xs={6}>
                                                {<IntlMessages id="apiplanconfiguration.title.fullaccessapi" />}
                                            </Label>
                                            {
                                                this.state.fullAccessApi.length > 0 &&
                                                this.state.fullAccessApi.map((value, key) => {
                                                    return key === 0 ?
                                                        <Label for="readonly" key={key} sm={6}>
                                                            {value.value}
                                                        </Label> :
                                                        <Label for="readonly" key={key} md={{ offset: 6 }} className="pl-10">
                                                            {value.value}
                                                        </Label>
                                                })
                                            }
                                        </Row>
                                    }

                                    <Row>
                                        <Label for="planrecursive" sm={6} xs={6} className="d-inline">
                                            {<IntlMessages id="apiplanconfiguration.title.planrecursive" />}

                                            {"           "}
                                            <Tooltip title={<IntlMessages id="exchangefeed.tooltip.planrecursive" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>

                                        </Label>

                                        <Label for="planrecursive" sm={6} xs={6}>
                                            {this.state.ApiPlanList && this.state.ApiPlanList.IsPlanRecursive === 1 ? <IntlMessages id="button.yes" /> : <IntlMessages id="sidebar.no" />}
                                        </Label>

                                    </Row>
                                </JbsCollapsibleCard>
                            </Col>


                        </Row>
                    </Col>
                }
                <Col md={12}>
                    <Row>
                        <Col md={12}>
                            <JbsCollapsibleCard>

                                <Label for="planname">
                                    {<IntlMessages id="apiplanconfiguration.title.plandesc" />}
                                </Label>

                                <div dangerouslySetInnerHTML={this.renderBodyContents()}></div>
                            </JbsCollapsibleCard>
                        </Col>
                    </Row>
                </Col>
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
export default connect(mapStateToProps, { getMenuPermissionByID })(ViewApiPlanConfigList);
