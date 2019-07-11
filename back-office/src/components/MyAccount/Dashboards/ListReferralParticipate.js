/**
 * Created By Sanjay 
 * Created Date 22/02/19
 * Component For List Referral Invite 
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
import { getReferralParticipate, getServiceList, getChannelType } from 'Actions/MyAccount';
import validateServiceTypeForm from "Validations/MyAccount/referral_report.js";
import AppConfig from 'Constants/AppConfig';
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
    title: <IntlMessages id="my_account.participant" />,
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
    name: <IntlMessages id="sidebar.ReciverUsername" />
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

class ListSocialMediaInvite extends Component {
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
      ReferUsername: "",
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
    this.props.getMenuPermissionByID('169D9798-3351-A3FC-0032-AEC5FDE17AB4'); // my account menu permission  
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
                this.props.getReferralParticipate(newObj);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false })
    }
    if (nextProps.listReferralParticipateData.ReturnCode === 0) {
      this.setState({
        Data: nextProps.listReferralParticipateData.ReferralUserList,
        totalCount: nextProps.listReferralParticipateData.TotalCount
      })
    } else if (nextProps.listReferralParticipateData.ReturnCode === 1) {
      var errMsg = nextProps.listReferralParticipateData.ErrorCode === 1 ? nextProps.listReferralParticipateData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.listReferralParticipateData.ErrorCode}`} />;
      NotificationManager.error(errMsg);
    }
    if (nextProps.listServiceData.ReturnCode === 0 && (nextProps.listServiceData.ReferralServiceDropDownList).length > 0) {
      this.setState({ serviceData: nextProps.listServiceData.ReferralServiceDropDownList })
    }
    if (nextProps.listChannelTypeData.ReturnCode === 0 && (nextProps.listChannelTypeData.ReferralChannelTypeDropDownList).length > 0) {
      this.setState({ channelList: nextProps.listChannelTypeData.ReferralChannelTypeDropDownList })
    }
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
    newObj.ReferUsername = "";
    newObj.ChannelType = "";
    this.setState({ showReset: false, getFilter: newObj, errors: '' });
    this.props.getReferralParticipate(newObj);
  }

  getFilterData = () => {
    const { errors, isValid } = validateServiceTypeForm(this.state.getFilter)
    const { FromDate, ToDate } = this.state.getFilter;
    this.setState({ showReset: true, errors: errors });
    if (isValid) {
      if (FromDate === "" || ToDate === "") {
        NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
      } else {
        let newObj = Object.assign({}, this.state.getFilter);
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.props.getReferralParticipate(newObj);
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
    this.props.getReferralParticipate({
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
    this.props.getReferralParticipate({
      ...this.state.getFilter,
      PageIndex: 1,
      Page_Size: event.target.value
    });
  };

  handleChange = (event) => {
    let newObj = Object.assign({}, this.state.getFilter);
    newObj[event.target.name] = event.target.value;
    this.setState({ getFilter: newObj });
  }
  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
      let response = false;
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
    const { PageIndex, Page_Size, FromDate, ToDate, Username, Service, ReferUsername, ChannelType } = this.state.getFilter;

    //Check list permission....
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('5e113cb0-5348-1669-8d77-d0cfbb806910'); //5E113CB0-5348-1669-8D77-D0CFBB806910
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
          this.props.getReferralParticipate({
            GetData: {
              ...this.state.Getdata,
              PageIndex: tableState.page,
              Page_Size: tableState.rowsPerPage
            }
          });
        }
      }
    };

    return (
      <div className="jbs-page-content">
        <WalletPageTitle title={<IntlMessages id="my_account.participant" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
        {(this.state.menuLoading || loading)&& <JbsSectionLoader />}
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
              <Input type="text" name="Username" id="Username" placeholder="Enter Username" value={Username} onChange={this.handleChange} />
              {errors.Username && (<span className="text-danger text-left"><IntlMessages id={errors.Username} /></span>)}
            </FormGroup>
            <FormGroup className="col-md-2 col-sm-4">
              <Label for="ReferUsername"><IntlMessages id="my_account.ReferUsername" /></Label>
              <IntlMessages id="my_account.ReferUsername">
                {(placeholder) =>
                  <Input type="text" name="ReferUsername" id="ReferUsername" placeholder={placeholder} value={ReferUsername} onChange={this.handleChange} />
                }
              </IntlMessages>
              {errors.ReferUsername && (<span className="text-danger text-left"><IntlMessages id={errors.ReferUsername} /></span>)}
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
                <div className="btn_area m-0">
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
                  lst.ReferUserName,
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

const mapStateToProps = ({ ReferralInvitationsReducer, drawerclose,authTokenRdcer }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const { menuLoading, menu_rights } = authTokenRdcer;
  const { listReferralParticipateData, listChannelTypeData, listServiceData, loading } = ReferralInvitationsReducer;
  return { listReferralParticipateData, listServiceData, listChannelTypeData, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
  getReferralParticipate,
  getServiceList,
  getChannelType,
  getMenuPermissionByID,
})(ListSocialMediaInvite);