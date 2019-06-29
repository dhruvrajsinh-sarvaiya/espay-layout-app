/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-09-2018
    UpdatedDate : 02-10-2018
    Description : Terms and Condition
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// app config
import AppConfig from "Constants/AppConfig";

// redux actions
import { getPageContents } from "Actions";

class TermsofService extends Component {
  state = {
    myContnet: []
  };

  componentDidMount() {
    //HAVE TO PASS PROPER PAGE ID TO GET RELAVANT PAGE CONTENT
    setTimeout(() => {
      this.props.getPageContents(AppConfig.pages["terms-of-service"]);
      }, 1000);
  }

  render() {
    const { pageContents } = this.props;
    const html =pageContents != null && pageContents.locale && pageContents.locale[localStorage.getItem('locale')] && pageContents.locale[localStorage.getItem('locale')].content ? pageContents.locale[localStorage.getItem("locale")].content : "";
    return (
        <div className={this.props.match.path =='/terms-of-service' ? 'h-100 position-absolute' :'about-wrapper'}>
          <PageTitleBar
            title={<IntlMessages id="sidebar.termsOfService" />}
            match={this.props.match}
          />
          <div className="terms-wrapper">
            <div className="terms-conditions-rules">
              {ReactHtmlParser(html)}
            </div>
          </div>
        </div>
     
    );
  }
}
// map state to props
const mapStateToProps = ({ pageContentApp }) => {
  const { pageContents } = pageContentApp;
  return { pageContents };
};

export default connect(
  mapStateToProps,
  {
    getPageContents
  }
)(TermsofService);
