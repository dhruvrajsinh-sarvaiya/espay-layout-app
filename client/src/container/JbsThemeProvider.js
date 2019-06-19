/**
 * Jbs Theme Provider
 */
import React, { Component, Fragment } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

// App locale
import AppLocale from '../lang';
/*Test With json file code */
//import AppLocale from '../translations';
// import messages_de from "../translations/locales/de_DE.json";
// import messages_en from "../translations/locales/en_US.json";

// import {addLocaleData} from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import de from 'react-intl/locale-data/de';

// addLocaleData([...en, ...de]);

// const messages = {
//     'de': messages_de,
//     'en': messages_en
// };

// themes
import primaryTheme from './themes/primaryTheme';
import darkTheme from './themes/darkTheme';
import secondaryTheme from './themes/secondaryTheme';
//Added by salim dt:02/04/2019
import { languageArray } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';


class JbsThemeProvider extends Component {

	render() {
		// const { locale, darkMode, rtlLayout, activeTheme, children } = this.props;
		// const currentAppLocale = AppLocale[locale.locale];
		//Added by salim dt:02/04/2019
		const { darkMode, activeTheme, children } = this.props;
		const defaultLang = localStorage.getItem('locale') !== null ? localStorage.getItem('locale') : AppConfig.locale.locale;
		const locale = languageArray(defaultLang);
		const currentAppLocale = AppLocale[defaultLang];
		const rtlLayout = locale.hasOwnProperty('rtlLayout') ? locale['rtlLayout'] : 0;
		//console.log("===currentAppLocale===",currentAppLocale);
		// theme changes
		let theme = '';
		switch (activeTheme.id) {
			case 1:
				theme = primaryTheme
				break;
			case 2:
				theme = secondaryTheme
				break;
			default:
				break;
		}

		if (darkMode) {
			theme = darkTheme
		}

		if (rtlLayout) {
			theme.direction = 'rtl'
		} else {
			theme.direction = 'ltr'
		}
		return (
			<MuiThemeProvider theme={theme}>
				<IntlProvider
					locale={currentAppLocale.locale}
					messages={currentAppLocale.messages}
				>
					<Fragment>
						{children}
					</Fragment>
				</IntlProvider>
			</MuiThemeProvider>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings
}

export default connect(mapStateToProps)(JbsThemeProvider);
