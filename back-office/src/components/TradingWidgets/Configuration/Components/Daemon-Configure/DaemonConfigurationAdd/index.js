// component for add daemon configuration data 
import React, { Component } from 'react';

// used for connect component
import { connect } from "react-redux";

// used for design
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

import CloseButton from '@material-ui/core/Button';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
  addDaemonData,
  getDaemonData
} from "Actions/DaemonConfigure";

// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// validate request or data onchange of component
import {
  validateOnlyNumeric,
  validateDaemonConfigurationRequest
} from "Validations/DaemonConfigure/DamonConfiguration";

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

// class for add daemn data
class AddDaemonConfiguration extends Component {

  // set default state
  state = {
    daemonConfig: [],
    addDaemonResponse: [],
    daemonIPAddress: "",
    daemonPort: "",
    daemonHost: "",
    daemonStatus: "1",
    addDaemonConfig: false,
    open: false,
    addData: false,
    editDetails: [],
    editData: false,
    fieldList: {},
    notificationFlag: true,
    menudetail: [],
  };
  //added by parth andhariya 
  componentWillMount() {
    this.props.getMenuPermissionByID('7AD7F010-2051-633A-1B25-66CAE2D81208'); // get Trading menu permission
  }
  // close all drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  // close drawer 
  handleClose = () => {
    this.setState({
      open: false,
      confirm: false
    });
  };

  // close drawer and set default state
  closeAddDaemonModal() {
    this.props.drawerClose()
    this.setState({
      addNewDaemonConfigurationForm: false,
      editNewDaemonConfigurationForm: false,
      daemonIPAddress: "",
      daemonPort: "",
      daemonHost: "",
      daemonStatus: "1",
      loader: false,
      errors: {}
    });
  }

  // invoke when component is abuot to get props
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.addDaemon !== 'undefined' && typeof nextProps.addDaemon.ReturnCode !== 'undefined') {
      if (nextProps.addDaemon.ReturnCode === 0) {
        NotificationManager.success(<IntlMessages id="deamon.add.suucess" />);
        this.setState({
          open: false,
          addDaemonConfig: false
        })
        this.props.drawerClose();
        this.props.getDaemonData({});
      } else {
        NotificationManager.error(<IntlMessages id={`error.daemonConfiguration.${nextProps.addDaemon.ErrorCode}`} />);
      }
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

  // call api after validate request
  submitDaemonConfigurationForm() {
    const error = validateDaemonConfigurationRequest(this.state);
    if (error) {
      NotificationManager.error(<IntlMessages id={error} />);
    } else {
      // code for validation
      const addRequest = {
        IPAdd: this.state.daemonIPAddress,
        PortAdd: this.state.daemonPort,
        Url: this.state.daemonHost,
        Status: this.state.daemonStatus,
      }
      this.setState({
        addDaemonConfig: true
      })
      this.props.addDaemonData(addRequest);
    }
  }

  // validate port number
  validatePort = event => {
    if (validateOnlyNumeric(event.target.value) || event.target.value === "") {
      this.setState({
        daemonPort: event.target.value
      });
    }
  };

  // set state on change of text boxes
  onChangeValues(key, value) {
    this.setState({
      ...this.state,
      [key]: value
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
  // renderthe component
  render() {
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail('3D23B8A7-25B8-57B2-510F-475E4F5F9475');//0919F104-5205-15F5-1F35-9F756ED424D2
    return (
      <div className="jbs-page-content">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="sidebar.daemon-configure" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
              mini onClick={() => this.closeAddDaemonModal()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
              onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>
        <Form className="m-10 tradefrm">
          {((menuDetail["F5A16739-5EEA-8D5D-0C5D-803A309446FF"]) && (menuDetail["F5A16739-5EEA-8D5D-0C5D-803A309446FF"].Visibility === "E925F86B")) && //F5A16739-5EEA-8D5D-0C5D-803A309446FF
            <FormGroup row>
              <Label for="Name" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.IPAddress" />
                }
                <span className="text-danger">*</span>
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <Input
                  disabled={(menuDetail["F5A16739-5EEA-8D5D-0C5D-803A309446FF"].AccessRight === "11E6E7B0") ? true : false}
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
          {((menuDetail["EE35000B-3B38-788A-8D1D-EB9AAA979B2E"]) && (menuDetail["EE35000B-3B38-788A-8D1D-EB9AAA979B2E"].Visibility === "E925F86B")) && //EE35000B-3B38-788A-8D1D-EB9AAA979B2E
            <FormGroup row>
              <Label for="Port" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.portAddress" />
                }
                <span className="text-danger">*</span>
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <Input
                  disabled={(menuDetail["EE35000B-3B38-788A-8D1D-EB9AAA979B2E"].AccessRight === "11E6E7B0") ? true : false}
                  type="text"
                  name="daemonPort"
                  id="daemonPort"
                  onChange={this.validatePort}
                  value={this.state.daemonPort}
                />
              </div>
            </FormGroup>
          }
          {((menuDetail["5DCE993A-351A-6FFC-7176-5549A2B83227"]) && (menuDetail["5DCE993A-351A-6FFC-7176-5549A2B83227"].Visibility === "E925F86B")) && //5DCE993A-351A-6FFC-7176-5549A2B83227
            <FormGroup row>
              <Label for="host" className="control-label col">
                {
                  <IntlMessages id="daemonconfigure.url" />
                }
                <span className="text-danger">*</span>
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <Input
                  disabled={(menuDetail["5DCE993A-351A-6FFC-7176-5549A2B83227"].AccessRight === "11E6E7B0") ? true : false}
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
          {((menuDetail["70A60AEA-8184-6C55-5E90-53CF7DCA713B"]) && (menuDetail["70A60AEA-8184-6C55-5E90-53CF7DCA713B"].Visibility === "E925F86B")) && //70A60AEA-8184-6C55-5E90-53CF7DCA713B
            <FormGroup row>
              <Label className="control-label col" for="Price">
                {
                  <IntlMessages id="daemonconfigure.status" />
                }
              </Label>
              <div className="col-md-8 col-sm-9 col-xs-12">
                <FormControl className="">
                  <Input
                    disabled={(menuDetail["70A60AEA-8184-6C55-5E90-53CF7DCA713B"].AccessRight === "11E6E7B0") ? true : false}
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
          {/*Added By Jinesh Bhatt for Add Cancel Button And Change Alignment Of Button Into Center 01-02-2019*/}
          <hr />
          {Object.keys(menuDetail).length > 0 &&
            <FormGroup row>
              <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                <div className="btn_area">
                  <Button variant="raised" color="primary" className="text-white" disabled={this.props.loading} onClick={(e) => this.submitDaemonConfigurationForm(e)}><IntlMessages id="button.add" /></Button>
                  <Button variant="raised" className="btn-danger text-white ml-15" disabled={this.props.loading} onClick={() => this.closeAddDaemonModal()}><IntlMessages id="button.cancel" /></Button>
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
    addDaemon: daemonConfigure.addDaemon,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return responce;
};

// connect action with store for dispatch

export default connect(
  mapStateToProps,
  {
    addDaemonData,
    getDaemonData,
    getMenuPermissionByID
  }
)(AddDaemonConfiguration);
