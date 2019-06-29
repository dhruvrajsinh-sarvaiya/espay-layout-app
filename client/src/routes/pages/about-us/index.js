/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 27-09-2018
    Description : About us static page 
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// app config
import AppConfig from "Constants/AppConfig";

// redux actions
import { getPageContents } from "Actions";

class AboutUS extends Component {
  state = {
    myContnet: [],
    pageContents: {}
  };

  componentDidMount() {
    //HAVE TO PASS PROPER PAGE ID TO GET RELAVANT PAGE CONTENT
    this.props.getPageContents(AppConfig.pages["about-us"]);
    window.scrollTo(0, 0);
  }

  render() {
    const { pageContents } = this.props;
    const html =pageContents != null && pageContents.locale && pageContents.locale[localStorage.getItem('locale')] && pageContents.locale[localStorage.getItem('locale')].content ? pageContents.locale[localStorage.getItem("locale")].content : "";
    return (
        <div className="about-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.aboutUs" />}
            match={this.props.match}
          />
          <div className="terms-wrapper">
            <div className="terms-conditions-rules">
              <JbsCollapsibleCard customClasses="p-30">{ReactHtmlParser(html)}</JbsCollapsibleCard>
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
)(AboutUS);
