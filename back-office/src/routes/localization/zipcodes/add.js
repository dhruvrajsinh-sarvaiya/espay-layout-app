/* 
    Createdby : Dhara gajera
    CreatedDate : 8/2/2019
    Description : Localization Add zip code Form
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
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

//Import CRUD Operation For Page Actions...
import { addNewZipcode, getCountry, getStateByCountryId, getCitiesByStateId } from 'Actions/Localization';
import { DebounceInput } from 'react-debounce-input';

//Validation for Page Form
const validateZipcodes = require('../../../validation/Localization/zipcodes');

class AddZipCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      zipcodesdata: {
        zipCode: '',
        zipAreaName: '',
        countryId: '',
        stateId: '',
        cityId: '',
        status: '',
      },
      countryAll: [],
      stateAll: [],
      cityAll: [],
      errors: {},
      err_alert: false,
      loading: false, // loading activity
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onChangeAddZipcodesDetails = this.onChangeAddZipcodesDetails.bind(this);
    this.addZipCodesData = this.addZipCodesData.bind(this);

  }

  onChangeAddZipcodesDetails(key, value, lang = '') {

    if (lang != '') {
      let statusCopy = Object.assign({}, this.state.zipcodesdata);
      this.setState(statusCopy);
    }
    else {
      this.setState({
        zipcodesdata: {
          ...this.state.zipcodesdata,
          [key]: value
        }
      });
    }
    if (key == 'countryId') {
      this.props.getStateByCountryId({ countryId: value });
    }

    if (key == 'stateId') {
      this.props.getCitiesByStateId({ stateId: value });
    }
  }

  componentWillMount() {
    this.props.getCountry({ page: 'all' });
  }

  addZipCodesData() {
    const { countryId, stateId, zipCode, zipAreaName, cityId, status } = this.state.zipcodesdata;
    const { errors, isValid } = validateZipcodes.validateAddZipcodesInput(this.state.zipcodesdata);
    this.setState({ errors: errors });
    if (isValid) {
      let data = {
        countryId,
        stateId,
        cityId,
        status,
        zipCode,
        zipAreaName
      }

      setTimeout(() => {
        this.setState({ loading: true });
        this.props.addNewZipcode(data);
      }, 1000);
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
        errors: nextProps.data.errors, loading: false
      });
    }
    if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode == 0) {
      this.setState({ loading: false });
      this.props.history.push('/app/localization/zipcodes');
    }

    if (typeof nextProps.countryData.responseCode != 'undefined' && nextProps.countryData.responseCode == 0) {
      this.setState({
        countryAll: nextProps.countryData.data
      });
    }

    if (typeof nextProps.countrystateData != 'undefined' && nextProps.countrystateData.responseCode == 0) {
      this.setState({
        stateAll: nextProps.countrystateData.data
      });
    }

    if (typeof nextProps.stateCityData != 'undefined' && nextProps.stateCityData.responseCode == 0) {
      this.setState({
        cityAll: nextProps.stateCityData.data
      });
    }

    /*  if (typeof nextProps.cityData != 'undefined' && nextProps.cityData.responseCode == 0) {
       this.setState({
         cityAll: nextProps.cityData.data
       });
     } */

    this.setState({
      loading: nextProps.loading
    });

  }

  render() {

    const { countryId, stateId, zipCode, zipAreaName, cityId, status } = this.state.zipcodesdata;
    const { countryAll, stateAll, cityAll, errors, err_alert, loading } = this.state;

    return (
      <Fragment>
        <PageTitleBar
          title={<IntlMessages id="zipCodes.button.addZipcodes" />}
          match={this.props.match}
        />

        <JbsCollapsibleCard heading={<IntlMessages id="zipCodes.button.addZipcodes" />}>

          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{errors.message}</Alert>
          </div>}

          <Form>
            <FormGroup>
              <Label><IntlMessages id="zipCodes.title.zipcodes" /><span className="text-danger">*</span></Label>
              <DebounceInput
                minLength={2}
                debounceTimeout={300}
                className="form-control"
                type="text"
                name="zipCode"
                id="zipCode"
                value={zipCode}
                onChange={(e) => this.onChangeAddZipcodesDetails("zipCode", e.target.value)}
              />
              {errors.zipCode && <span className="text-danger"><IntlMessages id={errors.zipCode} /></span>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="zipCodes.title.zipAreaName" /><span className="text-danger">*</span></Label>
              <DebounceInput
                minLength={2}
                debounceTimeout={300}
                className="form-control"
                type="text"
                name="zipAreaName"
                id="zipAreaName"
                value={zipAreaName}
                onChange={(e) => this.onChangeAddZipcodesDetails("zipAreaName", e.target.value)}
              />
              {errors.zipAreaName && <span className="text-danger"><IntlMessages id={errors.zipAreaName} /></span>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="cities.cityform.label.country-id" /><span className="text-danger">*</span></Label>
              <Input type="select" name="countryId" id="countryId" value={countryId} onChange={(e) => this.onChangeAddZipcodesDetails("countryId", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                {countryAll && countryAll.map((list, index) => (
                  <option key={index} value={list.countryId}>{list.locale.en}</option>
                ))}
              </Input>
              {errors.countryId && <small className="form-text text-danger"><IntlMessages id={errors.countryId} /></small>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="cities.cityform.label.state-id" /><span className="text-danger">*</span></Label>
              <Input type="select" name="stateId" id="stateId" value={stateId} onChange={(e) => this.onChangeAddZipcodesDetails("stateId", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                {stateAll && stateAll.map((list, index) => (
                  <option key={index} value={list.stateId}>{list.locale.en}</option>
                ))}
              </Input>
              {errors.stateId && <small className="form-text text-danger"><IntlMessages id={errors.stateId} /></small>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="cities.title.cityName" /><span className="text-danger">*</span></Label>
              <Input type="select" name="cityId" id="cityId" value={cityId} onChange={(e) => this.onChangeAddZipcodesDetails("cityId", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                {cityAll && cityAll.map((list, index) => (
                  <option key={index} value={list.cityId}>{list.locale.en}</option>
                ))}
              </Input>
              {errors.cityId && <small className="form-text text-danger"><IntlMessages id={errors.cityId} /></small>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="states.stateform.label.state-status" /><span className="text-danger">*</span></Label>
              <Input type="select" name="status" id="status" value={status} onChange={(e) => this.onChangeAddZipcodesDetails("status", e.target.value)}>
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
                onClick={() => this.addZipCodesData()}
              >
                <IntlMessages id="button.add" />
              </Button>

              <Link
                to="/app/localization/zipcodes"
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

const mapStateToProps = ({ zipcodes, state, country, city }) => {
  const response = {
    data: zipcodes.data,
    countrystateData: state.country_state_list,
    stateCityData: city.state_city_list,
    countryData: country.country_list,
    cityData: city.city_list,
    loading: zipcodes.loading,
  }
  return response;
}

export default connect(mapStateToProps, {
  addNewZipcode,
  getCountry,
  getStateByCountryId,
  getCitiesByStateId //added by dhara gajera 11/2/2019 
})(AddZipCode);