/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 20-09-2018
    UpdatedDate : 27-09-2018
    Description : News pages use NewsList and NewsDetail Page Component
*/
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

//Import NewsList Component
import NewsList from "Components/News/NewsList";

//Widgets
import { Announcement } from "Components/Widgets";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// Added By Megha Kariya (13/02/2019)
import {
  TwitterFeeds,
  FacebookFeeds
} from "Components/Widgets";
export default class News extends Component {
  render() {
    
    return (
      
      <div className="about-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.news" />}
          match={this.props.match}
        />
        <div className="news-dashboard-wrapper">
            <div className="row news-content">
              <JbsCollapsibleCard
                heading={<IntlMessages id="news.title" />}  
                colClasses="col-sm-12 col-md-6 col-lg-6"
              >
                <NewsList {...this.props}/>
              </JbsCollapsibleCard>

              <JbsCollapsibleCard
                heading={<IntlMessages id="widget.annoucement.title" />}
                colClasses="col-sm-12 col-md-6 col-lg-6"
              >
                <Announcement {...this.props}/>
              </JbsCollapsibleCard>
            </div>

            {/* Added By Megha Kariya (13/02/2019) */}
            <div className="row news-content">
              <JbsCollapsibleCard
                colClasses="col-sm-12 col-md-4 col-lg-4 w-8-full"
                fullBlock heading={<IntlMessages id="sidebar.btnTwitter" />}
              >
                <TwitterFeeds />
              </JbsCollapsibleCard>
              <JbsCollapsibleCard
                colClasses="col-sm-12 col-md-4 col-lg-4 w-8-full"
                fullBlock
                heading={<IntlMessages id="sidebar.btnFacebook" />}
              >
                <FacebookFeeds />
              </JbsCollapsibleCard>
            </div>
        </div>
      </div>
      
    );
  }
}
