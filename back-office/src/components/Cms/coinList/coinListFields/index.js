/* 
    Createdby : Dhara Gajera
    CreatedDate : 12-1-2019
    Description :coin fields List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert, Label } from "reactstrap";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";

// page title bar
import { DashboardPageTitle } from '../../DashboardPageTitle';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Import List page Actions...
import { getCoinListFields, updateCoinListFields } from "Actions/CoinListRequest";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
//Validation for coin list fields
const validateCoinListFieldsformInput = require('../../../../validation/CoinListRequest/CoinListRequest');

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
    title: <IntlMessages id="sidebar.cms" />,
    link: '',
    index: 0
  },
  // Added By Megha Kariya (05-02-2019)
  {
    title: <IntlMessages id="sidebar.coinList" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.coinListFields" />,
    link: '',
    index: 0
  },
];
//Table Object...
const columns = [
  {
    name: <IntlMessages id="coinListFields.table.label.FieldsName" />,
    options: { sort: true, filter: false }
  },
  {
    name: <IntlMessages id="coinListFields.table.label.Status" />,
    options: { sort: false, filter: false }
  },
  {
    name: <IntlMessages id="coinListFields.table.label.sortOrder" />,
    options: { sort: false, filter: false }
  }
];

class CoinListFields extends Component {
  constructor(props) {
    super();
    // default ui local state
    this.state = {
      loading: false, // loading activity
      coinListField: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessageForList: "",
      coinList_ID: "",
      btn_disabled: false, // Added By Megha Kariya (08/02/2019)
      menudetail: [],
      Pflag: true,
    };
    this.initState = this.state;
    this.onDismiss = this.onDismiss.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  resetData() {
    this.setState(this.initState);
    this.props.drawerClose();
  }

  onDismiss() {
    let err = delete this.state.errors['message'];
    this.setState({ err_alert: false, errors: err });
  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  toggleCheck = (key, fieldName, value = "") => {
    let tempObj = Object.assign({}, this.state.coinListField);
    if (fieldName == "status") {
      tempObj[key].status = tempObj[key].status ? 0 : 1;
    } else if (fieldName == "sortOrder") {
      tempObj[key][fieldName] = value;
    }
    this.setState((previousState) => {
      return { 
      ...previousState,
      coinListField: tempObj
     };
    });
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('32610157-9208-781E-2F8E-91A151F414BC');
  }

  //Update coin list fields Detail
  updateCoinListFieldsDetail() {
    let data = {
      id: this.state.coinList_ID,
      formfields: this.state.coinListField,
    }
    const { errors, isValid } = validateCoinListFieldsformInput(data);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled

    if (!isValid) {
      this.setState({ loading: true });
      setTimeout(() => {
        this.props.updateCoinListFields(data);
      }, 2000);
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getCoinListFields();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (typeof nextProps.data !== 'undefined' && nextProps.data.responseCode === 0) { //update status success
      this.setState({ showSuccessStatus: true, responseMessageForList: nextProps.data.message })
      setTimeout(function () {
        this.setState({ showSuccessStatus: false, btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
        //this.props.drawerClose();
      }.bind(this), 2000);
    } else if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 1 || nextProps.data.responseCode === 9)) { //update status fail
      this.setState({ showErrorStatus: true, responseMessageForList: nextProps.error.message })
      setTimeout(function () {
        this.setState({ showErrorStatus: false, btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
      }.bind(this), 3000);
    }

    if (typeof nextProps.coinFields_list != 'undefined' && nextProps.coinFields_list.responseCode === 0 && typeof nextProps.coinFields_list.data != 'undefined' && typeof nextProps.coinFields_list.data[0].formfields != 'undefined') {
      this.setState({
        coinList_ID: nextProps.coinFields_list.data[0]._id,
        coinListField: nextProps.coinFields_list.data[0].formfields,
        loading: false,
        btn_disabled: false // Added By Megha Kariya (08/02/2019)
      });
    }

    if (typeof nextProps.coinFields_list != 'undefined' && (nextProps.coinFields_list.responseCode === 1 || nextProps.coinFields_list.responseCode === 9)) { //getlist fail
      if (typeof nextProps.coinFields_list.errors.message != 'undefined' && nextProps.coinFields_list.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.coinFields_list.errors,
        btn_disabled: false
      });
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
    const { loading, err_alert, errors, coinListField, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    const options = {
      responsive: "scroll",
      selectableRows: false,
      pagination: false,
      print: false,
      download: false,
      resizableColumns: false,
      viewColumns: false,
      filter: false,
      search: false,
      rowsPerPage: coinListField.length > 0 ? coinListField.length : 50,
    };
    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="sidebar.coinListFields" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />

          <Fragment>
            {errors.message && <div className="alert_area">
              <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
            </div>}
            <Alert color="danger" isOpen={this.state.showErrorStatus} toggle={(e) => this.setState({ showErrorStatus: false })}>
              {this.state.responseMessageForList}
            </Alert>
            <Alert color="success" isOpen={this.state.showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
              {/* {this.state.responseMessageForList}  */}
              <IntlMessages id="common.form.edit.success" />
            </Alert>
            <Button
              style={{ margin: '10px', zIndex: 9999 }}
              className="pull-right text-white text-bold btn"
              variant="raised"
              color="primary"
              onClick={() => this.updateCoinListFieldsDetail()}
              disabled={btn_disabled} > {/* Added By Megha Kariya (08/02/2019) */}
              <IntlMessages id="button.update" />
            </Button>
            <JbsCollapsibleCard fullBlock>
              <div className="StackingHistory">
                <MUIDataTable
                  // title={<IntlMessages id="sidebar.coinListFields" />}
                  data={
                    coinListField &&
                    coinListField.map((coinList, key) => {
                      return [
                        <Label> {coinList.fieldname} {coinList.Isrequired == 1 ? <span className="text-danger">*</span> : ""}</Label>,
                        <input
                          type="checkbox"
                          name={coinList.fieldname}
                          checked={coinList.status}
                          onChange={() => this.toggleCheck(key, "status")}
                          id={coinList.fieldname}
                        />,
                        <input
                          type="text"
                          name="sortOrder"
                          id={coinList.sortOrder}
                          value={coinList.sortOrder}
                          onChange={(e) => this.toggleCheck(key, "sortOrder", e.target.value)}
                        />
                      ];
                    })
                  }
                  columns={columns}
                  options={options}
                />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}
              </div>
            </JbsCollapsibleCard>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ CoinListRequestReducer, authTokenRdcer }) => {
  var response = {
    loading: CoinListRequestReducer.loading,
    coinFields_list: CoinListRequestReducer.coinFields_list,
    data: CoinListRequestReducer.data,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getCoinListFields,
    updateCoinListFields,
    getMenuPermissionByID,
  }
)(CoinListFields);
