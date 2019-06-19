/* 
    Createdby : dhara gajera
    CreatedDate : 01-12-2018
    Description : Add email template Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert, Row, Col } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For email template Actions...
import { getListTemplates, addNewEmailTemplate, getEmailTemplatesParameters } from 'Actions/EmailTemplates';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
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
    title: <IntlMessages id="sidebar.addTemplate" />,
    link: '',
    index: 0
  }
];

class AddEmailTemplate extends Component {

  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessage: "",
      templateType_list: [],
      addEmailTemplateDetail: { templateName: "", templateType: "", Content: "", AdditionalInfo: "", CommServiceTypeID: 1 },
      addParameterModal: false,
      selectedParameters: null,
      menudetail: [],
      Pflag: true,
    };
    this.initState = {
      activeIndex: 1,
      loading: false, // loading activity  Added by Jayesh 22-01-2019 for drowerclose issue
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      showErrorStatus: false,
      showSuccessStatus: false,
      responseMessage: "",
      // Added By Megha Kariya (04/02/2019)
      addEmailTemplateDetail: { templateName: "", templateType: "", Content: "", AdditionalInfo: "", CommServiceTypeID: 1 },
    };
    this.onChangeAddEmailTemplateDetails = this.onChangeAddEmailTemplateDetails.bind(this);
    this.addEmailTemplateDetail = this.addEmailTemplateDetail.bind(this);
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
  openParameterModal() {
    this.setState({ addParameterModal: true });
  }

  // On Change Add template Details
  onChangeAddEmailTemplateDetails(key, value) {
    this.setState({
      addEmailTemplateDetail: {
        ...this.state.addEmailTemplateDetail,
        [key]: value
      }
    });
  }
  handleChangePair = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  //Add template Detail
  addEmailTemplateDetail() {
    const { CommServiceTypeID, templateName, templateType, Content, AdditionalInfo } = this.state.addEmailTemplateDetail;
    const { errors, isValid } = validateForm.validateNewEmailTemplateformInput(this.state.addEmailTemplateDetail);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (!isValid) {
      let data = {
        CommServiceTypeID,
        TemplateName: templateName,
        TemplateID: templateType,
        Content,
        AdditionalInfo
      }
      setTimeout(() => {
        this.props.addNewEmailTemplate(data);
        this.setState({ loading: true });
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
        this.props.getListTemplates();
        this.props.getEmailTemplatesParameters();
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

    if (typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 0) {
      this.setState({ err_msg: '', err_alert: false });
      //this.props.drawerClose();
      this.resetData();
      this.props.reload();
    }

    if (typeof nextProps.templateType_list != 'undefined' && nextProps.templateType_list.length > 0) {
      this.setState({ templateType_list: nextProps.templateType_list, loading: nextProps.loading });
    }

    if (typeof nextProps.parameters_list != 'undefined' && nextProps.parameters_list.length > 0) {

      let selectedParams = [];
      nextProps.parameters_list.forEach(parmas => {

        if (typeof parmas.ParameterInfo != 'undefined' && parmas.ParameterInfo.length > 0) {
          parmas.ParameterInfo.forEach(element => {
            selectedParams.push({ Name: element.Name, Aliasname: element.Aliasname });
          });
        }

      });

      this.setState({ selectedParameters: selectedParams, loading: nextProps.loading });
    }

  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({
      open: false,
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
            return response = fieldList;
          }
        }
      }
    } else {
      return response;
    }
  }

  render() {
    const { err_alert, errors, addEmailTemplateDetail, loading, selectedParameters } = this.state;
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="emailtemplate.button.addTemplate" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}
        <Alert color="danger" isOpen={this.state.showErrorStatus} toggle={(e) => this.setState({ showErrorStatus: false })}>
          {this.state.responseMessageForList}
        </Alert>
        <Alert color="success" isOpen={this.state.showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
          {this.state.responseMessageForList}
        </Alert>
        <Form className="tradefrm">
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.commServiceType" /><span className="text-danger">*</span></Label>
            <Input type="select" name="CommServiceTypeID" id="CommServiceTypeID" onChange={(e) => this.onChangeAddEmailTemplateDetails('CommServiceTypeID', e.target.value)} value={addEmailTemplateDetail.CommServiceTypeID}>>
                          <IntlMessages id="template.templatetype.sms">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
              <IntlMessages id="template.templatetype.email">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
              {/* <option value="1">SMS</option>
                            <option value="2">Email</option> */}
            </Input>
            {errors.CommServiceTypeID && <span className="text-danger"><IntlMessages id={errors.CommServiceTypeID} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.templateType" /><span className="text-danger">*</span></Label>

            <Input type="select" name="templateType" value={addEmailTemplateDetail.templateType} id="templateType" onChange={(e) => this.onChangeAddEmailTemplateDetails('templateType', e.target.value)}>
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
              value={addEmailTemplateDetail.templateName}
              onChange={(e) => this.onChangeAddEmailTemplateDetails('templateName', e.target.value)}
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
              value={addEmailTemplateDetail.AdditionalInfo}
              onChange={(e) => this.onChangeAddEmailTemplateDetails('AdditionalInfo', e.target.value)}
            />
            {errors.AdditionalInfo && <span className="text-danger"><IntlMessages id={errors.AdditionalInfo} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="emailtemplate.form.lable.content" /> <span className="text-danger">*</span>  <a href="javascript:void(0)" onClick={() => this.openParameterModal()} color="primary" className="caret btn-sm mr-10"><IntlMessages id="emailtemplate.form.lable.showparameters" /></a></Label>
            <JoditEditor
              value={addEmailTemplateDetail.Content}
              onChange={(e) => this.onChangeAddEmailTemplateDetails("Content", e)}
            />
            {errors && errors.Content && <span className="text-danger"><IntlMessages id={errors.Content} /></span>}
          </FormGroup>
          <FormGroup>
            <Button
              className="text-white text-bold btn mr-10"
              variant="raised"
              color="primary"
              onClick={() => this.addEmailTemplateDetail()}
            >
              <IntlMessages id="button.add" />
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
            {selectedParameters !== null &&
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
    template_list: emailtemplatesReducer.templates_list,
    templateType_list: emailtemplatesReducer.templates_listing.Result,
    parameters_list: emailtemplatesReducer.parameters_list.templateParameterInfoList,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,

  };
  return response;
}

export default withRouter(connect(mapStateToProps, {
  addNewEmailTemplate,
  getListTemplates,
  getEmailTemplatesParameters,
  getMenuPermissionByID,
})(AddEmailTemplate));
