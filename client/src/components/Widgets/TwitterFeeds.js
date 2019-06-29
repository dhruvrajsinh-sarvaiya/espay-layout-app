/**
 * Twitter Feeds Widget
 */
// changed by Megha Kariya (13/02/2019) : Twitter feeds as per configuration
import React, { Component } from 'react';
import { Timeline } from 'react-twitter-widgets'
import { connect } from 'react-redux';
import { getSocialMedia } from 'Actions/SocialMedia';
import IntlMessages from "Util/IntlMessages";
class TwitterFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mediaDetail: [],
            username: '',
            source: "",
            social_media_type: "1"
        };
    }

    componentWillMount() {
        this.props.getSocialMedia(this.state.social_media_type);
    }

    componentWillReceiveProps(nextProps) {

        if (typeof nextProps.twitterMediaDetail !== 'undefined' && nextProps.twitterMediaDetail !== '' && typeof nextProps.twitterMediaDetail[0] !== "undefined" && nextProps.twitterMediaDetail[0] !== '' && typeof nextProps.twitterMediaDetail[0].details !== 'undefined' && nextProps.twitterMediaDetail[0].details !== '') {
            this.setState({
                mediaDetail: nextProps.twitterMediaDetail,
                username: nextProps.twitterMediaDetail[0].details.username,
                source: nextProps.twitterMediaDetail[0].details.source,
            });
        }
    }
    render() {

        const { username, source, mediaDetail } = this.state;
        return (
            <span>
                {mediaDetail && mediaDetail.length > 0 &&
                    <Timeline
                        dataSource={{
                            sourceType: source,
                            screenName: username
                        }}
                        options={{
                            username: username,
                            height: '400'
                        }}
                    />
                }
                {!mediaDetail || mediaDetail.length === 0 &&
                    <div>
                        <IntlMessages id="sidebar.btnTwitter" />
                    </div>
                }
            </span>
        );
    }
}
const mapStateToProps = ({ socialMedia }) => {
    const { twitterMediaDetail } = socialMedia;
    return { twitterMediaDetail }
}

export default connect(mapStateToProps, { getSocialMedia })(TwitterFeed);
