/**
 * Created By Sanjay 
 * Created Date 21/02/19
 * Component For List Referral Invite 
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { NotificationManager } from "react-notifications";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getReferralInviteList, getPayType, getServiceList, getChannelType } from 'Actions/MyAccount';
import validateServiceTypeForm from "Validations/MyAccount/referral_report.js";
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';
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
    title: <IntlMessages id="my_account.invites" />,
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
    name: <IntlMessages id="sidebar.colPayType" />
  },
  {
    name: <IntlMessages id="table.Discription" />
  },
  {
    name: <IntlMessages id="sidebar.Receiver" />
  },
  {
    name: <IntlMessages id="sidebar.colCreatedDt" />
  }
];

class ListReferralInvite extends Component {

  state = {
    Data: [],
    open: false,
    getFilter: {
      PageIndex: 1,
      Page_Size: AppConfig.totalRecordDisplayInList,
      FromDate: "",
      ToDate: "",
      Username: "",
      PayType: "",
      Service: "",
      ChannelType: ""
    },
    errors: '',
    isDisable: true,
    payTypeList: [],
    serviceData: [],
    channelList: [],
    showReset: false,
    totalCount: 0,
    menudetail: [],
    notificationFlag: true,
    menuLoading:false
  }

  onClick = () => {
    this.setState({ open: !this.state.open })
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('2FAF811F-26A9-4058-7A00-F69B17667B20'); // get wallet menu permission
 
  }

  clearFilter = () => {
    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    var newObj = Object.assign({}, this.state.getFilter);
    newObj.Username = "";
    newObj.FromDate = today;
    newObj.ToDate = today;
    newObj.PageIndex = 1;
    newObj.Page_Size = AppConfig.totalRecordDisplayInList;
    newObj.PayType = "";
    newObj.Service = "";
    newObj.ChannelType = "";
    this.setState({ showReset: false, getFilter: newObj, isDisable: true, errors: '' });
    this.props.getReferralInviteList(newObj);
  }


  componentWillReceiveProps(nextProps) {
    this.setState({ menuLoading: nextProps.menuLoading })
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
          if (nextProps.menu_rights.ReturnCode === 0) {
              this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
              let today = new Date();
              today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
              var newObj = Object.assign({}, this.state.getFilter);
              newObj.FromDate = today;
              newObj.ToDate = today;
              newObj.PageIndex = 1;
              newObj.Page_Size = AppConfig.totalRecordDisplayInList;
              this.setState({ getFilter: newObj });
              this.props.getPayType();
              this.props.getServiceList({ PayTypeId: 0 });
              this.props.getChannelType();
              this.props.getReferralInviteList(newObj);
          } else if (nextProps.menu_rights.ReturnCode !== 0) {
              this.setState({ notificationFlag: false });
              NotificationManager.error(<IntlMessages id={"error.permission"} />);
              this.props.drawerClose();
          }
      }

    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false })
    }
    if (nextProps.listReferralInvitationData.ReturnCode === 0) {
      this.setState({
        Data: nextProps.listReferralInvitationData.ReferralChannelList,
        totalCount: nextProps.listReferralInvitationData.TotalCount
      })
    } else if (nextProps.listReferralInvitationData.ReturnCode === 1) {
      var errMsg = nextProps.listReferralInvitationData.ErrorCode === 1 ? nextProps.listReferralInvitationData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.listReferralInvitationData.ErrorCode}`} />;
      NotificationManager.error(errMsg);
    }
    if (nextProps.payTypeData.ReturnCode === 0 && (nextProps.payTypeData.ReferralPayTypeDropDownList).length > 0) {
      this.setState({
        payTypeList: nextProps.payTypeData.ReferralPayTypeDropDownList
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
    const { errors, isValid } = validateServiceTypeForm(this.state.getFilter)
    const { FromDate, ToDate } = this.state.getFilter
    this.setState({ showReset: true, errors: errors });
    if (isValid) {
      if (FromDate === "" || ToDate === "") {
        NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
      } else {
        var newObj = Object.assign({}, this.state.getFilter);
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.props.getReferralInviteList(newObj);
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
    this.props.getReferralInviteList({
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
    this.props.getReferralInviteList({
      ...this.state.getFilter,
      PageIndex: 1,
      Page_Size: event.target.value
    });
  };

  handleChange = (event) => {
    var newObj = Object.assign({}, this.state.getFilter);
    newObj[event.target.name] = event.target.value;
    this.setState({ getFilter: newObj, isDisable: false });
    if (event.target.name === "PayType") {
      this.props.getServiceList({ PayTypeId: event.target.value });
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
  
  render() {
    const { Data, totalCount, payTypeList, serviceData, channelList, isDisable, errors } = this.state;
    const { drawerClose, loading } = this.props;
    const { PageIndex, Page_Size, FromDate, ToDate, Username, PayType, ChannelType, Service } = this.state.getFilter;

    //Check list permission....
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7ca149a4-0ce6-9552-0025-a72d0fdc6df8'); //7CA149A4-0CE6-9552-0025-A72D0FDC6DF8
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
        switch (action) {
          case 'changeRowsPerPage' || "changePage":
            this.setState({
              GetData: {
                ...this.state.Getdata,
                PageIndex: tableState.page,
                Page_Size: tableState.rowsPerPage
              }
            });
            this.props.getReferralInviteList({
              ...this.state.Getdata,
              PageIndex: tableState.page,
              Page_Size: tableState.rowsPerPage
            });
            break;
          default:
            break;
        }
      }
    };

    return (
      <div className="jbs-page-content">
        <WalletPageTitle title={<IntlMessages id="my_account.invites" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                <Label for="RewardPayType"><IntlMessages id="my_account.RewardPayType" /></Label>
                <Input type="select" name="PayType" id="RewardPayType" value={PayType} onChange={this.handleChange}>
                  <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                  {payTypeList.map((type, key) =>
                    <option key={key} value={type.Id}>{type.PayTypeName}</option>
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
            // title={<IntlMessages id="my_account.invites" />}
            columns={columns}
            options={options}
            data={
              Data.map((lst, key) => {
                return [
                  key + 1 + (PageIndex - 1) * Page_Size,
                  lst.UserName,
                  lst.ChannelTypeName,
                  lst.PayTypeName,
                  lst.Description,
                  lst.ReferralReceiverAddress,
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
  const { listReferralInvitationData, listChannelTypeData, listServiceData, loading } = ReferralInvitationsReducer;
  const { payTypeData } = ReferralRewardConfig;
  const {
    menuLoading,
    menu_rights
} = authTokenRdcer;
  return { listReferralInvitationData, listChannelTypeData, listServiceData, payTypeData, loading, drawerclose,    menuLoading,
    menu_rights };
}

export default connect(mapStateToProps, {
  getReferralInviteList,
  getPayType,
  getServiceList,
  getChannelType,
  getMenuPermissionByID
})(ListReferralInvite);