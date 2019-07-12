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

class LegalStatementScreen extends Component {

  constructor() {
    super()

    //Define All State initial state
    this.state = {
      legalRes: null,
    }
  }

  componentDidMount = async () => {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    // for check internet condition
    if (await isInternet()) {
      // call api for geting url
      this.props.getPageContents(Method.legalStatement);
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return isCurrentScreen(nextProps);
  };

  componentWillUnmount() {
    // call action for clear Reducer value
    this.props.clearPageContents()
  }

  static getDerivedStateFromProps(props, state) {
    if (isCurrentScreen(props)) {
      var { legalData } = props;

      //check page content is available
      if (legalData.pageContents != null) {
        let legalResponse = legalData.pageContents;
        try {
          //get the response language wise
          return {
            ...state,
            legalRes: legalResponse.locale[R.strings.getLanguage()].content
          };
        } catch (error) {
          return {
            ...state,
            legalRes: null
          }
        }
      }
    }
    return null;
  }

  render() {

    //fetch loading bit for progressbar handling
    let { loading } = this.props.legalData

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
        {/* To set status bar as per our theme */}
        <CommonStatusBar />

        {/* To set toolbar as per our theme */}
        <CustomToolbar title={R.strings.legal_statement} isBack={true} nav={this.props.navigation} />

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
            this.state.legalRes != null && <HtmlViewer applyMargin={true} data={this.state.legalRes} />
          }
        </View>
      </SafeView>
    );
  }
}

function mapStateToProps(state) {
  return {
    //data get from the reducer
    legalData: state.PageContentAppReducer
  }
}
function mapDispatchToProps(dispatch) {
  return {
    // To perform action for Page Contents
    getPageContents: (pageId) => dispatch(getPageContents(pageId)),

    // To perform action for Clear Page Contents
    clearPageContents: () => dispatch(clearPageContents()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LegalStatementScreen)