/**
 * Created By Sanjay 
 * Created Date 06/03/19
 * Component For List Referral Reward 
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
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { referralRewardReport, getUserDataList, getServiceList } from 'Actions/MyAccount';
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
    title: <IntlMessages id="my_account.convert" />,
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
    name: <IntlMessages id="sidebar.colPayType" />
  },
  {
    name: <IntlMessages id="my_account.Reward" />
  },
  {
    name: <IntlMessages id="sidebar.totalReferrUser" />
  },
  {
    name: <IntlMessages id="sidebar.trnCurrency" />
  },
  {
    name: <IntlMessages id="sidebar.trnUsername" />
  },
  {
    name: <IntlMessages id="sidebar.fromWallet" />
  },
  {
    name: <IntlMessages id="sidebar.toWallet" />
  },
  {
    name: <IntlMessages id="sidebar.trnDate" />
  },
  {
    name: <IntlMessages id="sidebar.comissionAmount" />
  },
  {
    name: <IntlMessages id="sidebar.trnAmount" />
  },
  {
    name: <IntlMessages id="sidebar.colCreatedDt" />
  }
];

class ListReferralRewards extends Component {

  state = {
    Data: [],
    open: false,
    getFilter: {
      PageIndex: 1,
      Page_Size: AppConfig.totalRecordDisplayInList,
      FromDate: "",
      ToDate: "",
      TrnUserId: "",
      Service: ""
    },
    errors: '',
    isDisable: true,
    serviceData: [],
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
    this.props.getMenuPermissionByID('B0F0B462-5081-857A-A3F7-64BA1FF0499A'); // my account menu permission

  }

  clearFilter = () => {
    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    var newObj = Object.assign({}, this.state.getFilter);
    newObj.TrnUserId = "";
    newObj.FromDate = today;
    newObj.ToDate = today;
    newObj.PageIndex = 1;
    newObj.Page_Size = AppConfig.totalRecordDisplayInList;
    newObj.Service = "";
    this.setState({ showReset: false, getFilter: newObj, isDisable: true });
    this.props.referralRewardReport(newObj);
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
          this.props.getServiceList({ PayTypeId: 0 });
          this.props.referralRewardReport(newObj);
          this.props.getUserDataList();
          if (this.props.pagedata === 1) {
            this.setState({ title: <IntlMessages id="my_account.emialInvite" /> })
          } else if (this.props.pagedata === 2) {
            this.setState({ title: <IntlMessages id="my_account.smsInvite" /> })
          }
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
          this.setState({ notificationFlag: false });
          NotificationManager.error(<IntlMessages id={"error.permission"} />);
          this.props.drawerClose();
      }
  }
    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false })
    }
    if (nextProps.listReferralRewardData.ReturnCode === 0) {
      this.setState({
        Data: nextProps.listReferralRewardData.ReferralRewardsList,
        totalCount: nextProps.listReferralRewardData.TotalCount
      })
    } else if (nextProps.listReferralRewardData.ReturnCode === 1) {
      var errMsg = nextProps.listReferralRewardData.ErrorCode === 1 ? nextProps.listReferralRewardData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.listReferralRewardData.ErrorCode}`} />;
      NotificationManager.error(errMsg);
    }
    if (nextProps.listServiceData.ReturnCode === 0 && (nextProps.listServiceData.ReferralServiceDropDownList).length > 0) {
      this.setState({
        serviceData: nextProps.listServiceData.ReferralServiceDropDownList
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
        this.props.referralRewardReport(newObj);
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
    this.props.referralRewardReport({
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
    this.props.referralRewardReport({
      ...this.state.getFilter,
      PageIndex: 1,
      Page_Size: event.target.value
    });
  };

  handleChange = (event) => {
    var newObj = Object.assign({}, this.state.getFilter);
    newObj[event.target.name] = event.target.value;
    this.setState({ getFilter: newObj, isDisable: false });
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
    const trnlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
    const { Data, totalCount, serviceData, isDisable, errors } = this.state;
    const { drawerClose, loading } = this.props;
    const { PageIndex, Page_Size, FromDate, ToDate, TrnUserId, Service } = this.state.getFilter;

    //Check list permission....
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7e4ff4cd-29e4-6826-7dfe-3a820eb95941'); //7E4FF4CD-29E4-6826-7DFE-3A820EB95941
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
            this.props.referralRewardReport({
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
        <WalletPageTitle title={<IntlMessages id="my_account.convert" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                <Label for="TrnUserId"><IntlMessages id="col.TrnUserId" /></Label>
                <Input type="select" name="TrnUserId" value={TrnUserId} onChange={this.handleChange}>
                  <IntlMessages id="col.TrnUserId">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                  {trnlist.map((type, key) =>
                    <option key={key} value={type.Id}>{type.UserName}</option>
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
            // title={<IntlMessages id="my_account.convert" />}
            columns={columns}
            options={options}
            data={
              Data.map((lst, key) => {
                return [
                  key + 1 + (PageIndex - 1) * Page_Size,
                  lst.UserName,
                  lst.ReferralPayTypeName,
                  lst.ReferralPayRewards + " " + lst.CommissionCurrecyName,
                  lst.LifeTimeUserCount,
                  lst.TransactionCurrecyName,
                  lst.TrnUserName,
                  lst.FromWalletName,
                  lst.ToWalletName,
                  <span className="date">{changeDateFormat(lst.TrnDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                  lst.CommissionAmount,
                  lst.TransactionAmount,
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

const mapStateToProps = ({ ReferralInvitationsReducer, actvHstrRdcer, drawerclose,authTokenRdcer }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const { getUser } = actvHstrRdcer;
  const { listReferralRewardData, listServiceData, loading } = ReferralInvitationsReducer;
  const {
    menuLoading,
    menu_rights
} = authTokenRdcer;
  return { listReferralRewardData, listServiceData, getUser, loading, drawerclose,    menuLoading,
    menu_rights };
}

export default connect(mapStateToProps, {
  referralRewardReport,
  getUserDataList,
  getServiceList,
  getMenuPermissionByID
})(ListReferralRewards);