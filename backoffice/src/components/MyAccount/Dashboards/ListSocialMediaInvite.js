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
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getReferralInviteByChannel, getPayType, getServiceList } from 'Actions/MyAccount';
import validateServiceTypeForm from "Validations/MyAccount/referral_report.js";
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';

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
      PayType: "",
      Service: "",
      channelId: "",
    },
    errors: '',
    totalCount: 0,
    title: "",
    isDisable: true,
    payTypeList: [],
    serviceData: [],
    showReset: false,
    menudetail: [],
    notificationFlag: true,
    menuLoading: false,
    pagedata: "",
    ApiCallBit: this.props.menuDetail.GUID
  }

  onClick = () => {
    this.setState({ open: !this.state.open })
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
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
    newObj.channelId = this.state.getFilter.channelId;
    this.setState({ showReset: false, getFilter: newObj, isDisable: true, errors: '' });
    this.props.getReferralInviteByChannel(newObj);
  }

  componentWillMount() {
    this.props.getMenuPermissionByID(this.props.menuDetail.GUID); // my account menu permission


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
        this.props.getReferralInviteByChannel(newObj);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.ApiCallBit !== this.props.menuDetail.GUID) {
      this.setState({ ApiCallBit: this.props.menuDetail.GUID })
      this.props.getMenuPermissionByID(this.props.menuDetail.GUID);
    }
    this.setState({ menuLoading: nextProps.menuLoading })

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
        newObj.channelId = this.props.pagedata;
        this.setState({ getFilter: newObj, showReset: false });
        this.props.getReferralInviteByChannel(newObj);
        this.props.getPayType();
        this.props.getServiceList({ PayTypeId: 0 });
        if (this.props.pagedata === 3) {
          this.setState({ title: <IntlMessages id="my_account.facebookShare" /> })
        } else if (this.props.pagedata === 4) {
          this.setState({ title: <IntlMessages id="my_account.twitterShare" /> })
        } else if (this.props.pagedata === 5) {
          this.setState({ title: <IntlMessages id="my_account.linkedinShare" /> })
        } else if (this.props.pagedata === 6) {
          this.setState({ title: <IntlMessages id="my_account.messenger" /> })
        } else if (this.props.pagedata === 7) {
          this.setState({ title: <IntlMessages id="my_account.instaShare" /> })
        } else if (this.props.pagedata === 8) {
          this.setState({ title: <IntlMessages id="my_account.pinterest" /> })
        } else if (this.props.pagedata === 9) {
          this.setState({ title: <IntlMessages id="my_account.telegram" /> })
        }
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }

    const Flage_Comp = this.state.getFilter.channelId !== nextProps.pagedata;
    if (Flage_Comp) {
      let today = new Date();
      today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
      var newObj = Object.assign({}, this.state.getFilter);
      newObj.FromDate = today;
      newObj.ToDate = today;
      newObj.PageIndex = 1;
      newObj.Page_Size = AppConfig.totalRecordDisplayInList;
      newObj.channelId = nextProps.pagedata;
      this.setState({ getFilter: newObj, showReset: false });
      this.props.getReferralInviteByChannel(newObj);
      if (nextProps.pagedata === 3) {
        this.setState({ title: <IntlMessages id="my_account.facebookShare" /> })
      } else if (nextProps.pagedata === 4) {
        this.setState({ title: <IntlMessages id="my_account.twitterShare" /> })
      } else if (nextProps.pagedata === 5) {
        this.setState({ title: <IntlMessages id="my_account.linkedinShare" /> })
      } else if (nextProps.pagedata === 6) {
        this.setState({ title: <IntlMessages id="my_account.messenger" /> })
      } else if (nextProps.pagedata === 7) {
        this.setState({ title: <IntlMessages id="my_account.instaShare" /> })
      } else if (nextProps.pagedata === 8) {
        this.setState({ title: <IntlMessages id="my_account.pinterest" /> })
      } else if (nextProps.pagedata === 9) {
        this.setState({ title: <IntlMessages id="my_account.telegram" /> })
      }
    }
    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false })
    }
    if (nextProps.listReferralInviteByChannelData.ReturnCode === 0) {
      this.setState({
        Data: nextProps.listReferralInviteByChannelData.ReferralChannelList,
        totalCount: nextProps.listReferralInviteByChannelData.TotalCount
      })
    } else if (nextProps.listReferralInviteByChannelData.ReturnCode === 1) {
      var errMsg = nextProps.listReferralInviteByChannelData.ErrorCode === 1 ? nextProps.listReferralInviteByChannelData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.listReferralInviteByChannelData.ErrorCode}`} />;
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
  }

  handlePageChange = (pageNumber) => {
    this.setState({
      getFilter: {
        ...this.state.getFilter,
        PageIndex: pageNumber
      }
    });
    this.props.getReferralInviteByChannel({
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
    this.props.getReferralInviteByChannel({
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
    const { Data, totalCount, title, payTypeList, serviceData, isDisable, errors } = this.state;
    const { drawerClose, loading } = this.props;
    const { PageIndex, Page_Size, FromDate, ToDate, Username, PayType, Service } = this.state.getFilter;
    const { menudetail } = this.state;

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail((menudetail.length) ? menudetail[0].GUID : null); //7E4FF4CD-29E4-6826-7DFE-3A820EB95941
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
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
        title: title,
        link: '',
        index: 2
      }
    ];

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
            this.props.getReferralInviteByChannel({
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
        <WalletPageTitle title={title} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
        {(this.state.menuLoading || loading) && <JbsSectionLoader />}
        {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation */}
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
            // title={title}
            columns={columns}
            options={options}
            data={
              Data.map((lst, key) => {
                return [
                  key + 1,
                  lst.UserName,
                  lst.ChannelTypeName,
                  lst.PayTypeName,
                  lst.Description,
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

const mapStateToProps = ({ ReferralInvitationsReducer, ReferralRewardConfig, drawerclose, authTokenRdcer }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const {
    menuLoading,
    menu_rights
  } = authTokenRdcer;
  const { listReferralInviteByChannelData, listServiceData, loading } = ReferralInvitationsReducer;
  const { payTypeData } = ReferralRewardConfig;
  return {
    listReferralInviteByChannelData, listServiceData, payTypeData, loading, drawerclose, menuLoading,
    menu_rights
  };
}

export default connect(mapStateToProps, {
  getReferralInviteByChannel,
  getPayType,
  getServiceList,
  getMenuPermissionByID
})(ListSocialMediaInvite);