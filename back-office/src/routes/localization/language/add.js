/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 16-10-2018
    UpdatedDate : 16-10-2018
    Description : Localization Add Language Form
*/
import React, { Component,Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label,Alert} from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For Language Actions...
import {addNewLanguage} from 'Actions/Language';

//Validation for Page Form
const validateLanguage = require('../../../validation/Localization/language');

class AddLanguage extends Component {

  constructor(props) {
    super(props);
    
    this.state = { 
        data : {           
          language_name : '',
          code : '',
          rtlLayout :'false',
          locale : '',
          sort_order : '',
          status: '' 
        },
        errors: {},
        err_alert : false,
        loading: false, // loading activity
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

    onChange(event) {
      let newObj = Object.assign({}, this.state.data);
      newObj[event.target.name] = event.target.value;
      this.setState({ data: newObj });
    }

    onSubmit(event) {
      event.preventDefault();

      const { errors, isValid } = validateLanguage.validateAddLanguageInput(this.state.data);
      this.setState({ errors: errors });
      
      if (isValid) {
        this.setState({ loading: true });
        this.props.addNewLanguage(this.state.data);
      }
    }

    onDismiss() {
      this.setState({ err_alert: false });
    }

    componentWillReceiveProps(nextProps) {

      if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 1) {
        if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
          this.setState({ err_alert: true, loading: false });
        }
        this.setState({
          errors: nextProps.data.errors,
          loading: false
        });
      }


     if(typeof nextProps.addUpdateStatus != 'undefined' && nextProps.addUpdateStatus.responseCode == 0)
     {
         this.setState({ loading: false });
         this.props.history.push('/app/localization/language');
     }
   
    }
  
  render() {
    
    const { language_name, code, locale,rtlLayout, sort_order, status } = this.state.data;
    const { errors, err_alert, loading } = this.state;
  
    return (
      <Fragment>
      <div>
        <PageTitleBar
          title={<IntlMessages id="languages.button.addLanguage" /> }
          match={this.props.match}
        />
        
        <JbsCollapsibleCard heading={<IntlMessages id="languages.button.addLanguage" /> }>
        
            {errors.message && <div className="alert_area">
              <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{errors.message}</Alert>
            </div>}   

            <Form>
    
                     <FormGroup>
                        <Label><IntlMessages id="languages.languageform.label.language-name" /><span className="text-danger">*</span></Label>
                        <Input
                            type="text"
                            name="language_name"
                            id="language_name"
                            value={language_name}
                            onChange={this.onChange}
                        />
                        {errors.language_name && <span className="text-danger"><IntlMessages id={errors.language_name} /></span>}
                    </FormGroup>

                    <FormGroup>
                        <Label><IntlMessages id="languages.languageform.label.language-code" /><span className="text-danger">*</span></Label>
                        <Input
                            type="text"
                            name="code"
                            id="code"
                            value={code}
                            onChange={this.onChange}
                        />
                        {errors.code && <span className="text-danger"><IntlMessages id={errors.code} /></span>}
                    </FormGroup>
					
					          <FormGroup>
                        <Label><IntlMessages id="languages.languageform.label.language-locale" /><span className="text-danger">*</span></Label>
                        <Input
                            type="text"
                            name="locale"
                            id="locale"
                            value={locale}
                            onChange={this.onChange}
                        />
                        {errors.locale && <span className="text-danger"><IntlMessages id={errors.locale} /></span>}
                    </FormGroup>

                    <FormGroup>
                        <Label><IntlMessages id="languages.languageform.label.language-rtlLayout" /><span className="text-danger">*</span></Label>
                        <Input type="select" name="rtlLayout" id="rtlLayout" value={rtlLayout} onChange={this.onChange}>
                          <IntlMessages id="sidebar.no">{(selectOption) => <option value="false">{selectOption}</option>}</IntlMessages>
								          <IntlMessages id="sidebar.yes">{(selectOption) => <option value="true">{selectOption}</option>}</IntlMessages>
                            {/* <option value="false">No</option>
                            <option value="true">Yes</option> */}
                        </Input>
                        {errors.rtlLayout && <span className="text-danger"><IntlMessages id={errors.rtlLayout} /></span>}
                    </FormGroup>
					
					          <FormGroup>
                        <Label><IntlMessages id="languages.languageform.label.language-sort_order" /><span className="text-danger">*</span></Label>
                        <Input
                            type="text"
                            name="sort_order"
                            id="sort_order"
                            value={sort_order}
                            onChange={this.onChange}
                        />
                        {errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
                    </FormGroup>
					
					
                    <FormGroup>
                            <Label><IntlMessages id="languages.languageform.label.language-status" /><span className="text-danger">*</span></Label>
                            <Input type="select" name="status" id="status" value={status} onChange={this.onChange}>
                              <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
									            <IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								              <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                                {/* <option value="">Please Select</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option> */}
                            </Input>
                            {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
                    </FormGroup>

                    <FormGroup>
                    <Button
                      className="text-white text-bold btn mr-10"
                      variant="raised"
                      color="primary"
                      onClick={this.onSubmit}
                    >
                    <IntlMessages id="button.add" />
                    </Button>
                    
                    <Link
                      to="/app/localization/language"
                      className="btn bg-danger text-white"
                      variant="raised"
                      size="large"
                    >
                    <IntlMessages id="button.cancel" /> 
                    </Link>
                  </FormGroup>
                </Form>
                {loading &&
                  <JbsSectionLoader />
                }
        </JbsCollapsibleCard>
      </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ languages }) => {

  const { data, addUpdateStatus, loading } = languages;
  return { data, addUpdateStatus, loading };
}

export default connect(mapStateToProps,{
  addNewLanguage
}) (AddLanguage);
