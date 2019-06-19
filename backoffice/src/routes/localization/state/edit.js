/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 16-10-2018
    UpdatedDate : 16-10-2018
    Description : Localization Edit State Form
*/
import React, { Component,Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label,Alert} from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For Page Actions...
import {updateState,getCountry,getStateById} from 'Actions/Localization';
import { getLanguage } from 'Actions/Language';
import {DebounceInput} from 'react-debounce-input';

//Validation for Page Form
const validateState = require('../../../validation/Localization/state');

function TabContainer({ children }) {
  return (
      <Typography component="div" style={{ padding: 2 * 3 }}>
          {children}
      </Typography>
  );
}

class EditState extends Component {

  constructor(props) {
    super(props);
    
    this.state = { 
        activeIndex: 1,
        statedata : {           
            locale: {
              en:  ""
            },
            stateCode : '',
            countryId : '',
            stateId : '',
            status: ''
        },
        language:[
          {
            id: 1,
            code: "en",
            language_name : "English",
            locale : "en-US,en_US.UTF-8,en_US,en-gb,english",
            status : "1",
            sort_order : "1"
          }
        ],
        countryAll:[],
        errors: {},
        err_alert : false,
        loading: false, // loading activity
    }
    	
  }

   // Handle tab Change 
   handleChange(e, value) {
    this.setState({ activeIndex: value });
  }

  onUpdateStateDetails(key, value , lang='') {

    if(typeof lang!='undefined' && lang!='')
    {
        let statusCopy = Object.assign({}, this.state.statedata);
        statusCopy.locale[lang] = value;
        this.setState(statusCopy);
    }
    else
    {
      this.setState({
        statedata: {
          ...this.state.statedata,
          [key]: value
        }
      });
    }

  }

    onDismiss() {
      this.setState({ err_alert: false });
    }

    updateStateData() {
      const { stateCode, locale, countryId, status } = this.state.statedata;
      const { errors, isValid } = validateState.validateUpdateStateInput(this.state.statedata);
      this.setState({ errors: errors });

      // console.log(isValid);
  
      if (isValid) {

        let data = {
          stateId:  this.state.statedata.stateId,
          countryId,
          locale,
          stateCode,
          status
        }
  
        setTimeout(() => {
          this.setState({ loading: true });
          this.props.updateState(data);
        }, 2000); 
  
      }
  
    }

    componentWillMount() {

      if (typeof this.props.location.state != 'undefined' && this.props.location.state.data.stateId != '') {
        this.props.getLanguage();
        this.props.getStateById(this.props.location.state.data.stateId);
        this.props.getCountry({ page : 'all'});
     } else {
        this.props.history.push('/app/localization/state');
      }

      

    }

    componentWillReceiveProps(nextProps) {


      if(typeof nextProps.localebit != 'undefined' && nextProps.localebit!='' &&  nextProps.localebit==1)
    	{
	      		const locale={};
          	{ 
              	nextProps.language && nextProps.language.map((lang,key) => {
              	locale[lang.code] = ""; })
          	}

          	this.state.statedata.locale = locale;
          
          	this.setState({ 
            	statedata:this.state.statedata
          	});
	  	}

  

      if(typeof nextProps.statesdata !='undefined' && typeof nextProps.statesdata.data!='undefined' && nextProps.statesdata.data !='' && nextProps.statesdata.responseCode == 0)
      {

       // console.log("nextProps.....",nextProps);
        const newlocale={};
        { 
          nextProps.language && nextProps.language.map((lang,key) => {
          newlocale[lang.code]=nextProps.statesdata.data.locale[lang.code]?nextProps.statesdata.data.locale[lang.code]:'';
        })}
  
        this.setState({ 
          statedata: { countryId:  nextProps.statesdata.data.countryId,
                  stateId:  nextProps.statesdata.data.stateId, 
                  locale : newlocale, 
                  stateCode : nextProps.statesdata.data.stateCode, 
                  status : nextProps.statesdata.data.status }
        });
      }

      if(typeof nextProps.countryData != 'undefined' && nextProps.countryData.responseCode == 0)
      {
          this.setState({ 
            countryAll : nextProps.countryData.data
          });
      }

      if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode == 0) {
        this.setState({ loading: false });
        this.props.history.push('/app/localization/state');
      }
      
      if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 1) {
        if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
          this.setState({ err_alert: true, loading: false });
        }
        this.setState({
          errors: nextProps.data.errors, loading: false
        });
      }
      
      this.setState({ 
        loading : nextProps.loading,
        language: nextProps.language
      });
  

    }
  
  render() {
    
    const { locale, stateCode, countryId, status } = this.state.statedata;
    const { countryAll, errors, err_alert, loading, activeIndex,language } = this.state;
  
    return (
      <Fragment>
        <PageTitleBar
          title={<IntlMessages id="states.button.editState" /> }
          match={this.props.match}
        />
        
        <JbsCollapsibleCard heading={<IntlMessages id="states.button.editState" /> }>
        
            {errors.message && <div className="alert_area">
              <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{errors.message}</Alert>
            </div>}   

            <Form>
    
            <div 
                className="border border-primary"
              >
               <AppBar position="static" color="default">
                <Tabs
                className="lng_tab_area"
                value={activeIndex}
                onChange={(e, value) => this.handleChange(e, value)}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
                scrollable
                scrollButtons="auto"
              >
                {language && language.map((lang,key) => (
                    <Tab className="lng_tab" key={key} value={lang.id} title={lang.language_name} label={lang.language_name} icon={<img src={require(`Assets/flag-icons/${lang.code}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />} />
                ))}
                </Tabs>
              </AppBar>
                   
            {language && language.map((lang,key) => {
              if (activeIndex == lang.id) {
                return (
                  <TabContainer key={key}> 

                    <FormGroup>
                      <Label><IntlMessages id="states.stateform.label.state-name" /> ({lang.code}) <span className="text-danger">*</span></Label>
                      <DebounceInput
                          minLength={2}
                          debounceTimeout={300}
                          className="form-control"
                          type="text"
                          name="stateName"
                          id="stateName"
                          maxLength={50} // Added By Megha Kariya (27/02/2019)
                          value={locale && locale[lang.code] || ''}
                          onChange={(e) => this.onUpdateStateDetails("stateName", e.target.value,lang.code)}
                      />
                      {errors && errors[lang.code] &&  errors[lang.code] && <span className="text-danger"><IntlMessages id={errors[lang.code]} /></span>}
                    </FormGroup>

            
                  </TabContainer>
                  );
                }
              })
            }
                 </div> 

                    <FormGroup>
                        <Label><IntlMessages id="states.stateform.label.state-code" /><span className="text-danger">*</span></Label>
                        <DebounceInput
                            minLength={2}
                            debounceTimeout={300}
                            className="form-control"
                            type="text"
                            name="stateCode"
                            id="stateCode"
                            value={stateCode}
                            onChange={(e) => this.onUpdateStateDetails("stateCode", e.target.value)}
                        />
                        {errors.stateCode && <span className="text-danger"><IntlMessages id={errors.stateCode} /></span>}
                    </FormGroup>
                    <FormGroup>
                      <Label><IntlMessages id="states.stateform.label.country-id" /><span className="text-danger">*</span></Label>
                      <Input type="select" name="countryId" id="countryId" value={countryId} onChange={(e) => this.onUpdateStateDetails("countryId", e.target.value)}>
                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                        {countryAll && countryAll.map((list, index) => (
                          <option key={index} value={list.countryId}>{list.locale.en}</option>
                        ))}
                      </Input>
                      {errors.countryId && <small className="form-text text-danger"><IntlMessages id={errors.countryId} /></small>}
                    </FormGroup>
                    <FormGroup>
                            <Label><IntlMessages id="states.stateform.label.state-status" /><span className="text-danger">*</span></Label>
                            <Input type="select" name="status" id="status" value={status} onChange={(e) => this.onUpdateStateDetails("status", e.target.value)}>
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
                      onClick={() => this.updateStateData()}
                    >
                    <IntlMessages id="button.save" />
                    </Button>
                    
                    <Link
                      to="/app/localization/state"
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
        </Fragment>
    );
  }
}

const mapStateToProps = ({ languages, state, country }) => {
  const response = {
    data : state.data,
    countryData : country.country_list,
    statesdata:state.statesdata,
    loading : state.loading,
    language:languages.language,
    localebit:languages.localebit
  }
  
  if(typeof state.localebit != 'undefined' && state.localebit!='')
  {
    response['localebit']=state.localebit;
  }

  return response;

}

export default connect(mapStateToProps,{
  updateState, getLanguage, 
  getCountry,
  getStateById
}) (EditState);
