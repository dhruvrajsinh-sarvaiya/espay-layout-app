import React, { Component } from 'react';
import { View, } from 'react-native';
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

class TermConditionScreen extends Component {
  constructor() {
    super()

    //Define All State initial state
    this.state = {
      conditionRes: null,
    }
  }

  componentDidMount = async () => {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    // for check internet connection
    if (await isInternet()) {

      // call api for geting url
      this.props.getPageContents(Method.termsAndConditions);
    }
  }

  shouldComponentUpdate = (nextProps, _nextState) => {
    return isCurrentScreen(nextProps);
  };

  static getDerivedStateFromProps(props, state) {

    //check for current screen
    if (isCurrentScreen(props)) {

      // Get All Updated field of Particular actions 
      var { conditionData } = props;

      //check page content data is available
      if (conditionData.pageContents != null) {
        let conditionResponse = conditionData.pageContents;
        try {

          //get response language wise
          return {
            ...state,
            conditionRes: conditionResponse.locale[R.strings.getLanguage()].content
          };
        } catch (error) {
          return {
            ...state,
            conditionRes: null
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
    let { loading } = this.props.conditionData

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

        {/* To set status bar as per our theme */}
        <CommonStatusBar />

        {/* To set toolbar as per our theme */}
        <CustomToolbar title={R.strings.TERMCONDITION} isBack={true} nav={this.props.navigation} />

        <View style={{
          flex: 1,
          justifyContent: 'center',
          marginTop: R.dimens.widget_top_bottom_margin,
          marginBottom: R.dimens.widget_top_bottom_margin,
          marginRight: R.dimens.padding_left_right_margin,
          marginLeft: R.dimens.padding_left_right_margin,
        }}>
          {/* display webview with data if not loading */}
          {loading
            ?
            <ListLoader />
            :
            this.state.conditionRes != null && <HtmlViewer data={this.state.conditionRes} applyMargin={true} />
          }
        </View>
      </SafeView>
    );
  }
}

function mapStateToProps(state) {
  return {
    //data get from the reducer
    conditionData: state.PageContentAppReducer
  }
}
function mapDispatchToProps(dispatch) {
  return {
    //dispatch action 
    getPageContents: (pageId) => dispatch(getPageContents(pageId)),
    clearPageContents: () => dispatch(clearPageContents()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TermConditionScreen)