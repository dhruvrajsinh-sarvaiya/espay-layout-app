import React, { Component } from 'react';
import {
  View,
} from 'react-native';
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

class AboutUs extends Component {
  constructor() {
    super()

    //Define All initial State
    this.state = {
      aboutUsRes: null,
    }
  }

  componentDidMount = async () => {
    //Add this method to change theme based on stored theme name.
    changeTheme();
    // for check internet condition
    if (await isInternet()) {
      // call api for geting url
      this.props.getPageContents(Method.aboutUs);
    }
  }

  shouldComponentUpdate = (nextProps, _nextState) => {
    return isCurrentScreen(nextProps);
  };

  static getDerivedStateFromProps(props, state) {
    if (isCurrentScreen(props)) {

      var { aboutUsData } = props;

      //check data is available or not
      if (aboutUsData.pageContents != null) {
        let aboutusResponse = aboutUsData.pageContents;
        try {
          //get response language wise
          return {
            ...state,
            aboutUsRes: aboutusResponse.locale[R.strings.getLanguage()].content
          };
        } catch (error) {
          return {
            ...state,
            aboutUsRes: null
          }
        }
      }
    }
    return null;
  }

  componentWillUnmount() {
    // call action for clear Reducer value 
    this.props.clearPageContents()
  }

  render() {

    //loading bit for handling progress dialog
    let { loading } = this.props.aboutUsData

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

        {/* To set status bar as per our theme */}
        <CommonStatusBar />

        {/* To set toolbar as per our theme */}
        <CustomToolbar title={R.strings.About_Us} isBack={true} nav={this.props.navigation} />

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
            this.state.aboutUsRes != null && <HtmlViewer applyMargin={true} data={this.state.aboutUsRes} />
          }
        </View>
      </SafeView>
    );
  }
}

function mapStateToProps(state) {
  return {
    //data get from the reducer
    aboutUsData: state.PageContentAppReducer
  }
}
function mapDispatchToProps(dispatch) {
  return {
    //dispatch action 
    getPageContents: (pageId) => dispatch(getPageContents(pageId)),
    clearPageContents: () => dispatch(clearPageContents()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutUs)