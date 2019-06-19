/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Edit Survey Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';

import Button from "@material-ui/core/Button";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

// intl messages
import IntlMessages from "Util/IntlMessages";

import { getEmailTemplateById, updateEmailTemplate, getListTemplates } from 'Actions/EmailTemplates';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
//Validation for email template Form
const validateForm = require('../../../validation/EmailTemplates/EmailTemplates');

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
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.templates" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.editTemplate" />,
    link: '',
    index: 0
  }
];

class EditEmailTemplate extends Component {
  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      templateType_list: [],
      templatedetail: {
        templateId: "",
        templateName: "",
        templateType: "",
        Content: "",
        AdditionalInfo: "",
        CommServiceTypeID: "",
        status: ""
      },
      paramDetails: [],
      selectedParameters: null,
      addParameterModal: false,
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

  /**
	 * Open Show Parameters
	 */
  openParameterModal(data) {
    this.setState({ addParameterModal: true, selectedParameters: data });
  }

  //On Update Survey Details
  onUpdateEmailTemplatesDetail(key, value) {
    this.setState({
      templatedetail: {
        ...this.state.templatedetail,
        [key]: value
      }
    });
  }

  //Update Survey Detail
  updateEmailTemplatesDetail() {

    let data = {
      ID: this.state.templatedetail.templateId,
      CommServiceTypeID: this.state.templatedetail.CommServiceTypeID,
      TemplateName: this.state.templatedetail.templateName,
      TemplateID: this.state.templatedetail.templateType,
      AdditionalInfo: this.state.templatedetail.AdditionalInfo,
      Content: this.state.templatedetail.Content
    }

    const { errors, isValid } = validateForm.validateUpdateEmailTemplateformInput(data);
    this.setState({ errors: errors, err_alert: true });

    if (!isValid) {
      setTimeout(() => {
        this.props.updateEmailTemplate(data);
      }, 2000);
    }

  }

  componentWillMount() {
    this.props.getMenuPermissionByID('');
  }

  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        let ID = this.props.templatesdata.ID;
        if (ID != '') {
          this.props.getEmailTemplateById(ID);
          this.props.getListTemplates();
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
        errors: nextProps.data.errors
      });
    }

    if (typeof nextProps.templateType_list != 'undefined' && nextProps.templateType_list.length > 0) {
      this.setState({ templateType_list: nextProps.templateType_list, loading: nextProps.loading });
    }

    if (typeof nextProps.templatedetail != 'undefined' && nextProps.templatedetail != '') {
      this.setState({
        templatedetail: {
          templateId: nextProps.templatedetail.ID,
          templateName: nextProps.templatedetail.TemplateName,
          templateType: nextProps.templatedetail.TemplateID,
          Content: nextProps.templatedetail.Content,
          AdditionalInfo: nextProps.templatedetail.AdditionalInfo,
          CommServiceTypeID: nextProps.templatedetail.CommServiceTypeID,
          Status: nextProps.templatedetail.Status,
        },
        paramDetails: nextProps.templatedetail.ParameterInfo
      });
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 0) {
      this.setState({ err_msg: '', err_alert: false });
      this.resetData();
      this.props.reload();
    }

  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
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
            return response = fieldList;
          }
        }
      }
    } else {
      return response;
    }
  }

  render() {
    const { err_alert, err_msg, errors, templatedetail, loading, paramDetails, selectedParameters } = this.state;
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="emailtemplate.button.editTemplate" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}
        <Form className="tradefrm">
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.commServiceType" /><span className="text-danger">*</span></Label>
            <Input type="select" name="CommServiceTypeID" id="CommServiceTypeID" onChange={(e) => this.onUpdateEmailTemplatesDetail('CommServiceTypeID', e.target.value)} value={templatedetail.CommServiceTypeID}>>
                            <IntlMessages id="template.templatetype.sms">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
              <IntlMessages id="template.templatetype.email">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
              {/* <option value="1">SMS</option>
                            <option value="2">Email</option> */}
            </Input>
            {errors.CommServiceTypeID && <span className="text-danger"><IntlMessages id={errors.CommServiceTypeID} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.templateType" /><span className="text-danger">*</span></Label>

            <Input type="select" name="templateType" value={templatedetail.templateType} id="templateType" onChange={(e) => this.onUpdateEmailTemplatesDetail('templateType', e.target.value)}>
              <IntlMessages id="traderecon.list.selectall">
                {(select) =>
                  <option value="select one">{select}</option>
                }
              </IntlMessages>
              {this.state.templateType_list.map((template, key) =>
                <option key={key} value={template.Key}>{template.Value}</option>
              )}
            </Input>
            {errors.templateType && <span className="text-danger"><IntlMessages id={errors.templateType} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.templateName" /><span className="text-danger">*</span></Label>
            <Input
              type="text"
              name="templateName"
              id="templateName"
              min="0" max="10"
              value={templatedetail.templateName}
              onChange={(e) => this.onUpdateEmailTemplatesDetail('templateName', e.target.value)}
            />
            {errors.templateName && <span className="text-danger"><IntlMessages id={errors.templateName} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.subject" /><span className="text-danger">*</span></Label>
            <Input
              type="text"
              name="AdditionalInfo"
              id="AdditionalInfo"
              min="0" max="10"
              value={templatedetail.AdditionalInfo}
              onChange={(e) => this.onUpdateEmailTemplatesDetail('AdditionalInfo', e.target.value)}
            />
            {errors.AdditionalInfo && <span className="text-danger"><IntlMessages id={errors.AdditionalInfo} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.content" /> <span className="text-danger">*</span><a href="javascript:void(0)" onClick={() => this.openParameterModal(paramDetails)} color="primary" className="caret btn-sm mr-10"><IntlMessages id="emailtemplate.form.lable.showparameters" /></a></Label>
            <JoditEditor
              value={templatedetail.Content}
              onChange={(e) => this.onUpdateEmailTemplatesDetail("Content", e)}
            />
            {errors && errors.Content && <span className="text-danger"><IntlMessages id={errors.Content} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.status" /> : </Label>
            <Label>{templatedetail.Status === 1 ? (
              <IntlMessages id="global.form.status.active" />
            ) : (
                <IntlMessages id="global.form.status.inactive" />
              )}</Label>
          </FormGroup>

          <FormGroup>
            <Button
              className="text-white text-bold btn mr-10"
              variant="raised"
              color="primary"
              onClick={() => this.updateEmailTemplatesDetail()}
            >
              <IntlMessages id="button.update" />
            </Button>

            <Button
              className="text-white text-bold btn mr-10 btn bg-danger text-white"
              variant="raised"
              onClick={this.resetData}
            >
              <IntlMessages id="button.cancel" />
            </Button>

          </FormGroup>
        </Form>
        {(loading || this.props.menuLoading) && <JbsSectionLoader />}
        <Dialog
          onClose={() => this.setState({ addParameterModal: false })}
          open={this.state.addParameterModal}
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogContent>
            {selectedParameters && selectedParameters !== null &&
              <div>
                <div className="clearfix d-flex">
                  <div className="media pull-left">
                    <div className="media-body">
                      {selectedParameters.map((params, key) => {
                        return [
                          <Row key={key}>
                            <Col md={6}><span className="fw-bold">{params.Name}:</span></Col>
                            <Col md={6}>{params.Aliasname}</Col>
                          </Row>
                        ]
                      })}
                    </div>
                  </div>
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
const mapStateToProps = ({ emailtemplatesReducer, authTokenRdcer }) => {
  var response = {
    data: emailtemplatesReducer.data,
    loading: emailtemplatesReducer.loading,
    templatedetail: emailtemplatesReducer.templatedetail.TemplateMasterObj,
    templateType_list: emailtemplatesReducer.templates_listing.Result,
    updatestatus: emailtemplatesReducer.updatestatus,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return response;
}

export default withRouter(connect(mapStateToProps, {
  updateEmailTemplate,
  getEmailTemplateById,
  getListTemplates,
  getMenuPermissionByID,
})(EditEmailTemplate));