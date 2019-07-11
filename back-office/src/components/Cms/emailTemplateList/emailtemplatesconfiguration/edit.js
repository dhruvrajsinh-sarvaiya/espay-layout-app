/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Edit Survey Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

// intl messages
import IntlMessages from "Util/IntlMessages";

import { getEmailTemplateByCategory, updateTemplateConfiguration } from 'Actions/EmailTemplates';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
//Validation for email template Form
const validateForm = require('../../../../validation/EmailTemplates/EmailTemplates');

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
    index: 3
  },
  // Added By Megha Kariya (05-02-2019)
  {
    title: <IntlMessages id="sidebar.templates" />,
    link: '',
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.templatesConfiguration" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.editTemplateConfig" />,
    link: '',
    index: 0
  }
];

class EditEmailTemplateConfig extends Component {
  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      templateName_list: [],
      templatedetail: {
        templateId: "",
        templateType: "",
        templateName: "",
        IsOnOff: ""
      },
      fieldList: {},
      menudetail: [],
      Pflag: true,
    };
    this.initState = {
      loading: false, // loading activity  Added by Jayesh 22-01-2019 for drowerclose issue
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false
    };
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

  //On Update Survey Details
  onUpdateEmailTemplatesConfDetail(key, value) {
    this.setState({
      templatedetail: {
        ...this.state.templatedetail,
        [key]: value
      }
    });
  }

  //Update Survey Detail
  updateEmailTemplatesConfDetail() {

    let data = {
      TemplateType: this.state.templatedetail.templateId,
      TemplateID: this.state.templatedetail.templateName,
      Status: this.state.templatedetail.IsOnOff
    }

    const { errors, isValid } = validateForm.validateUpdateEmailTemplateConfigformInput(data);
    this.setState({ errors: errors, err_alert: true, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled

    if (!isValid) {
      setTimeout(() => {
        this.props.updateTemplateConfiguration(data);
        this.setState({ loading: true });
      }, 2000);
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }

  }

  componentWillMount() {
    this.props.getMenuPermissionByID('9007A014-829A-748F-8707-066209E85C26');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        let ID = this.props.templatesconfigdata.Key;
        if (ID != '') {
          this.props.getEmailTemplateByCategory(ID);
        } else {
          this.resetData();
        }
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 1) { //getlist fail
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors,
        btn_disabled: false // Added By Megha Kariya (08/02/2019)
      });
    }

    if (typeof nextProps.category_templates !== 'undefined' && nextProps.category_templates.ReturnCode === 0) {

      this.setState({
        templatedetail: {
          templateId: this.props.templatesconfigdata.Key,
          templateType: this.props.templatesconfigdata.Value,
          templateName: nextProps.category_templates.TemplateID,
          IsOnOff: nextProps.category_templates.IsOnOff
        },
        templateName_list: nextProps.category_templates.TemplateMasterObj,
        loading: nextProps.loading
      });
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 0) {
      this.setState({ err_msg: '', err_alert: false, loading: nextProps.loading });
      this.resetData();
      this.props.reload();
    }

  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({ open: false });
  }

  // Added By Megha Kariya (05-02-2019)  
  close2Level = () => {
    this.props.close2Level();
    this.setState({ open: false });
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
      return response;
    }
  }

  render() {
    var menudetail = this.checkAndGetMenuAccessDetail('E96EC4E9-03A8-7EF2-4189-36FC11175347');
    const { err_alert, errors, templatedetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    return (
      <div className="jbs-page-content">
        {/* Added By Megha Kariya (05-02-2019) : add close2Level */}
        <DashboardPageTitle title={<IntlMessages id="sidebar.editTemplateConfig" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {(loading || this.props.menuLoading) && <JbsSectionLoader />}

        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}

        <Form className="tradefrm">
          {(menudetail["63882AC0-56B9-8E24-9477-CF6F608932D5"] && menudetail["63882AC0-56B9-8E24-9477-CF6F608932D5"].Visibility === "E925F86B") && //63882AC0-56B9-8E24-9477-CF6F608932D5
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.templateType" /> : </Label>
              <Label>{templatedetail.templateType}</Label>
            </FormGroup>}

          {(menudetail["629A23F0-2D01-3E99-4204-B10F233B7EDB"] && menudetail["629A23F0-2D01-3E99-4204-B10F233B7EDB"].Visibility === "E925F86B") && //629A23F0-2D01-3E99-4204-B10F233B7EDB
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.templateName" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["629A23F0-2D01-3E99-4204-B10F233B7EDB"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="templateName" value={templatedetail.templateName} id="templateName" onChange={(e) => this.onUpdateEmailTemplatesConfDetail('templateName', e.target.value)}>
                <IntlMessages id="traderecon.list.selectall">
                  {(select) =>
                    <option value="">{select}</option>
                  }
                </IntlMessages>
                {this.state.templateName_list.map((template, key) =>
                  <option key={key} value={template.ID}>{template.TemplateType}</option>
                )}
              </Input>
              {errors.templateName && <span className="text-danger"><IntlMessages id={errors.templateName} /></span>}
            </FormGroup>}

          {(menudetail["7A8CC82A-4258-5240-5F38-B28D61DF92B2"] && menudetail["7A8CC82A-4258-5240-5F38-B28D61DF92B2"].Visibility === "E925F86B") && //7A8CC82A-4258-5240-5F38-B28D61DF92B2
            <FormGroup>
              <Label><IntlMessages id="emailtemplate.form.lable.isOnOff" /><span className="text-danger">*</span></Label>
              <Input
                disabled={(menudetail["7A8CC82A-4258-5240-5F38-B28D61DF92B2"].AccessRight === "11E6E7B0") ? true : false}
                type="select" name="IsOnOff" id="IsOnOff" onChange={(e) => this.onUpdateEmailTemplatesConfDetail('IsOnOff', e.target.value)} value={templatedetail.IsOnOff}>
                <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.isOnOff && <span className="text-danger"><IntlMessages id={errors.isOnOff} /></span>}
            </FormGroup>}

          {Object.keys(menudetail).length > 0 &&
            <FormGroup>
              <Button
                className="text-white text-bold btn mr-10"
                variant="raised"
                color="primary"
                onClick={() => this.updateEmailTemplatesConfDetail()}
                disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
              >
                <IntlMessages id="button.update" />
              </Button>

              <Button
                className="text-white text-bold btn mr-10 btn bg-danger text-white"
                variant="raised"
                onClick={this.resetData}
                disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
              >
                <IntlMessages id="button.cancel" />
              </Button>
            </FormGroup>}
        </Form>
      </div>
    );
  }
}
const mapStateToProps = ({ emailtemplatesReducer, authTokenRdcer }) => {

  var response = {
    data: emailtemplatesReducer.data,
    loading: emailtemplatesReducer.loading,
    category_templates: emailtemplatesReducer.category_templates,
    updatestatus: emailtemplatesReducer.updatestatus,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return response;
}

export default withRouter(connect(mapStateToProps, {
  getEmailTemplateByCategory, updateTemplateConfiguration, getMenuPermissionByID
})(EditEmailTemplateConfig));