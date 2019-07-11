/**
 * Auther : Salim Deraiya
 * Created : 14/02/2019
 * Updated By:Saloni Rathod
 * Invite Friends
 */

import React, { Component, Fragment } from "react";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import EmailsWdgt from './EmailsWdgt';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { connect } from "react-redux";
import SocialSharingFeedWdgt from './SocialSharingFeedWdgt';
import { AffiliateSmsPromo,   AffiliateEmailPromo } from "Actions/MyAccount";
import SmsWdgt from './SmsWdgt';

class InviteFriends extends Component {
    constructor() {
        super();
        this.state = {
            errors: {},
            loading: false,
            smsloading:false,
           };
        this.onChange = this.onChange.bind(this);
    }
 onChange(event) {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }
    componentWillReceiveProps(nextProps) {
        //smsloading
        this.setState({ smsloading: nextProps.smsloading,loading:nextProps.loading });
    }
    render() {
        return (
            <Fragment>
                <div className="row">
                {(this.state.smsloading|| this.state.loading) && <JbsSectionLoader />}
                <div className="col-md-4 col-sm-12 ">
                        <JbsCollapsibleCard >
                    <EmailsWdgt />
                        </JbsCollapsibleCard>
                    </div>
                    <div className="col-md-4 col-sm-12">
                <JbsCollapsibleCard  >
                    <SmsWdgt {...this.props} />
                        </JbsCollapsibleCard>
                    </div>
                    <div className="col-md-4 col-sm-12">
                <JbsCollapsibleCard  >
                    <SocialSharingFeedWdgt {...this.props} />
                        </JbsCollapsibleCard>
                        </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ invitefriends }) => {
    const { AffiliateSmsData, smsloading,loading } = invitefriends;
    return { AffiliateSmsData, smsloading,loading };
};

export default connect(mapStateToProps, {
    AffiliateSmsPromo,
    AffiliateEmailPromo
})(InviteFriends);