import React, { Component } from 'react';
import { View, } from 'react-native';
import { getPageContents, clearPageContents } from '../../actions/CMS/PageContentAppActions'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme } from '../../controllers/CommonUtils'
import { isInternet } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import R from '../../native_theme/R';
import { Method } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class TermsOfServiceScreen extends Component {
    constructor() {
        super()

        //Define All State initial state
        this.state = {
            response: null,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // for check internet connection
        if (await isInternet()) {

            // call api for geting url
            this.props.getPageContents(Method.termsOfService);
        }
    }

    shouldComponentUpdate = (nextProps) => {
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount() {
        // call action for clear Reducer value
        this.props.clearPageContents()
    }

    static getDerivedStateFromProps(props, state) {

        //check for current screen
        if (isCurrentScreen(props)) {

            // Get All Updated field of Particular actions 
            var { serviceData } = props;

            // check page content is available
            if (serviceData.pageContents != null) {
                let serviceResponse = serviceData.pageContents;
                try {
                    // get response language wise
                    return {
                        ...state,
                        response: serviceResponse.locale[R.strings.getLanguage()].content
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
        let { loading } = this.props.serviceData

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.terms_of_service} isBack={true} nav={this.props.navigation} />

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
        serviceData: state.PageContentAppReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //dispatch action 
        getPageContents: (pageId) => dispatch(getPageContents(pageId)),
        clearPageContents: () => dispatch(clearPageContents()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TermsOfServiceScreen)