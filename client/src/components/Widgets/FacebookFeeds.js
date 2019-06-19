/**
  Created By : Megha Kariya
  Date : 13/02/2019
  Facebook Feeds Widget
 */
import React, { Component} from 'react';
import { FacebookProvider, Feed, EmbeddedPost,Page } from 'react-facebook';
import {connect} from 'react-redux';
import {getSocialMedia} from 'Actions/SocialMedia';
import IntlMessages from "Util/IntlMessages";
class FacebookFeeds extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      mediaDetail: [],
      appId:'',
      pageUrl: "",
      social_media_type : "2"
    };
  }

  componentWillMount() {
    this.props.getSocialMedia(this.state.social_media_type);
  }

  componentWillReceiveProps(nextProps) {
    
    if(typeof nextProps.facebookMediaDetail !=='undefined' && nextProps.facebookMediaDetail !== '' && typeof nextProps.facebookMediaDetail[0] !== "undefined" && nextProps.facebookMediaDetail[0] !== '' && typeof nextProps.facebookMediaDetail[0].details !== 'undefined' && nextProps.facebookMediaDetail[0].details !== '')
    {
      this.setState({
        mediaDetail: nextProps.facebookMediaDetail,
        appId: nextProps.facebookMediaDetail[0].details.appId,
        pageUrl: nextProps.facebookMediaDetail[0].details.pageUrl,
      });
    }
  } 
  render() {
    const {mediaDetail} = this.state;
    return (
      <span>
      {mediaDetail && mediaDetail.length > 0 &&
        <FacebookProvider appId={this.state.appId}>
          <Page href={this.state.pageUrl} tabs="timeline" width="500" />
          
        </FacebookProvider>
      }
      {!mediaDetail || mediaDetail.length === 0 &&
        <div height="100">
        <IntlMessages id="sidebar.btnFacebook" />
        </div>
    }
    </span>
    );
    /* return (
      <FacebookProvider appId="1070670509781494">
        <Page href="https://www.facebook.com/Paroexchange-177032669668676/" tabs="timeline" width="500" />
       
       
      </FacebookProvider>
    ); */

    
  }
}

const mapStateToProps = ({socialMedia}) => {
	const { facebookMediaDetail } = socialMedia;
  return { facebookMediaDetail}
}

export default connect(mapStateToProps, {getSocialMedia
})(FacebookFeeds);
