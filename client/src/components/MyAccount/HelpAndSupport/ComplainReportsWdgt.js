/**
 * My Account - Complain Reports
 * Develop By : Salim Deraiya
 * Created Date : 03/10/2018
 * Updated By:  Saloni Rathod(08th April 2019)
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from "mui-datatables";
import IntlMessages from 'Util/IntlMessages';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { Badge } from 'reactstrap';
import { complainList } from 'Actions/MyAccount';
import { changeDateFormat } from "Helpers/helpers";
// validation for filter
import validateComplainReport from '../../../validation/MyAccount/complain_report';

//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colType" />,
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDate" />,
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colSubject" />,
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDescription" />,
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colActions" />,
        options: {
            filter: false,
            sort: false,
        }
    },
];
const options = {
    textLabels: {
        body: {
            noMatch: <IntlMessages id="wallet.emptyTable" />,
            toolTip: <IntlMessages id="wallet.sort" />,
        }
    },
    filterType: "select",
    responsive: "scroll",
    selectableRows: false,
    resizableColumns: false,
    viewColumns: false,
    filter: false,
    download: false,
    rowsPerPageOptions: [10, 25, 50, 100],
};

const ComplainStatus = ({ status_id }) => {
    let htmlStatus = '';
    if (status_id === "Open") {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.open" /></Badge>;
    } else if (status_id === "Close") {
        htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.closed" /></Badge>;
    } else if (status_id === "Pending") {
        htmlStatus = <Badge color="primary"><IntlMessages id="widgets.pending" /></Badge>;
    }
    return htmlStatus;
}

class ComplainReportsWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ComplainNumber: "",
            list: [],
            ListComplain: false,
            showReset: false,
            errors: '',
            isDisable: true,
            data: {
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                Subject: "",
            },
        }
    }
    componentWillMount() {
        this.props.complainList(this.state.data);
    }
    //to apply filter
    applyFilter = () => {
        const { FromDate, ToDate } = this.state.data;
        var newObj = Object.assign({}, this.state.data);
        const { isValid, errors } = validateComplainReport(newObj);
        this.setState({ errors: errors })
        if (isValid) {
            const currentDate = new Date().toISOString().slice(0, 10)
            if (FromDate !== "" && ToDate !== "") {
                this.setState({ showReset: true });
                if (FromDate > currentDate) {
                    NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
                } else if (ToDate < FromDate) {

                    NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
                } else if (ToDate > currentDate) {
                    NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
                } else {
                    this.props.complainList(newObj);
                    this.setState({ showReset: true });
                }
            }

        }
    }
    //to clear filter
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.Subject = "";
        this.setState({ data: newObj, showReset: false, errors: '', isDisable: true });
        this.props.complainList(newObj);

    }
    onChange = (event) => {

        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj, isDisable: false });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });

        if (nextProps.getList.ReturnCode === 1 || nextProps.getList.ReturnCode === 9) {
            var errMsg = nextProps.getList.ErrorCode === 1 ? nextProps.getList.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.getList.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.getList.hasOwnProperty('userWiseCompaintDetailResponces') && nextProps.getList.userWiseCompaintDetailResponces.length > 0) {
            this.setState({ list: nextProps.getList.userWiseCompaintDetailResponces });
        }
        else if (nextProps.getList.ReturnCode === 0 && nextProps.getList.userWiseCompaintDetailResponces.length === 0) {
            this.setState({ list: [] })
        }
    }

    onComplainReply(ComplainNumber) {
        this.props.myCallbackComplainWdgt(this.state.ListComplain, ComplainNumber);
    }

    render() {
        const { FromDate, ToDate, Subject } = this.state.data;
        const { showReset, list, loading, errors, isDisable } = this.state;
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-3 col-sm-6">
                            <Label for="FromDate"><IntlMessages id="widgets.startDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={(e) => this.onChange(e)} />
                            {errors.FromDate && <div className="text-danger text-left"><IntlMessages id={errors.FromDate} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-6">
                            <Label for="ToDate"><IntlMessages id="widgets.endDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={(e) => this.onChange(e)} />
                            {errors.ToDate && <div className="text-danger text-left"><IntlMessages id={errors.ToDate} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-6">
                            <Label for="Subject"><IntlMessages id="sidebar.subject" /></Label>
                            <Input type="text" name="Subject" id="Subject" placeholder="Subject" value={Subject} onChange={(e) => this.onChange(e)} />
                            {errors.Subject && <div className="text-danger text-left"><IntlMessages id={errors.Subject} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-6">
                            <div className="btn_area">
                                <Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : isDisable)} className="mr-10 text-white rounded-0 border-0 perverbtn" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
                                {showReset && <Button className="btn-danger rounded-0 border-0 text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <div className="StackingHistory">
                    <div className={this.props.darkMode ? 'transaction-history-detail-darkmode' : 'transaction-history-detail'}>
                        <MUIDataTable
                            title={<IntlMessages id="sidebar.complain" />}
                            columns={columns}
                            options={options}
                            data={
                                list.map((lst, index) => {
                                    return [
                                        index + 1,
                                        lst.Type,
                                        changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
                                        <p className="Complainlist">{lst.Subject}</p>,
                                        <p className="Complainlist">{lst.Description}</p>,
                                        <Fragment><ComplainStatus status_id={lst.Status} /></Fragment>,
                                        <Fragment>
                                            {/* {lst.Status === 'Close' ? '-' : <a href="javascript:void(0);" onClick={() => this.onComplainReply(lst.CompainNumber)} className="text-dark"> <i className="zmdi zmdi-replay zmdi-hc-sm" /> </a>} */}
                                            <a href="javascript:void(0);" onClick={() => this.onComplainReply(lst.CompainNumber)} className="text-dark"> <i className="zmdi zmdi-replay zmdi-hc-sm" /> </a>
                                        </Fragment>
                                    ];
                                })
                            }
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ complainRdcer, settings }) => {
    const { darkMode } = settings;
    const { getList, loading } = complainRdcer;
    return { getList, loading, darkMode }
}

export default connect(mapStateToProps, {
    complainList
})(ComplainReportsWdgt);