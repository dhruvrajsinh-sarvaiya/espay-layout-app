/*
    Developer : Sanjay 
    Date : 06-03-2019
    File Comment : Referral Click On Referral Link Report Component
*/

import React, { Component , Fragment} from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { CustomFooter } from '../Widgets';
import AppConfig from 'Constants/AppConfig';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from "Helpers/helpers";
import { clickReferralLinkReport, getServiceList, getChannelType } from 'Actions/MyAccount';

//Added By Tejas For Display Error Message 26/3/2019
import { NotificationManager } from 'react-notifications';

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colChannelType" />,
        options: {
            filter: false,
            sort: false
        }
    },
    {
        name: <IntlMessages id="table.Discription" />,
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: {
            filter: false,
            sort: false,
        }
    }
];

class ClickOnReferralLinkReport extends Component {

    state = {
        Data: [],
        open: false,
        getFilter: {
            PageIndex: 1,
            Page_Size:AppConfig.totalRecordDisplayInList,
            FromDate: "",
            ToDate: "",
            Service: "",
            ChannelType: ""
        },
        serviceData: [],
        channelList: [],
        showReset: false,
        totalCount: 0,
        errors:{},
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    }

    componentWillMount() {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        var newObj = Object.assign({}, this.state.getFilter);
        newObj.FromDate = today;
        newObj.ToDate = today;
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.setState({ getFilter: newObj });
        this.props.getServiceList({ PayTypeId: 0 });
        this.props.getChannelType();
        this.props.clickReferralLinkReport(newObj);
    }

    clearFilter = () => {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        var newObj = Object.assign({}, this.state.getFilter);
        newObj.FromDate = today;
        newObj.ToDate = today;
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        newObj.Service = "";
        newObj.ChannelType = "";
        this.setState({ showReset: false, getFilter: newObj, errors:{} });
        this.props.clickReferralLinkReport(newObj);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.clickReferralLinkReportData.ReturnCode === 0) {
            this.setState({
                Data: nextProps.clickReferralLinkReportData.ReferralUserClickList,
                totalCount: nextProps.clickReferralLinkReportData.TotalCount
            })
        }
        if (nextProps.listServiceData.ReturnCode === 0 && (nextProps.listServiceData.ReferralServiceDropDownList).length > 0) {
            this.setState({
                serviceData: nextProps.listServiceData.ReferralServiceDropDownList
            })
        }
        if (nextProps.listChannelTypeData.ReturnCode === 0 && (nextProps.listChannelTypeData.ReferralChannelTypeDropDownList).length > 0) {
            this.setState({
                channelList: nextProps.listChannelTypeData.ReferralChannelTypeDropDownList
            })
        }
    }

    getFilterData = () => {
          //Added by Saloni For Required Fields
        var  { errors } = this.state;
      
        const { FromDate, ToDate } = this.state.getFilter;
        if (FromDate === '' || ToDate === '') {
            if (FromDate === '') {
                errors.FromDate = "my_account.err.fieldRequired";
            }
            if (ToDate === '') {
                errors.ToDate = "my_account.err.fieldRequired";
            }
              }
        this.setState({ errors: errors });
        //end
        const currentDate = new Date().toISOString().slice(0, 10) // added by Tejas
        if ( FromDate !== "" && ToDate !== "") {
            this.setState({ showReset: true });

            // Added By Tejas For Validating Dates 26/3/2019 --> Start
            if (FromDate > currentDate) {

                NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
            } else if (ToDate < FromDate) {

                NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
            } else if (ToDate > currentDate) {

                NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
            } else {

                var newObj = Object.assign({}, this.state.getFilter);
                newObj.PageIndex = 1;
                newObj.Page_Size = AppConfig.totalRecordDisplayInList;
                this.props.clickReferralLinkReport(newObj);
            }

            // Added By Tejas For Validating Dates 26/3/2019 --> End

        }
    }

    handlePageChange = (pageNumber) => {
        this.setState({
            getFilter: {
                ...this.state.getFilter,
                PageIndex: pageNumber
            }
        });
        this.props.clickReferralLinkReport({
            ...this.state.getFilter,
            PageIndex: pageNumber
        });
    }

    onChangeRowsPerPage = event => {
        this.setState({
            getFilter: {
                ...this.state.getFilter,
                PageIndex: 1,
                Page_Size: event.target.value
            }
        });
        this.props.clickReferralLinkReport({
            ...this.state.getFilter,
            PageIndex: 1,
            Page_Size: event.target.value
        });
    };

    handleChange = (event) => {
        var newObj = Object.assign({}, this.state.getFilter);
        newObj[event.target.name] = event.target.value;
        this.setState({ getFilter: newObj });
    }

    render() {
        const { Data, totalCount, serviceData, channelList, errors} = this.state;
        const { loading } = this.props;
        const { PageIndex, Page_Size, FromDate, ToDate, ChannelType, Service } = this.state.getFilter;
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        const options = {
            search: false,
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            viewColumns: false,
            filter: false,
            download: false,
            serverSide: Data.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: Page_Size,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (
                count,
                page,
                rowsPerPage
            ) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
					this.setState({
                        GetData: {
                            ...this.state.Getdata,
                            PageIndex: tableState.page,
                            Page_Size: tableState.rowsPerPage
                        }
                    });
                    this.props.clickReferralLinkReport({
                        ...this.state.Getdata,
                        PageIndex: tableState.page,
                        Page_Size: tableState.rowsPerPage
                    });
				}
            }
        };
        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                <Form>
                    <Row form>
                        <Col md="2" xs="6" sm="6">
                            <FormGroup>
                                <Label for="startDate"><IntlMessages id="widgets.startDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={this.handleChange} />
                                {errors.FromDate && <span className="text-danger text-left"><IntlMessages id={errors.FromDate} /></span>}
                            </FormGroup>
                        </Col>
                        <Col md="2" xs="6" sm="6">
                            <FormGroup>
                                <Label for="endDate"><IntlMessages id="widgets.endDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={this.handleChange} />
                                {errors.ToDate && <span className="text-danger text-left"><IntlMessages id={errors.ToDate} /></span>}
                            </FormGroup>
                        </Col>
                        <Col md="2" xs="6" sm="6">
                            <FormGroup>
                                <Label for="ChannelType"><IntlMessages id="sidebar.colChannelType" /></Label>
                                <Input type="select" name="ChannelType" id="ChannelType" value={ChannelType} onChange={this.handleChange}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    {channelList.map((type, key) =>
                                        <option key={key} value={type.Id}>{type.ChannelTypeName}</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md="2" xs="6" sm="6">
                            <FormGroup>
                                <Label for="serviceData"><IntlMessages id="my_account.serviceData" /></Label>
                                <Input type="select" name="Service" value={Service} onChange={this.handleChange}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    {serviceData.map((type, key) =>
                                        <option key={key} value={type.Id}>{type.ServiceSlab}</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md="2" xs="6" sm="6">
                            <Row>
                                <Col md="4" xs="4" sm="4">
                                    <FormGroup className="mt-30">
                                        <Button className="perverbtn rounded-0 border-0" disabled={((FromDate === "" || ToDate === "") ? true : false)} onClick={this.getFilterData}><IntlMessages id="widgets.apply" /></Button>
                                    </FormGroup>
                                </Col>
                                <Col md="4" xs="4" sm="4">
                                    {this.state.showReset && <FormGroup className="mt-30">
                                        <Button className="btn-danger rounded-0 border-0 text-white" onClick={this.clearFilter}>
                                            <IntlMessages id="button.clear" />
                                        </Button>
                                    </FormGroup>}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </Form>
                    </JbsCollapsibleCard>
                <div className="StackingHistory statusbtn-comm">
                    <MUIDataTable
                        // title={<IntlMessages id="my_account.ClickOnReferralLinkReport" />}
                        columns={columns}
                        options={options}
                        data={
                            Data.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.ReferralChanneTypeName,
                                    lst.ReferralServiceDescription,
                                    <span className="date">{changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
                                ]
                            })
                        }
                    />
                </div>
                </Fragment>
        )
    }
}

const mapStateToProps = ({ ReferralReportReducer, ReferralProgramReducer }) => {
    const { clickReferralLinkReportData, loading } = ReferralReportReducer;
    const { listChannelTypeData, listServiceData } = ReferralProgramReducer;
    return { clickReferralLinkReportData, listChannelTypeData, listServiceData, loading };
}

export default connect(mapStateToProps, {
    clickReferralLinkReport,
    getServiceList,
    getChannelType
})(ClickOnReferralLinkReport);
