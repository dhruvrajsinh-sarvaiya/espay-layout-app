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
import { withRouter, Link } from "react-router-dom";

import Button from "@material-ui/core/Button";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

// intl messages
import IntlMessages from "Util/IntlMessages";

import { getEmailTemplateByCategory,updateTemplateConfiguration } from 'Actions/EmailTemplates';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';

//Validation for email template Form
const validateForm = require('../../../validation/EmailTemplates/EmailTemplates'); 

//BreadCrumbData
const BreadCrumbData = [
  {
      title: <IntlMessages id="sidebar.app" />,
      link : '',
      index:0
  },
  {
      title : <IntlMessages id="sidebar.dashboard" />,
      link : '',
      index:0
  },
  {
      title : <IntlMessages id="sidebar.cms" />,
      link : '',
      index:2
  },
  {
      title : <IntlMessages id="sidebar.templatesConfiguration" />,
      link : '',
      index:1
  },
  {
      title :<IntlMessages id="sidebar.editTemplateConfig" />,
      link : '',
      index : 0
  }
];

class EditEmailTemplateConfig extends Component {
  constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
			loading: false, // loading activity
      errors : {},
      err_msg : "",
      err_alert : true,
      btn_disabled : false,
      templateName_list:[],
			templatedetail: {
        templateId : "",
        templateType : "",
        templateName:"",
        IsOnOff: ""
      }
    };
    this.initState = {
			loading: false, // loading activity  Added by Jayesh 22-01-2019 for drowerclose issue
			errors : {},
			err_msg : "",
			err_alert : true,
			btn_disabled : false
		};
    this.onDismiss = this.onDismiss.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  resetData() {
      this.setState(this.initState);
      this.props.drawerClose();
  }

  onDismiss() {
    let err=delete  this.state.errors['message'];
    this.setState({ err_alert: false, errors:err});
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
      TemplateType:this.state.templatedetail.templateId,
      TemplateID: this.state.templatedetail.templateName,
      Status:this.state.templatedetail.IsOnOff
    }

    const { errors, isValid } = validateForm.validateUpdateEmailTemplateConfigformInput(data);        
    this.setState({ errors : errors, err_alert: true });

    if (!isValid) {
      setTimeout(() => {
          this.props.updateTemplateConfiguration(data);
          this.setState({ loading:true });
      }, 2000);
    }
  
	}

  componentWillMount() {

    let ID = this.props.templatesconfigdata.Key;
    if(ID != '') {
        this.props.getEmailTemplateByCategory(ID);        
    } else {
        this.resetData();
    }
  }

  componentWillReceiveProps(nextProps) {

    if(typeof nextProps.data != 'undefined' && nextProps.data.ReturnCode == 1) { //getlist fail
        if(typeof nextProps.data.errors.message !='undefined' && nextProps.data.errors.message!='')
        {
          this.setState({ err_alert: true});
        }
      this.setState({ 
          errors : nextProps.data.errors
        });
    }
    
    if(typeof nextProps.category_templates !== 'undefined' && nextProps.category_templates.ReturnCode === 0){

      this.setState({ 
        templatedetail: {
          templateId : this.props.templatesconfigdata.Key,
          templateType : this.props.templatesconfigdata.Value,
          templateName: nextProps.category_templates.TemplateID,
          IsOnOff: nextProps.category_templates.IsOnOff
        },
        templateName_list:nextProps.category_templates.TemplateMasterObj,
        loading : nextProps.loading        
      });
    }

    if(typeof nextProps.data != 'undefined' &&  nextProps.data.ReturnCode == 0) {
      this.setState({ err_msg : '', err_alert: false, loading:nextProps.loading  });
      this.resetData();
			this.props.reload();
    }

  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
    this.setState({open: false});
  }
  
  render() {
    const {err_alert, err_msg,errors,templatedetail,loading} = this.state;
    const { drawerClose } = this.props;

    return (
      <div className="jbs-page-content">
      <DashboardPageTitle title={<IntlMessages id="sidebar.editTemplateConfig" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}   
                <Form className="tradefrm">
                     <FormGroup>
                        <Label><IntlMessages id="emailtemplate.form.lable.templateType" /> : </Label>
                        <Label>{templatedetail.templateType}</Label>
                    </FormGroup>
                    <FormGroup>
                        <Label><IntlMessages id="emailtemplate.form.lable.templateName" /><span className="text-danger">*</span></Label>
                      
                        <Input type="select" name="templateName" value={templatedetail.templateName} id="templateName" onChange={(e) => this.onUpdateEmailTemplatesConfDetail('templateName', e.target.value)}>
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
                    </FormGroup>
                  
                    <FormGroup>
                        <Label><IntlMessages id="emailtemplate.form.lable.isOnOff" /><span className="text-danger">*</span></Label>
                        <Input type="select" name="IsOnOff" id="IsOnOff" onChange={(e) => this.onUpdateEmailTemplatesConfDetail('IsOnOff', e.target.value)} 	value={templatedetail.IsOnOff}>
                          <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								          <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                                {/* <option value="1">Active</option>
                                <option value="0">Inactive</option> */}
                         </Input>
                        {errors.isOnOff && <span className="text-danger"><IntlMessages id={errors.isOnOff} /></span>}
                    </FormGroup>
                  
                  <FormGroup>
                    <Button
                      className="text-white text-bold btn mr-10"
                      variant="raised"
                      color="primary"
                      onClick={() => this.updateEmailTemplatesConfDetail()}
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
          {(loading || this.props.menuLoading) &&	<JbsSectionLoader /> }
      </div>
    );
  }
}
const mapStateToProps = ({ emailtemplatesReducer }) => {

  var response = { 
    data: emailtemplatesReducer.data,
    loading: emailtemplatesReducer.loading,
    category_templates:emailtemplatesReducer.category_templates,
    updatestatus:emailtemplatesReducer.updatestatus
  };
 
  return response;
}

export default withRouter(connect(mapStateToProps,{
  getEmailTemplateByCategory,updateTemplateConfiguration
})(EditEmailTemplateConfig));