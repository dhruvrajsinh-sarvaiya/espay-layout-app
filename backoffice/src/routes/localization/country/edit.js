/* 
    Createdby : Jayesh Pathak
    Updateby : Kushal Parekh
    CreatedDate : 16-10-2018
    UpdatedDate : 04-12-2018
    Description : Localization Edit Country Form
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
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
import { getCountryById, updateCountry } from 'Actions/Localization';
import { getLanguage } from 'Actions/Language';
import {DebounceInput} from 'react-debounce-input';

//Validation for Page Form
const validateCountry = require('../../../validation/Localization/country');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 2 * 3 }}>
			{children}
		</Typography>
	);
}

class EditCountry extends Component {

	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 1,
			countrydata: {
				countryId: "",
				locale: {
					en: ""
				},
				countryCode: "",
				status: ""
			},
			errors: {},
			err_alert: false,
			loading: false, // loading activity
			language: [
				{
					id: 1,
					code: "en",
					language_name: "English",
					locale: "en-US,en_US.UTF-8,en_US,en-gb,english",
					status: "1",
					sort_order: "1"
				}
			]
		}
	}

	onDismiss() {
		this.setState({ err_alert: false });
	}

	// Handle tab Change 
	handleChange(e, value) {
		this.setState({ activeIndex: value });
	}

	onUpdateCountryDetail(key, value, lang = '') {
		if (typeof lang != 'undefined' && lang != '') {
			let statusCopy = Object.assign({}, this.state.countrydata);
			statusCopy.locale[lang] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				countrydata: {
					...this.state.countrydata,
					[key]: value
				}
			});
		}
	}

	componentWillMount() {

		if (typeof this.props.location.state != 'undefined' && this.props.location.state.data.countryId != '') {
			this.props.getLanguage();
			this.props.getCountryById(this.props.location.state.data.countryId);
		} else {
			this.props.history.push('/app/localization/country');
		}
	}

	componentWillReceiveProps(nextProps) {

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					locale[lang.code] = "";
				})
			}

			this.state.countrydata.locale = locale;

			this.setState({
				countrydata: this.state.countrydata
			});
		}

		if (typeof nextProps.updatedata != 'undefined' && typeof nextProps.updatedata.data != 'undefined' && nextProps.updatedata.data != '' && nextProps.updatedata.responseCode == 0) {
			const newlocale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					newlocale[lang.code] = nextProps.updatedata.data.locale[lang.code] ? nextProps.updatedata.data.locale[lang.code] : '';
				})
			}

			this.setState({
				countrydata: { countryId: nextProps.updatedata.data.countryId, locale: newlocale, countryCode: nextProps.updatedata.data.countryCode, status: nextProps.updatedata.data.status }
			});
		}

		if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode == 0) {
			this.setState({ loading: false });
			this.props.history.push('/app/localization/country');
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
			loading: nextProps.loading,
			language: nextProps.language
		});
	}

	updateCountryData() {
		const { countryCode, locale, status } = this.state.countrydata;
		const { errors, isValid } = validateCountry.validateUpdateCountryInput(this.state.countrydata);
		this.setState({ errors: errors });

		if (isValid) {
			let data = {
				countryId: this.state.countrydata.countryId,
				locale,
				countryCode,
				status
			}
			setTimeout(() => {
				this.setState({ loading: true });
				this.props.updateCountry(data);
			}, 2000);
		}
	}

	render() {

		const { locale, countryCode, status } = this.state.countrydata;
		const { errors, err_alert, loading, activeIndex, language } = this.state;

		return (
			<Fragment>
				<PageTitleBar
					title={<IntlMessages id="sidebar.editCountry" />}
					match={this.props.match}
				/>

				<JbsCollapsibleCard heading={<IntlMessages id="sidebar.editCountry" />}>

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{errors.message}</Alert>
					</div>}

					<Form>
						<div className="border border-primary">
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
									{language && language.map((lang, key) => (
										<Tab className="lng_tab" key={key} value={lang.id} title={lang.language_name} label={lang.language_name} icon={<img src={require(`Assets/flag-icons/${lang.code}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />} />
									))}
								</Tabs>
							</AppBar>

							{language && language.map((lang, key) => {
								if (activeIndex == lang.id) {
									return (
										<TabContainer key={key}>

											<FormGroup>
												<Label><IntlMessages id="countries.countryform.label.country-name" /> ({lang.code}) <span className="text-danger">*</span></Label>
												<DebounceInput
													minLength={2}
													debounceTimeout={300}
													className="form-control"
													type="text"
													name="countryName"
													id="countryName"
													maxLength={50} // Added By Megha Kariya (27/02/2019)
													value={locale && locale[lang.code] || ''}
													onChange={(e) => this.onUpdateCountryDetail("countryName", e.target.value, lang.code)}
												/>
												{errors && errors[lang.code] && <span className="text-danger"><IntlMessages id={errors[lang.code]} /></span>}
											</FormGroup>
										</TabContainer>
									);
								}
							})}
						</div>

						<FormGroup>
							<Label><IntlMessages id="countries.countryform.label.country-code" /><span className="text-danger">*</span></Label>
							<DebounceInput
								minLength={2}
								debounceTimeout={300}
								className="form-control"
								type="text"
								name="countryCode"
								id="countryCode"
								value={countryCode}
								onChange={(e) => this.onUpdateCountryDetail('countryCode', e.target.value)}
							/>
							{errors.countryCode && <span className="text-danger"><IntlMessages id={errors.countryCode} /></span>}
						</FormGroup>
						<FormGroup>
							<Label><IntlMessages id="countries.countryform.label.country-status" /><span className="text-danger">*</span></Label>
							<Input type="select" name="status" id="status" value={status} onChange={(e) => this.onUpdateCountryDetail('status', e.target.value)}>
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
								onClick={() => this.updateCountryData()}
							>
								<IntlMessages id="button.save" />
							</Button>

							<Link
								to="/app/localization/country"
								className="btn bg-danger text-white"
								variant="raised"
								size="large"
							>
								<IntlMessages id="button.cancel" />
							</Link>
						</FormGroup>
					</Form>
					{loading && <JbsSectionLoader />}
				</JbsCollapsibleCard>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ languages, country }) => {

	var response = {
		data: country.data,
		updatedata: country.updatedata,
		loading: country.loading,
		language: languages.language,
		localebit: languages.localebit
	};

	if (typeof country.localebit != 'undefined' && country.localebit != '') {
		response['localebit'] = country.localebit;
	}
	return response;
}

export default connect(mapStateToProps, {
	getCountryById, updateCountry, getLanguage,
})(EditCountry);