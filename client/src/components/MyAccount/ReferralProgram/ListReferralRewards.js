/**
 * Created By Sanjay 
 * Created Date 06/03/19
 * Component For List Referral Reward 
 */
import React, { Component  , Fragment} from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { CustomFooter } from '../Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import { referralRewardReport, getServiceList } from 'Actions/MyAccount';
//for Validation
import validateReferralProgram from '../../../validation/MyAccount/referral_program';

//Added By Tejas For Display Error Message 26/3/2019
import { NotificationManager } from 'react-notifications';

//Columns Object
const columns = [
  {
    name: <IntlMessages id="sidebar.colHash" />
  },
  {
    name: <IntlMessages id="sidebar.colPayType" />
  },
  {
    name: <IntlMessages id="my_account.Reward" />
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
      Page_Size:AppConfig.totalRecordDisplayInList,
      FromDate: "",
      //Service: ""
    },
    isDisable: true,
    serviceData: [],
    showReset: false,
    totalCount: 0,
    errors:{}
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
    //this.props.getServiceList({ PayTypeId: 0 });
    this.props.referralRewardReport(newObj);
  }

  clearFilter = () => {
    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    var newObj = Object.assign({}, this.state.getFilter);
    newObj.FromDate = today;
    newObj.ToDate = today;
    newObj.PageIndex = 1;
    newObj.Page_Size = 10;
    //newObj.Service = "";
    this.setState({ showReset: false, getFilter: newObj, isDisable: true ,errors:{}});
    this.props.referralRewardReport(newObj);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.listReferralRewardData.ReturnCode === 0) {
      this.setState({
        Data: nextProps.listReferralRewardData.ReferralRewardsList,
        totalCount: nextProps.listReferralRewardData.TotalCount
      })
    }
    if (nextProps.listServiceData.ReturnCode === 0 && (nextProps.listServiceData.ReferralServiceDropDownList).length > 0) {
      this.setState({
        serviceData: nextProps.listServiceData.ReferralServiceDropDownList
      })
    }
  }

  getFilterData = () => {

      //Added by Saloni 
    var newObj = Object.assign({}, this.state.getFilter);
    const { isValid, errors } = validateReferralProgram(newObj);
		this.setState({ errors: errors })
    //end

    if (isValid) {
      const { FromDate, ToDate } = this.state.getFilter;
      if (FromDate !== "" && ToDate !== "") {
        this.setState({ showReset: true });
        const currentDate = new Date().toISOString().slice(0, 10) // added by Tejas
        // Added By Tejas For Validating Dates 26/3/2019 --> Start
        if (FromDate > currentDate) {

          NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else if (ToDate < FromDate) {

          NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (ToDate > currentDate) {

          NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else {

          // var newObj = Object.assign({}, this.state.getFilter);
          newObj.PageIndex = 1;
          newObj.Page_Size = AppConfig.totalRecordDisplayInList;
          this.props.referralRewardReport(newObj);
        }

        // Added By Tejas For Validating Dates 26/3/2019 --> End

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

  render() {
    const { Data, totalCount, isDisable,errors } = this.state;
    const { loading } = this.props;
    const { PageIndex, Page_Size, FromDate, ToDate } = this.state.getFilter;
    let today = new Date();
    today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    const options = {
      search: false,
      sort: false,
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
      <Fragment>
        {loading && <JbsSectionLoader />}
       < JbsCollapsibleCard>
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
              <Row>
                <Col md="4" xs="4" sm="4">
                  <FormGroup className="mt-30">
                    <Button className="perverbtn rounded-0 border-0 " disabled={((FromDate === "" || ToDate === "") ? true : isDisable)} onClick={this.getFilterData}><IntlMessages id="widgets.apply" /></Button>
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
          </ JbsCollapsibleCard>
        <div className="StackingHistory statusbtn-comm">
          <MUIDataTable
            // title={<IntlMessages id="my_account.convert" />}
            columns={columns}
            options={options}
            data={
              Data.map((lst, key) => {
                return [
                  key + 1,
                  lst.ReferralPayTypeName,
                  lst.ReferralPayRewards + " " + lst.CommissionCurrecyName,
                  lst.TransactionCurrecyName,
                  lst.TrnUserName,
                  lst.FromWalletName,
                  lst.ToWalletName,
                  <span className="date">{changeDateFormat(lst.TrnDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                  parseFloat(lst.CommissionAmount).toFixed(8),
                  parseFloat(lst.TransactionAmount).toFixed(8),
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
  const { listReferralRewardData, loading } = ReferralReportReducer;
  const { listServiceData } = ReferralProgramReducer;
  return { listReferralRewardData, listServiceData, loading };
}

export default connect(mapStateToProps, {
  referralRewardReport,
  getServiceList
})(ListReferralRewards);
