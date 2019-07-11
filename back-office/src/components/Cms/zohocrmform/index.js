/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : CRM Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import Button from "@material-ui/core/Button";


// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';

//Import CRUD Operation For Zoho CRM Form Actions...
import { addNewCrmForm } from 'Actions/ZohoCrmForm';

//Validation for CRM Form
const validateCrmformInput = require('../../../validation/Crmform/Crmform');

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
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.zohocrmform" />,
    link: '',
    index: 0
  }
];

class AddCrmForm extends Component {

  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      loading: false, // loading activity
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      addNewCrmFormDetail: {
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        description: ""
      }
    };
    this.initState = {
      activeIndex: 1,
      loading: false, // loading activity  Added by Jayesh 22-01-2019 for drowerclose issue
      errors: {},
      err_msg: "",
      err_alert: true,
      btn_disabled: false,
      // Added By Megha Kariya (04/02/2019)
      addNewCrmFormDetail: {
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        description: ""
      }
    };
    this.addCrmFormDetail = this.addCrmFormDetail.bind(this);
    this.clearAll = this.clearAll.bind(this);
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

  //On Change Add New CRM Form Details
  onChangeaddNewCrmFormDetails(key, value) {
    this.setState({
      addNewCrmFormDetail: {
        ...this.state.addNewCrmFormDetail,
        [key]: value
      }
    });
  }
  
  clearAll() {
    this.setState({
      addNewCrmFormDetail: {
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        description: ""
      }
})


  }
  //Add CRM Form Detail
  addCrmFormDetail() {
    let data = {
      firstName: this.state.addNewCrmFormDetail.firstName,
      lastName: this.state.addNewCrmFormDetail.lastName,
      company: this.state.addNewCrmFormDetail.company,
      phone: this.state.addNewCrmFormDetail.phone,
      description: this.state.addNewCrmFormDetail.description
    }

    const { errors, isValid } = validateCrmformInput.validateAddCRMInput(data);
    this.setState({ err_alert: true, errors: errors, btn_disabled: true });

    if (isValid) {
      this.props.addNewCrmForm(data);
      this.setState({ loading: true });
    }
    else { // Added By Megha Kariya (08/02/2019)
      this.setState({ btn_disabled: false });
    }
  }

  componentWillReceiveProps(nextProps) {

    if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors,
        btn_disabled: false // Added By Megha Kariya (08/02/2019)
      });
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 0) {
      this.setState({ err_msg: '', err_alert: false, loading: nextProps.loading, btn_disabled: false }); // Added By Megha Kariya (26/02/2019) : add btn_disabled
      this.clearAll();
    }

  }

  closeAll = () => {
    this.setState(this.initState);
    this.props.closeAll();
  }

  render() {

    const { err_alert, errors, addNewCrmFormDetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="zohocrm.form.lable.title" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
        {errors &&  errors.message && <div className="alert_area">
          <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
        </div>}
        <Form className="tradefrm">
          <FormGroup>
            <Label><IntlMessages id="zohocrm.form.lable.firstName" /><span className="text-danger">*</span></Label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              maxLength={30}
              value={addNewCrmFormDetail && addNewCrmFormDetail.firstName}
              onChange={(e) => this.onChangeaddNewCrmFormDetails("firstName", e.target.value)}
            />
            {errors && errors.firstName && <span className="text-danger"><IntlMessages id={errors.firstName} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="zohocrm.form.lable.lastName" /><span className="text-danger">*</span></Label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              maxLength={30}
              value={addNewCrmFormDetail && addNewCrmFormDetail.lastName}
              onChange={(e) => this.onChangeaddNewCrmFormDetails("lastName", e.target.value)}
            />
            {errors && errors.lastName && <span className="text-danger"><IntlMessages id={errors.lastName} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="zohocrm.form.lable.company" /><span className="text-danger">*</span></Label>
            <Input
              type="text"
              name="company"
              id="company"
              maxLength={100}
              value={addNewCrmFormDetail && addNewCrmFormDetail.company}
              onChange={(e) => this.onChangeaddNewCrmFormDetails("company", e.target.value)}
            />
            {errors && errors.company && <span className="text-danger"><IntlMessages id={errors.company} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="zohocrm.form.lable.phone" /><span className="text-danger">*</span></Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              maxLength={15}
              value={addNewCrmFormDetail && addNewCrmFormDetail.phone}
              onChange={(e) => this.onChangeaddNewCrmFormDetails("phone", e.target.value)}
            />
            {errors && errors.phone && <span className="text-danger"><IntlMessages id={errors.phone} /></span>}
          </FormGroup>
          <FormGroup>
            <Label><IntlMessages id="zohocrm.form.lable.description" /><span className="text-danger">*</span></Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              maxLength={200}
              value={addNewCrmFormDetail && addNewCrmFormDetail.description}
              onChange={(e) => this.onChangeaddNewCrmFormDetails("description", e.target.value)}
            />
            {errors && errors.description && <span className="text-danger"><IntlMessages id={errors.description} /></span>}
          </FormGroup>
          <FormGroup>
            <Button
              className="text-white text-bold btn mr-10"
              variant="raised"
              color="primary"
              onClick={() => this.addCrmFormDetail()}
              disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
            >
              <IntlMessages id="button.submit" />
            </Button>

            <Button
              className="btn bg-danger text-white"
              variant="raised"
              color="primary"
              onClick={() => this.clearAll()}
              disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
            >
              <IntlMessages id="button.reset" />
            </Button>

          </FormGroup>
        </Form>
        {loading &&
          <JbsSectionLoader />
        }
      </div>
    );
  }
}

const mapStateToProps = ({ zohocrmReducer }) => {
  var response = {
    data: zohocrmReducer.data,
    loading: zohocrmReducer.loading
  };
  return response;
}

export default connect(mapStateToProps, {
  addNewCrmForm
})(AddCrmForm);