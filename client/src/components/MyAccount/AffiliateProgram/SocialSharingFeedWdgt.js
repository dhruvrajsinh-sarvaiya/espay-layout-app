/**
 * Author : Saloni Rathod
 * Created : 04/03/2019
 *  Affiliate  invite friends by social sharing
*/
import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { connect } from "react-redux";
import { AffiliateSocialSharing, GetAffiliatePromotionLink } from "Actions/MyAccount";
import IntlMessages from "Util/IntlMessages";
class SocialSharingFeedWdgt extends Component {
    constructor() {
        super();
        this.state = {
            expanded: 'panel1',
            errors: {},
            socialloading: false,
            Facebook: '',
            Twitter: '',
            URL: '',
            GooglePlus: ''
        };
        this.onChange = this.onChange.bind(this);

    }
    onChange(event) {
        var newObj = Object.assign({}, this.state.URL);
        newObj[event.target.name] = event.target.value;
        this.setState({ URL: newObj });
    }
    componentWillMount() {
        this.props.GetAffiliatePromotionLink();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ socialloading: nextProps.socialloading });
        //Get Edit Data By Id
        if (nextProps.PromotionLinkData.hasOwnProperty('Response') && nextProps.PromotionLinkData.Response !== null) {
            if (nextProps.PromotionLinkData.hasOwnProperty('Response') && Object.keys(nextProps.PromotionLinkData.Response).length > 0) {
                this.setState({ Facebook: nextProps.PromotionLinkData.Response.Facebook.PromotionLink });
            }
            if (nextProps.PromotionLinkData.hasOwnProperty('Response') && Object.keys(nextProps.PromotionLinkData.Response).length > 0) {
                this.setState({ Twitter: nextProps.PromotionLinkData.Response.Twitter.PromotionLink });
            }
            if (nextProps.PromotionLinkData.hasOwnProperty('Response') && Object.keys(nextProps.PromotionLinkData.Response).length > 0) {
                this.setState({ URL: nextProps.PromotionLinkData.Response.AffiliateLink.PromotionLink });
            }
        }
    }
    render() {
        const { URL } = this.state;
        return (
            <Fragment>
                {this.state.socialloading && <JbsSectionLoader />}
                <Form className="py-10">
                    <FormGroup className="col-md-12 ">
                        <Label for="URL"><IntlMessages id="sidebar.affiliateLink" /></Label>
                        <Input type="text" name="URL" id="URL" value={URL} readOnly={true} onChange={this.onChange} />
                    </FormGroup>
                    <FormGroup  >
                        <div className="col-lg-12 col-sm-12 mb-0">
                            <Label className="mt-4" for="URL"><IntlMessages id="sidebar.shareWith" /></Label>
                            {this.state.Facebook !== '' ?
                                <Button href={this.state.Facebook} className="btn-facebook text-white row-md-4 col-sm-12 mb-3 mt-2" > <IntlMessages id="sidebar.shareOnFacebook" /> </Button> : <Button disabled className="btn-facebook text-white row-md-4 col-sm-12 mb-3 mt-2" > <IntlMessages id="sidebar.shareOnFacebook" /> </Button>}
                            {this.state.Twitter !== '' ?
                                <Button href={this.state.Twitter} className="btn-twitter text-white row-md-4 col-sm-12 mb-1 mt-1"><IntlMessages id="sidebar.shareOnTwitter" /></Button> : <Button disabled className="btn-twitter text-white row-md-4 col-sm-12 mb-1 mt-1"><IntlMessages id="sidebar.shareOnTwitter" /></Button>}
                        </div>
                    </FormGroup>
                </Form>
            </Fragment>
        )
    }
}
const mapStateToProps = ({ invitefriends }) => {
    const { SocialSharingData, socialloading, PromotionLinkData } = invitefriends;
    return {
        SocialSharingData,
        PromotionLinkData,
        socialloading
    };
};
export default connect(
    mapStateToProps,
    {
        AffiliateSocialSharing,
        GetAffiliatePromotionLink
    }
)(SocialSharingFeedWdgt);


