import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme } from '../../controllers/CommonUtils';
import { isInternet } from '../../validations/CommonValidation';
import { getPageContents, clearPageContents } from '../../actions/CMS/PageContentAppActions'
import { connect } from 'react-redux';
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import R from '../../native_theme/R';
import { Method } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class RefundPolicy extends Component {
  constructor() {
    super()

    //Define All State initial state
    this.state = {
      refundRes: null,
    }
  }

  componentDidMount = async () => {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    // for check internet connection
    if (await isInternet()) {

      // call api for geting url
      this.props.getPageContents(Method.refundPolicy);
    }
  }


  static getDerivedStateFromProps(props, state) {

    //check fo current screen
    if (isCurrentScreen(props)) {
      var { refundData } = props;

      //check page content data is available
      if (refundData.pageContents != null) {
        let refundResponse = refundData.pageContents;
        try {

          //get response in language wise
          return {
            ...state,
            refundRes: refundResponse.locale[R.strings.getLanguage()].content
          };
        } catch (error) {
          return {
            ...state,
            refundRes: null
          }
        }
      }
    }
    return null;
  }

  shouldComponentUpdate = (nextProps, _nextState) => {
    return isCurrentScreen(nextProps);
  };

  componentWillUnmount() {
    // call action for clear Reducer value
    this.props.clearPageContents()
  }

  render() {
    //loading bit for handling progress dialog
    let { loading } = this.props.refundData

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

        {/* To set status bar as per our theme */}
        <CommonStatusBar />

        {/* To set toolbar as per our theme */}
        <CustomToolbar title={R.strings.Refund_Policy} isBack={true} nav={this.props.navigation} />

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
            this.state.refundRes != null && <HtmlViewer applyMargin={true} data={this.state.refundRes} />
          }
        </View>
      </SafeView>
    );
  }
}

function mapStateToProps(state) {
  return {
    //data get from the reducer and set to mainurl
    refundData: state.PageContentAppReducer
  }
}
function mapDispatchToProps(dispatch) {
  return {
    //dispatch action
    getPageContents: (pageId) => dispatch(getPageContents(pageId)),
    clearPageContents: () => dispatch(clearPageContents()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RefundPolicy)