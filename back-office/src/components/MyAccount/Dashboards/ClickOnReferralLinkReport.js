/*
    Developer : Bharat Jograna
    Date : 13-02-2019
    update by  : Sanjay
    File Comment : Referral Click On Referral Link Report Component
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { NotificationManager } from "react-notifications";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { clickReferralLinkReport, getPayType, getServiceList, getChannelType } from 'Actions/MyAccount';
import validateServiceTypeForm from "Validations/MyAccount/referral_report.js";
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

//BreadCrumbData
const BreadCrumbData = [
  {
    title: <IntlMessages id="sidebar.app" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.dashboard" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.adminPanel" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="my_account.referralSystem" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="my_account.ClickOnReferralLinkReport" />,
    link: '',
    index: 2
  }
];

//Columns Object
const columns = [
  {
    name: <IntlMessages id="sidebar.colHash" />
  },
  {
    name: <IntlMessages id="sidebar.colUserName" />
  },
  {
    name: <IntlMessages id="sidebar.colChannelType" />
  },
  {
    name: <IntlMessages id="table.Discription" />
  },
  {
    name: <IntlMessages id="sidebar.colCreatedDt" />
  }
];

class ClickOnReferralLinkReport extends Component {
  state = {
    Data: [],
    open: false,
    getFilter: {
      PageIndex: 1,
      Page_Size: AppConfig.totalRecordDisplayInList,
      FromDate: "",
      ToDate: "",
      Username: "",
      Service: "",
      ChannelType: ""
    },
    errors: '',
    serviceData: [],
    channelList: [],
    showReset: false,
    totalCount: 0,
    menudetail: [],
    notificationFlag: true,
    menuLoading:false
  }

  onClick = () => {
    this.setState({ open: this.state.open ? false : true })
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('98F71172-640A-2965-94D9-4DEB8B049ED3'); // my account menu permission
  }

  clearFilter = () => {
    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    let newObj = Object.assign({}, this.state.getFilter);
    newObj.Username = "";
    newObj.FromDate = today;
    newObj.ToDate = today;
    newObj.PageIndex = 1;
    newObj.Page_Size = AppConfig.totalRecordDisplayInList;
    newObj.Service = "";
    newObj.ChannelType = "";
    this.setState({ showReset: false, getFilter: newObj, errors: '' });
    this.props.clickReferralLinkReport(newObj);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ menuLoading: nextProps.menuLoading })
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {
          this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
          let today = new Date();
          today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
          let newObj = Object.assign({}, this.state.getFilter);
          newObj.FromDate = today;
          newObj.ToDate = today;
          newObj.PageIndex = 1;
          newObj.Page_Size = AppConfig.totalRecordDisplayInList;
          this.setState({ getFilter: newObj });
          this.props.getServiceList({ PayTypeId: 0 });
          this.props.getChannelType();
          this.props.clickReferralLinkReport(newObj);
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
          this.setState({ notificationFlag: false });
          NotificationManager.error(<IntlMessages id={"error.permission"} />);
          this.props.drawerClose();
      }
  }
    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false })
    }
    if (nextProps.clickReferralLinkReportData.ReturnCode === 0) {
      this.setState({
        Data: nextProps.clickReferralLinkReportData.ReferralUserClickList,
        totalCount: nextProps.clickReferralLinkReportData.TotalCount
      })
    } else if (nextProps.clickReferralLinkReportData.ReturnCode === 1) {
      var errMsg = nextProps.clickReferralLinkReportData.ErrorCode === 1 ? nextProps.clickReferralLinkReportData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.clickReferralLinkReportData.ErrorCode}`} />;
      NotificationManager.error(errMsg);
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
    const { errors, isValid } = validateServiceTypeForm(this.state.getFilter)
    const { FromDate, ToDate } = this.state.getFilter;
    this.setState({ showReset: true, errors: errors });
    if (isValid) {
      if (FromDate === "" || ToDate === "") {
        NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
      } else {
        var newObj = Object.assign({}, this.state.getFilter);
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.props.clickReferralLinkReport(newObj);
      }
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
    const { Data, totalCount, serviceData, channelList, errors } = this.state;
    const { drawerClose, loading } = this.props;
    const { PageIndex, Page_Size, FromDate, ToDate, Username, ChannelType, Service } = this.state.getFilter;

    //Check list permission....
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('26935dfa-989f-65c4-14e1-d36f54024247'); //26935DFA-989F-65C4-14E1-D36F54024247
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    const options = {
      filterType: "select",
      responsive: "scroll",
      selectableRows: false,
      resizableColumns: false,
      search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
      print: false,
      download: false,
      viewColumns: false,
      filter: false,
      sort: false,
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
      <div className="jbs-page-content">
        <WalletPageTitle title={<IntlMessages id="my_account.ClickOnReferralLinkReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />{loading && <JbsSectionLoader />}
        {(this.state.menuLoading || loading) && <JbsSectionLoader />}
        {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation ? */}
        <JbsCollapsibleCard>
          <div className="top-filter">
            <Form className="tradefrm row">
              <FormGroup className="col-md-2 col-sm-4">
                <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup className="col-md-2 col-sm-4">
                <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup className="col-md-2 col-sm-4">
                <Label for="Username"><IntlMessages id="my_account.userName" /></Label>
                <IntlMessages id="my_account.userName">
                  {(placeholder) =>
                    <Input type="text" name="Username" id="Username" placeholder={placeholder} value={Username} onChange={this.handleChange} />
                  }
                </IntlMessages>
                {errors.Username && (<span className="text-danger text-left"><IntlMessages id={errors.Username} /></span>)}
              </FormGroup>
              <FormGroup className="col-md-2 col-sm-4">
                <Label for="ChannelType"><IntlMessages id="sidebar.colChannelType" /></Label>
                <Input type="select" name="ChannelType" id="ChannelType" value={ChannelType} onChange={this.handleChange}>
                  <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                  {channelList.map((type, key) =>
                    <option key={key} value={type.Id}>{type.ChannelTypeName}</option>
                  )}
                </Input>
              </FormGroup>
              <FormGroup className="col-md-2 col-sm-4">
                <Label for="serviceData"><IntlMessages id="my_account.serviceData" /></Label>
                <Input type="select" name="Service" value={Service} onChange={this.handleChange}>
                  <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                  {serviceData.map((type, key) =>
                    <option key={key} value={type.Id}>{type.ServiceSlab}</option>
                  )}
                </Input>
              </FormGroup>              
              <FormGroup className="col-md-2 col-sm-4">
                  <div className="btn_area">
                    <Button color="primary" onClick={this.getFilterData}><IntlMessages id="sidebar.btnApply" /></Button>
                    {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                  </div>
              </FormGroup>
            </Form>
          </div>
        </JbsCollapsibleCard>
        }
        <div className="StackingHistory mt-20 statusbtn-comm">
          <MUIDataTable
            columns={columns}
            options={options}
            data={
              Data.map((lst, key) => {
                return [
                  key + 1,
                  lst.UserName,
                  lst.ReferralChanneTypeName,
                  lst.ReferralServiceDescription,
                  <span className="date">{changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
                ]
              })
            }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ ReferralInvitationsReducer, ReferralRewardConfig, drawerclose,authTokenRdcer }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const { clickReferralLinkReportData, listChannelTypeData, listServiceData, loading } = ReferralInvitationsReducer;
  const { payTypeData } = ReferralRewardConfig;
  const { menuLoading, menu_rights } = authTokenRdcer;
  return { clickReferralLinkReportData, listChannelTypeData, listServiceData, payTypeData, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
  clickReferralLinkReport,
  getPayType,
  getServiceList,
  getChannelType,
  getMenuPermissionByID
})(ClickOnReferralLinkReport);