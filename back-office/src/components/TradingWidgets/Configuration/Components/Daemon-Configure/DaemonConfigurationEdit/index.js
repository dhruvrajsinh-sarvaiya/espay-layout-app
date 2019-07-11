// component for daemonf configuration update data 
// import necessary components
import React, { Component } from 'react';

// used for connect component
import { connect } from "react-redux";

// used for design
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

// import button that are used for close button
import CloseButton from '@material-ui/core/Button';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
  editDaemonData,
  getDaemonData
} from "Actions/DaemonConfigure";

// used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// used for apply validation
import {
  validateOnlyNumeric,
  validateDaemonConfigurationRequest
} from "Validations/DaemonConfigure/DamonConfiguration";

// controlls components in form
import FormControl from "@material-ui/core/FormControl";
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';
// style for close button
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

// class for edit daemonf config data
class EditDaemonConfiguration extends Component {

  // constructor and default state 
  constructor(props) {
    super(props)
    if (this.props.selectedData) {
      this.state = {
        daemonConfig: [],
        addDaemonResponse: [],
        daemonIPAddress: this.props.selectedData.IPAdd,
        daemonPort: this.props.selectedData.PortAdd,
        daemonHost: this.props.selectedData.Url,
        daemonStatus: this.props.selectedData.Status,
        editDaemonConfig: false,
        open: false,
        addData: false,
        editDetails: [],
        editData: false,
        selectedId: this.props.selectedData.Id,
        isUpdate: false,
        fieldList: {},
        notificationFlag: true,
        menudetail: [],
      };
    }
  }
  //added by parth andhariya 
  componentWillMount() {
    this.props.getMenuPermissionByID('7AD7F010-2051-633A-1B25-66CAE2D81208'); // get Trading menu permission
  }
  // close all drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      isUpdate: false,
    });
  }

  // usaed for close drawer
  handleClose = () => {
    this.setState({
      open: false,
      confirm: false,
      isUpdate: false,
    });
  };

  // change function name from closeAddDaemonModal to closeEditDaemonModal By Jinesh bhatt Date : 01-02-2019
  closeEditDaemonModal = () => {
    this.props.drawerClose();
    this.setState({
      addNewDaemonConfigurationForm: false,
      editNewDaemonConfigurationForm: false,
      daemonIPAddress: "",
      daemonPort: "",
      daemonHost: "",
      daemonStatus: "1",
      loader: false,
      errors: {},
      selectedId: 0,
      isUpdate: false,
    });
  };

  // invoke when component is about to get props
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.editDaemon !== 'undefined' && typeof nextProps.editDaemon.ReturnCode !== 'undefined') {
      if (nextProps.editDaemon.ReturnCode === 0) {
        NotificationManager.success(<IntlMessages id="deamon.update.suucess" />);
        this.setState({
          open: false,
          editDaemonConfig: false,
          isUpdate: false,
        })
        this.props.drawerClose();
        this.props.getDaemonData({});
      } else {
        NotificationManager.error(<IntlMessages id={`error.daemonConfiguration.${nextProps.editDaemon.ErrorCode}`} />);
        this.setState({
          editDaemonConfig: false,
          isUpdate: false,
        })
      }
    }

    if (nextProps.selectedData) {
      this.setState({
        daemonIPAddress: nextProps.selectedData.IPAdd,
        daemonPort: nextProps.selectedData.PortAdd,
        daemonHost: nextProps.selectedData.Url,
        daemonStatus: nextProps.selectedData.Status,
        selectedId: nextProps.selectedData.Id
      });
    }
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

  // call api and 
  submitDaemonConfigurationForm() {
    const error = validateDaemonConfigurationRequest(this.state);
    if (error) {
      NotificationManager.error(<IntlMessages id={error} />);
    } else {
      if (this.state.isUpdate) {
        // code for validation
        const addRequest = {
          IPAdd: this.state.daemonIPAddress,
          PortAdd: this.state.daemonPort,
          Url: this.state.daemonHost,
          Status: this.state.daemonStatus,
          Id: this.state.selectedId
        }
        this.setState({
          editDaemonConfig: true
        })
        this.props.editDaemonData(addRequest);
      } else {
        NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
      }
    }
  }

  // validation for port number
  validatePort = event => {
    if (validateOnlyNumeric(event.target.value) || event.target.value === "") {
      this.setState({
        daemonPort: event.target.value,
        isUpdate: true,
      });
    }
  };

  // set state for textboxes 
  onChangeValues(key, value) {
    this.setState({
      ...this.state,
      [key]: value,
      isUpdate: true,
    });
  }
  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
    var response = {};
    var index;
    const { menudetail } = this.state;
    if (menudetail.length) {
      for (index in menudetail) {
        if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
          if (menudetail[index].Fields && menudetail[index].Fields.length) {
            var fieldList = {};
            menudetail[index].Fields.forEach(function (item) {
              fieldList[item.GUID.toUpperCase()] = item;
            });
            response = fieldList;
          }
        }
      }
    }
    return response;
  }
  // renders the component
  render() {
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail('642D9BE4-2E44-55BA-3597-15B4573E869F');//642D9BE4-2E44-55BA-3597-15B4573E869F
    const { drawerClose } = this.props;
    // returns the component
    return (
      <div className="jbs-page-content">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="sidebar.daemon-configure" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>
        <Form className="m-10 tradefrm">
          {((menuDetail["80015A85-6725-3B03-12EF-0F6D25DDA7B6"]) && (menuDetail["80015A85-6725-3B03-12EF-0F6D25DDA7B6"].Visibility === "E925F86B")) && //80015A85-6725-3B03-12EF-0F6D25DDA7B6
            <FormGroup row>
              <Label for="Name" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.IPAddress" />
                }
                <span className="text-danger">*</span>
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <Input
                  disabled={(menuDetail["80015A85-6725-3B03-12EF-0F6D25DDA7B6"].AccessRight === "11E6E7B0") ? true : false}
                  type="text"
                  name="daemonIPAddress"
                  id="daemonIPAddress"
                  onChange={e =>
                    this.onChangeValues("daemonIPAddress", e.target.value)
                  }
                  value={this.state.daemonIPAddress}
                />
              </div>
            </FormGroup>
          }
          {((menuDetail["ED06D743-05FB-8FF5-91C3-12EF18EE8E62"]) && (menuDetail["ED06D743-05FB-8FF5-91C3-12EF18EE8E62"].Visibility === "E925F86B")) && //ED06D743-05FB-8FF5-91C3-12EF18EE8E62
            <FormGroup row>
              <Label for="Port" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.portAddress" />
                }
                <span className="text-danger">*</span>
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <Input
                  disabled={(menuDetail["ED06D743-05FB-8FF5-91C3-12EF18EE8E62"].AccessRight === "11E6E7B0") ? true : false}
                  type="text"
                  name="daemonPort"
                  id="daemonPort"
                  onChange={this.validatePort}
                  value={this.state.daemonPort}
                />
              </div>
            </FormGroup>
          }
          {((menuDetail["A81CE8D9-0760-2430-2D8D-8D47EA910A4C"]) && (menuDetail["A81CE8D9-0760-2430-2D8D-8D47EA910A4C"].Visibility === "E925F86B")) && //A81CE8D9-0760-2430-2D8D-8D47EA910A4C
            <FormGroup row>
              <Label for="host" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.url" />
                }
                <span className="text-danger">*</span>
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <Input
                  disabled={(menuDetail["A81CE8D9-0760-2430-2D8D-8D47EA910A4C"].AccessRight === "11E6E7B0") ? true : false}
                  type="text"
                  name="daemonHost"
                  id="daemonHost"
                  onChange={e =>
                    this.onChangeValues("daemonHost", e.target.value)
                  }
                  value={this.state.daemonHost}
                />
              </div>
            </FormGroup>
          }
          {((menuDetail["22A9C4DB-25A2-1677-3CAA-2091E3213CDC"]) && (menuDetail["22A9C4DB-25A2-1677-3CAA-2091E3213CDC"].Visibility === "E925F86B")) && //22A9C4DB-25A2-1677-3CAA-2091E3213CDC
            <FormGroup row>
              <Label for="Price" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.status" />
                }
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <FormControl className="">
                  <Input
                    disabled={(menuDetail["22A9C4DB-25A2-1677-3CAA-2091E3213CDC"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="daemonStatus"
                    value={this.state.daemonStatus}
                    onChange={e =>
                      this.onChangeValues("daemonStatus", e.target.value)
                    }
                  >
                    <IntlMessages id="daemonconfigure.status.1">
                      {(status1) =>
                        <option value="1">{status1}</option>
                      }
                    </IntlMessages>
                    <IntlMessages id="daemonconfigure.status.0">
                      {(select0) =>
                        <option value="0">{select0}</option>
                      }
                    </IntlMessages>
                  </Input>
                </FormControl>
              </div>
            </FormGroup>
          }
          <hr />
          {Object.keys(menuDetail).length > 0 &&
            <FormGroup row>
              <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                <div className="btn_area">
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white"
                    onClick={(e) => this.submitDaemonConfigurationForm(e)}
                    disabled={this.props.loading}
                  >
                    <IntlMessages id="sidebar.pairConfiguration.button.update" />
                  </Button>
                  <Button
                    variant="raised"
                    className="btn-danger text-white ml-15"
                    onClick={() => this.closeEditDaemonModal()}
                    disabled={this.props.loading}
                  >
                    <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                  </Button>
                </div>
              </div>

            </FormGroup>
          }

        </Form>
      </div>
    )
  }
}

// Set Props when actions are dispatch
const mapStateToProps = ({ daemonConfigure, authTokenRdcer }) => {
  var responce = {
    loading: daemonConfigure.loading,
    editDaemon: daemonConfigure.editDaemon,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return responce;
};

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    editDaemonData,
    getDaemonData,
    getMenuPermissionByID
  }
)(EditDaemonConfiguration);
