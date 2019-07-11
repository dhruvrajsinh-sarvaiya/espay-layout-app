/* 
    Createdby : Dhara gajera
    CreatedDate : 12-2-2019
    Description : Localization Edit zipcode Form
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
import {getCountry,getStateByCountryId,getCitiesByStateId,updateZipcode,getZipCodeById  } from 'Actions/Localization';
import {DebounceInput} from 'react-debounce-input';

//Validation for Page Form
const validateZipcodes = require('../../../validation/Localization/zipcodes');

class EditZipcode extends Component {

  constructor(props) {
    super(props);

    this.state = {
        zipcodesdata: {
            zipcode: '',
            zipAreaName:'',
            countryId: '',
            stateId: '',
            cityId: '',
            status: '',
            zipcodesId:''
        },
        countryAll: [],
        stateAll: [],
        cityAll:[],
        errors: {},
        err_alert: false,
        loading: false, // loading activity
        langloaded: false,
        countryLoaded: 0,
        stateLoaded: 0,
        cityLoaded: 0,
    }
  }

  onUpdateZipcodeDetails(key, value) {
      this.setState({
        zipcodesdata: {
          ...this.state.zipcodesdata,
          [key]: value
        }
      });

    if (key == 'countryId') {
      this.setState({ stateLoaded: 0 });
      this.props.getStateByCountryId({ countryId: value });
    }
    if (key == 'stateId') {
        this.props.getCitiesByStateId({ stateId: value });
    }
  }

  onDismiss() {
    this.setState({ err_alert: false });
  }

  updateZipcodeData() {
    const {  countryId, stateId, cityId, status,zipcode,zipAreaName,zipcodesId } = this.state.zipcodesdata;
    const { errors, isValid } = validateZipcodes.validateUpdateZipcodeInput(this.state.zipcodesdata);
    this.setState({ errors: errors });
    if (isValid) {
      let data = {
        zipcodesId,
        countryId,
        stateId,
        cityId,
        status,
        zipcode,
        zipAreaName
      }

      setTimeout(() => {
        this.setState({ loading: true });
        this.props.updateZipcode(data);
      }, 2000);
    }
  }
  componentWillMount() {
    if (typeof this.props.location.state != 'undefined' && this.props.location.state.data.zipcodesId != '') {

        this.props.getZipCodeById(this.props.location.state.data.zipcodesId);
        this.props.getCountry({ page: 'all' });
    } else {
      this.props.history.push('/app/localization/zipcodes');
    }
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.zipData != 'undefined' && typeof nextProps.zipData.responseCode != 'undefined' && nextProps.zipData.responseCode == 0 && this.state.cityLoaded == 0) {
      this.setState({
        data: nextProps.zipData.data,
        cityLoaded: 1
      });

      this.props.getStateByCountryId({ countryId: nextProps.zipData.data.countryId });
      this.props.getCitiesByStateId({ stateId: nextProps.zipData.data.stateId });
    }

    //all country
    if (typeof nextProps.countryData.responseCode != 'undefined' && nextProps.countryData.responseCode == 0 && this.state.countryLoaded == 0) {
      this.setState({
        countryAll: nextProps.countryData.data,
        countryLoaded: 1
      });
    }
    if (typeof nextProps.countrystateData.responseCode != 'undefined' && nextProps.countrystateData.responseCode == 0 && this.state.stateLoaded == 0) {
        this.setState({
          stateAll: nextProps.countrystateData.data,
          stateLoaded: 1
        });
      }
    if (typeof nextProps.stateCityData != 'undefined' && nextProps.stateCityData.responseCode == 0) {
        this.setState({
          cityAll: nextProps.stateCityData.data
        });
    }
    
    if (typeof nextProps.zipData != 'undefined' && typeof nextProps.zipData.data != 'undefined' && nextProps.zipData.data != '' && nextProps.zipData.responseCode == 0 && this.state.langloaded == false) {
      this.setState({
        zipcodesdata: {
          zipcodesId: nextProps.zipData.data.zipcodesId,
          countryId: nextProps.zipData.data.countryId,
          stateId: nextProps.zipData.data.stateId,
          cityId: nextProps.zipData.data.cityId,
          status: nextProps.zipData.data.status,
          zipcode: nextProps.zipData.data.zipcode,
          zipAreaName: nextProps.zipData.data.zipAreaName
        },
        langloaded: true
      });
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode == 0) {
      this.setState({ loading: false });
      this.props.history.push('/app/localization/zipcodes');
    }

    if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 1) {
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors
      });
    }

    this.setState({
      loading: nextProps.loading
    });
  }

  render() {

    const { countryId, stateId, status, cityId,zipcode,zipAreaName} = this.state.zipcodesdata;
    const { countryAll, stateAll,cityAll, errors, err_alert, loading, } = this.state;

    return (
      <Fragment>

        <PageTitleBar
          title={<IntlMessages id="zipCodes.button.editZipcodes" />}
          match={this.props.match}
        />

        <JbsCollapsibleCard heading={<IntlMessages id="zipCodes.button.editZipcodes" />}>

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
                name="zipcode"
                id="zipcode"
                value={zipcode}
                onChange={(e) => this.onUpdateZipcodeDetails("zipcode", e.target.value)}
              />
              {errors.zipcode && <span className="text-danger"><IntlMessages id={errors.zipcode} /></span>}
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
                onChange={(e) => this.onUpdateZipcodeDetails("zipAreaName", e.target.value)}
              />
              {errors.zipAreaName && <span className="text-danger"><IntlMessages id={errors.zipAreaName} /></span>}
            </FormGroup>
          <FormGroup>
              <Label><IntlMessages id="cities.cityform.label.country-id" /><span className="text-danger">*</span></Label>
              <Input type="select" name="countryId" id="countryId" value={countryId} onChange={(e) => this.onUpdateZipcodeDetails("countryId", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                {countryAll && countryAll.map((list, index) => (
                  <option key={index} value={list.countryId}>{list.locale.en}</option>
                ))}
              </Input>
              {errors.countryId && <small className="form-text text-danger"><IntlMessages id={errors.countryId} /></small>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="cities.cityform.label.state-id" /><span className="text-danger">*</span></Label>
              <Input type="select" name="stateId" id="stateId" value={stateId} onChange={(e) => this.onUpdateZipcodeDetails("stateId", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                {stateAll && stateAll.map((list, index) => (
                  <option key={index} value={list.stateId}>{list.locale.en}</option>
                ))}
              </Input>
              {errors.stateId && <small className="form-text text-danger"><IntlMessages id={errors.stateId} /></small>}
            </FormGroup>
            <FormGroup>
              <Label><IntlMessages id="cities.title.cityName" /><span className="text-danger">*</span></Label>
              <Input type="select" name="cityId" id="cityId" value={cityId} onChange={(e) => this.onUpdateZipcodeDetails("cityId", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                {cityAll && cityAll.map((list, index) => (
                  <option key={index} value={list.cityId}>{list.locale.en}</option>
                ))}
              </Input>
              {errors.cityId && <small className="form-text text-danger"><IntlMessages id={errors.cityId} /></small>}
            </FormGroup>

            <FormGroup>
              <Label><IntlMessages id="cities.cityform.label.city-status" /><span className="text-danger">*</span></Label>
              <Input type="select" name="status" id="status" value={status} onChange={(e) => this.onUpdateZipcodeDetails("status", e.target.value)}>
                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
								<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
              </Input>
              {errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
            </FormGroup>

            <FormGroup>
              <Button
                className="text-white text-bold btn mr-10"
                variant="raised"
                color="primary"
                onClick={() => this.updateZipcodeData()}
              >
                <IntlMessages id="button.save" />
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

const mapStateToProps = ({ city, state, country,zipcodes }) => {
  const response = {
    countrystateData: state.country_state_list,
    countryData: country.country_list,
    zipData: zipcodes.zipcodesdata,
    data: zipcodes.data,
    loading: zipcodes.loading,
    stateCityData:city.state_city_list,
    cityData: city.city_list,
  }
  return response;
}

export default connect(mapStateToProps, {
  updateZipcode,
  getCountry,
  getStateByCountryId,
  getCitiesByStateId,
  getZipCodeById
})(EditZipcode);
