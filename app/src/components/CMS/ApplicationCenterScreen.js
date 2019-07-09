import React, { Component } from 'react';
import { View } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import { isInternet } from '../../validations/CommonValidation';
import { getPageContents, clearPageContents } from '../../actions/CMS/PageContentAppActions'
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import R from '../../native_theme/R';
import { Method } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class ApplicationCenterScreen extends Component {

  constructor(props) {
    super(props)

    //Define initial State
    this.state = {
      response: null,
    }
  }

  componentDidMount = async () => {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    //Check NetWork is Available or not
    if (await isInternet()) {

      //call api for get applicationCenter data 
      this.props.getPageContents(Method.applicationCenter);
    }
  }

  shouldComponentUpdate = (nextProps, _nextState) => {
    return isCurrentScreen(nextProps);
  };

  static getDerivedStateFromProps(props, state) {

    //check for current screen
    if (isCurrentScreen(props)) {

      //Get All Updated Feild of Particular actions
      var { data } = props;

      //check data is available or not
      if (data.pageContents != null) {

        //Store Api Response Field and display in Screen.
        let response = data.pageContents;
        try {
          //get response language wise
          return {
            ...state,
            response: response.locale[R.strings.getLanguage()].content
          };
        } catch (error) {
          return { ...state, response: null }
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
    let { loading } = this.props.data

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

        {/* To set status bar as per our theme */}
        <CommonStatusBar />

        {/* To set toolbar as per our theme */}
        <CustomToolbar title={R.strings.application_center} isBack={true} nav={this.props.navigation} />

        <View style={{
          flex: 1,
          justifyContent: 'center',
          marginTop: R.dimens.widget_top_bottom_margin,
          marginBottom: R.dimens.widget_top_bottom_margin,
          marginLeft: R.dimens.padding_left_right_margin,
          marginRight: R.dimens.padding_left_right_margin
        }}>
          {/* dipslay Progressbar if loading =true else display data in htmlviewer */}
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
    //Updated Data get from reducer For applicationCenter page
    data: state.PageContentAppReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // performs Action for get applicationCenter page data.
    getPageContents: (pageId) => dispatch(getPageContents(pageId)),

    // performs Action for clear applicationCenter page data from reducer.
    clearPageContents: () => dispatch(clearPageContents()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationCenterScreen)