/**
 * Language Select Dropdown
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { Badge } from 'reactstrap';
import $ from 'jquery';
import Tooltip from '@material-ui/core/Tooltip';
//Added by salim dt:02/04/2019
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { languageArray } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

// actions // Added by kushal new action getLanguages to get all language pack
import { setLanguage, rtlLayoutAction, getLanguages } from 'Actions';

class LanguageProvider extends Component {

	state = {
		langDropdownOpen: false,
		loading: false
	}

	// function to toggle dropdown menu
	toggle = () => {
		this.setState({
			langDropdownOpen: !this.state.langDropdownOpen
		});
	}

	// on change language
	onChangeLanguage(lang) {
		this.setState({ langDropdownOpen: false });
		this.props.setLanguage(lang);
		// this.props.setLanguage({ PreferedLanguage : lang.locale });
		//if (lang.locale === 'ar' || lang.locale === 'he') {
		if (String(lang.rtlLayout) === "true") {
			this.rtlLayoutHanlder(true);
		} else {
			this.rtlLayoutHanlder(false);
		}
	}

	// For GetLanguage Call Action
	componentWillMount() {
		this.props.getLanguages();
	}

	//Added by salim dt:04/04/2019
	componentWillReceiveProps(nextProps) {
		if (nextProps.langData.ReturnCode === 1 || nextProps.langData.ReturnCode === 9) {
			var errMsg = nextProps.langData.ErrorCode === 1 ? nextProps.langData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.langData.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.langData.ReturnCode === 0) {
			var sucMsg = nextProps.langData.ErrorCode === 1 ? nextProps.langData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.langData.ErrorCode}`} />;
			NotificationManager.success(sucMsg);
		}
	}

	/**
	 * Rtl Layout Event Hanlder
	 * Use to Enable rtl Layout
	 * @param {*object} event
 */
	rtlLayoutHanlder(isTrue) {
		if (isTrue) {
			$("html").attr("dir", "rtl");
			$('body').addClass('rtl');
		} else {
			$("html").attr("dir", "ltr")
			$('body').removeClass('rtl');
		}
		this.props.rtlLayoutAction(isTrue);
	}


	render() {
		const { languages } = this.props;
		const { loading } = this.state;
		// const { locale, languages,rtlLayout } = this.props;
		// localStorage.setItem('locale', locale.locale);
		//Added by salim dt:02/04/2019
		var defaultLang = localStorage.getItem('locale') !== undefined ? localStorage.getItem('locale') : AppConfig.locale.locale;
		var locale = languageArray(defaultLang);

		// if(String(rtlLayout)==="true"){
		if (String(locale['rtlLayout']) === "true") { //Added by salim dt:02/04/2019
			this.rtlLayoutHanlder(true);
		} else {
			this.rtlLayoutHanlder(false);
		}
		//console.log("this.props",this.props);
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<Dropdown nav className="list-inline-item language-dropdown tour-step-5 desktopMode" isOpen={this.state.langDropdownOpen} toggle={this.toggle}>
					<DropdownToggle caret nav className="header-icon language-icon">
						<Tooltip title="Languages" placement="bottom">
							<img src={require(`Assets/flag-icons/${locale.icon}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />
						</Tooltip>
					</DropdownToggle>
					<DropdownMenu>
						<div className="dropdown-content">
							<div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
								<span className="text-white font-weight-bold">Languages</span>
								{/* <Badge color="warning">3 NEW</Badge> */}
							</div>
							<Scrollbars className="jbs-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
								<ul className="list-unstyled mb-0 dropdown-list">
									{languages && languages.map((language, key) => (
										<li key={key} onClick={() => this.onChangeLanguage(language)} className="LanIcon">
											<a href="javascript:void(0)">
												<img
													src={require(`Assets/flag-icons/${language.icon}.png`)} className="mr-10"
													alt="lang-icon"
												/>
												{language.name}
											</a>
										</li>
									))}
								</ul>
							</Scrollbars>
						</div>
					</DropdownMenu>
				</Dropdown>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings
};

export default connect(mapStateToProps, {
	setLanguage,
	rtlLayoutAction,
	getLanguages
})(LanguageProvider);
