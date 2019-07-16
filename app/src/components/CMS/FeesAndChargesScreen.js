import React, { Component } from 'react';
import {
	View,
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import { isInternet } from '../../validations/CommonValidation';
import { getPageContents, clearPageContents } from '../../actions/CMS/PageContentAppActions'
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import R from '../../native_theme/R';
import { Method } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

//style for HtmlViewer
let htmlStyle =
	`<style>
	
   h4 {
		color:`+ R.colors.accent + `!important;
		font-size:  `+ R.dimens.mediumText + `!important;
    }
   tr {
		width: '100%'
        display: flex;
        flex-direction: row;
	    outline: none;
        box-sizing: border-box;
		font-size:  `+ R.dimens.secondCurrencyText + `!important;
		vertical-align: top;
    }
    table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 1rem;
        border-collapse: collapse;
        outline: none;
		box-sizing: border-box;
	}
    th {
		background-color:  `+ R.colors.accent + ` !important;
		color: `+ R.colors.white + ` !important;
        padding: 0.75rem;
    	border: 1px solid `+ R.colors.textSecondary + `  !important;
		border-top-width: 1px;
        border-right-width: 1px;
        border-bottom-color: rgb(235, 237, 242);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-width: 1px;
    }
        
    span {
        font-size:  `+ R.dimens.smallText + `!important;
        display: block;
		color:`+ R.colors.textSecondary + `!important;
		font-size:  `+ R.dimens.smallText + ` !important;
        margin-bottom: 1.875rem;
        margin-right: 1.875rem
        text-transform: capitalize;
        outline: none;
        box-sizing: border-box;
    }
    td {
		border: 1px solid `+ R.colors.textSecondary + `  !important;
		color: `+ R.colors.textSecondary + ` !important;
		font-size:  `+ R.dimens.smallestText + ` !important;
		padding: 0.75rem;
        vertical-align: top;
        border-top: 1px solid #EBEDF2;
        vertical-align: middle;
        font-size: 14px;
        outline: none;
		box-sizing: border-box;
		text-transform: capitalize;
    }
    img {
        vertical-align: middle;
        border-style: none;
	}
	thead {
		outline: none;
		box-sizing: border-box;
	}
</style>`

class FeesAndChargesScreen extends Component {

	constructor() {
		super()

		//Define All State initial state
		this.state = {
			response: []
		}
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// for check internet connection
		if (await isInternet()) {

			// call api for geting fees and chagres data
			this.props.getPageContents(Method.feesAndCharges);
		}
	}
	componentWillUnmount() {

		// call action for clear Reducer value
		this.props.clearPageContents()
	}
	shouldComponentUpdate = (nextProps, nextState) => {
		return isCurrentScreen(this.props);
	};

	static getDerivedStateFromProps(props, state) {

		//check for current screen
		if (isCurrentScreen(props)) {
			var { data } = props;

			//check page content is available
			if (data.pageContents != null) {
				let response = data.pageContents;
				try {
					let tempRes = response.locale[R.strings.getLanguage()].content

					//for table view layout
					tempRes = tempRes.replace('<thead>\n', '')
					tempRes = tempRes.replace('<thead>\n', '')
					//concate response with our custom style
					return {
						...state,
						response: htmlStyle + tempRes
					};
				} catch (error) {
					return {
						...state,
						response: null
					}
				}
			}
		}
		return null;
	}

	render() {

		//loading bit for handling progress dialog
		let { loading } = this.props.data

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
			
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar title={R.strings.fees_charges} isBack={true} nav={this.props.navigation} />

				<View style={{
					flex: 1,
					justifyContent: 'center',
					marginTop: R.dimens.widget_top_bottom_margin,
					marginBottom: R.dimens.widget_top_bottom_margin,
					marginLeft: R.dimens.padding_left_right_margin,
					marginRight: R.dimens.padding_left_right_margin
				}}>
					{/* display webview with data if not loading */}
					{loading
						?
						<ListLoader />
						:
						this.state.response != null && <HtmlViewer applyMargin={true} data={this.state.response} />
					}
				</View>
			</SafeView>
		);
	}
}

function mapStateToProps(state) {
	return {
		//data get from the reducer
		data: state.PageContentAppReducer
	}
}
function mapDispatchToProps(dispatch) {
	return {
		//dispatch action
		getPageContents: (pageId) => dispatch(getPageContents(pageId)),
		clearPageContents: () => dispatch(clearPageContents()),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(FeesAndChargesScreen)