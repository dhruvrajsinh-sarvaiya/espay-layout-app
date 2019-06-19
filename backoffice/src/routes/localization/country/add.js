/* 
    Createdby : Jayesh Pathak
    Updateby : Kushal Parekh
    CreatedDate : 16-10-2018
    UpdatedDate : 04-12-2018
    Description : Localization Add Country Form
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
import { addNewCountry } from 'Actions/Localization';
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

class AddCountry extends Component {

	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 1,
			countrydata: {
				locale: {
					en: ""
				},
				countryCode: '',
				status: ''
			},
			language: [
				{
					id: 1,
					code: "en",
					language_name: "English",
					locale: "en-US,en_US.UTF-8,en_US,en-gb,english",
					status: "1",
					sort_order: "1"
				}
			],
			errors: {},
			err_alert: false,
			loading: false, // loading activity
		}

		this.onDismiss = this.onDismiss.bind(this);
		this.onChangeAddCountryDetails = this.onChangeAddCountryDetails.bind(this);
		this.addCountryData = this.addCountryData.bind(this);
	}

	// Handle tab Change
	handleChange(e, value) {
		this.setState({ activeIndex: value });
	}

	onChangeAddCountryDetails(key, value, lang = '') {

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
		this.props.getLanguage();
	}

	addCountryData() {
		const { countryCode, locale, status } = this.state.countrydata;
		const { errors, isValid } = validateCountry.validateAddCountryInput(this.state.countrydata);
		this.setState({ errors: errors });

		if (isValid) {
			let data = {
				locale,
				countryCode,
				status
			}
			setTimeout(() => {
				this.props.addNewCountry(data);
				this.setState({ loading: true });
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
			this.props.history.push('/app/localization/country');
		}

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1 && (nextProps.data.responseCode != 9 && nextProps.data.responseCode != 1)) {
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

		this.setState({
			loading: nextProps.loading,
			language: nextProps.language
		});
	}

	render() {

		const { countryCode, locale, status } = this.state.countrydata;
		const { errors, err_alert, loading, activeIndex, language } = this.state;

		return (
			<Fragment>
				<PageTitleBar
					title={<IntlMessages id="countries.button.addCountry" />}
					match={this.props.match}
				/>

				<JbsCollapsibleCard heading={<IntlMessages id="countries.button.addCountry" />}>

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
													value={locale[lang.code]}
													onChange={(e) => this.onChangeAddCountryDetails("countryName", e.target.value, lang.code)}
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
								onChange={(e) => this.onChangeAddCountryDetails("countryCode", e.target.value)}

							/>
							{errors.countryCode && <span className="text-danger"><IntlMessages id={errors.countryCode} /></span>}
						</FormGroup>

						<FormGroup>
							<Label><IntlMessages id="countries.countryform.label.country-status" /><span className="text-danger">*</span></Label>
							<Input type="select" name="status" id="status" value={status} onChange={(e) => this.onChangeAddCountryDetails("status", e.target.value)}>
									<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
									<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								    <IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
									{/* <option value="1">Active</option>
									<option value="0">Inactive</option> */}
							</Input>
							{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
						</FormGroup>

						<FormGroup>
							<Button
								className="text-white text-bold btn mr-10"
								variant="raised"
								color="primary"
								onClick={() => this.addCountryData()}
							>
								<IntlMessages id="button.add" />
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
		loading: country.loading,
		data: country.data,
		language: languages.language,
		localebit: languages.localebit
	};

	if (typeof country.localebit != 'undefined' && country.localebit != '') {
		response['localebit'] = country.localebit;
	}
	return response;
}

export default connect(mapStateToProps, {
	addNewCountry, getLanguage
})(AddCountry);