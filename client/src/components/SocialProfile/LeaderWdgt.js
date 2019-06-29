/* 
    Developer : Kevin Ladani
    Date : 27-11-2018
    UpdatedBy : Salim Deraiya 24-12-2018
    File Comment : Upgrade Membership Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Button } from "reactstrap";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
//Call Action function..
import { getSocialProfileSubscription, getSocialProfileSubscribe, getSocialProfileUnSubscribe } from "Actions/SocialProfile";

class LeaderWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            leaderSetting : {
                ProfileId: '',
                ProfileType: 'Leader',
                Price: 0,
                Subscribe: '',
                Profile_Visiblity: '',
                Can_Have_Followers: '',
                Can_Follow_Leaders: '',
                Can_Copy_Trade: '',
                Can_Mirror_Trade: '',
                Minimum_Trade_Volume: ''
            }
        };

        this.onSubscribe = this.onSubscribe.bind(this);
        this.onUnsubscribe = this.onUnsubscribe.bind(this);
    }

    componentWillMount() {
        this.props.getSocialProfileSubscription();
    }

    componentWillReceiveProps(nextProps) {
        console.log('Leader Props:',nextProps);
        this.setState({ loading : nextProps.loading });
    }

    onSubscribe(ProfileId) {
        this.props.getSocialProfileSubscribe(ProfileId);
    }

    onUnsubscribe(ProfileId) {
        this.props.getSocialProfileUnSubscribe(ProfileId);
    }

    render() {
        const { ProfileId, Price, Subscribe, Profile_Visiblity, Can_Have_Followers, Can_Follow_Leaders, Can_Copy_Trade, Can_Mirror_Trade, Minimum_Trade_Volume} = this.state.leaderSetting;
        console.log('Subscribe :',Subscribe, Subscribe === false);
        return (
            <Fragment>
                <JbsCollapsibleCard customClasses="text-center border border-solid border-dark">
                    <div className="social-profileprice">
                        <strong><IntlMessages id={"socialProfile.leader"} /></strong>
                        <span><sup>$</sup>{Price}</span>
                    </div>
                    <div className="col-md-12 mb-20">
                        {Subscribe === false ?
                            <Button onClick={() => this.onSubscribe(ProfileId)} variant="raised" color="primary"><IntlMessages id={"sidebar.btnSubscribe"} /></Button>
                            :
                            <Button onClick={() => this.onUnsubscribe(ProfileId)} variant="raised" color="primary"><IntlMessages id={"sidebar.btnUnSubscribe"} /></Button>
                        }
                    </div>
                    <div className="mt-10 text-left row">
                        <div className="offset-sm-1 col-sm-7 pl-20">
                            <IntlMessages id="socialProfile.profileVisibility" />
                        </div>
                        <div className="col-sm-4">{Profile_Visiblity}</div>
                    </div>
                    <div className="mt-10 text-left row">
                        <div className="offset-sm-1 col-sm-7 pl-20">
                            <IntlMessages id="socialProfile.canHaveFollower" />
                        </div>
                        <div className="col-sm-2">{Can_Have_Followers}</div>
                    </div>
                    <div className="mt-10 text-left row">
                        <div className="offset-sm-1 col-sm-7 pl-20">
                            <IntlMessages id="socialProfile.canFollowerLeaders" />
                        </div>
                        <div className="col-sm-2">{Can_Follow_Leaders}</div>
                    </div>
                    <div className="mt-10 text-left row">
                        <div className="offset-sm-1 col-sm-7 pl-20">
                            <IntlMessages id="socialProfile.canCopyTrade" />
                        </div>
                        <div className="col-sm-2">{Can_Copy_Trade}</div>
                    </div>
                    <div className="mt-10 text-left row">
                        <div className="offset-sm-1 col-sm-7 pl-20">
                            <IntlMessages id="socialProfile.canMirrorTrade" />
                        </div>
                        <div className="col-sm-2">{Can_Mirror_Trade}</div>
                    </div>
                    <div className="mt-10 text-left row">
                        <div className="offset-sm-1 col-sm-7 pl-20">
                            <IntlMessages id="socialProfile.minTradeVolume" />
                        </div>
                        <div className="col-sm-2">{Minimum_Trade_Volume}</div>
                    </div>
                </JbsCollapsibleCard>
            </Fragment>
        )
    }
}

//Map state to props..
const mapStateToProps = ({ socialProfileRdcer }) => {
    const { loading, subscribeData, unSubscribeData, subscriptionData } = socialProfileRdcer;
    return { loading, subscribeData, unSubscribeData, subscriptionData };
}

export default connect(mapStateToProps, {
    getSocialProfileSubscription,
    getSocialProfileSubscribe,
    getSocialProfileUnSubscribe
})(LeaderWdgt);