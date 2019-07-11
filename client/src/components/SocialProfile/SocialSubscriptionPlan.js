/* 
    Developer : Kevin Ladani
    Date : 27-11-2018
    UpdatedBy : Salim Deraiya (24-12-2018)..
    File Comment : Upgrade Membership Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Alert, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import CircularProgress from '@material-ui/core/CircularProgress';
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
//Call Action function..
import { getSocialProfileSubscription, getSocialProfileSubscribe, getSocialProfileUnSubscribe } from "Actions/SocialProfile";

class SocialSubscriptionPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            err_msg: '',
            err_alert: true,
            success_msg: '',
            success_alert: true,
            disablePlan: false,
            profileId: '',
            type: '',
            planList: []
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    getSocialProfileList() {
        this.props.getSocialProfileSubscription();
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    componentWillMount() {
        this.getSocialProfileList();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (typeof nextProps.subscribeData !== 'undefined' && Object.keys(nextProps.subscribeData).length > 0) {
            if (nextProps.subscribeData.ReturnCode === 1 || nextProps.subscribeData.ReturnCode === 9) {
                var errMsg = nextProps.subscribeData.ErrorCode === 1 ? nextProps.subscribeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.subscribeData.ErrorCode}`} />;
                this.setState({ err_alert: true, err_msg: errMsg });
            } else {
                this.setState({ disablePlan: false, success_alert: true, success_msg: nextProps.subscribeData.ReturnMsg });

                if (this.state.type !== '' && this.state.type === 'Leader') {
                    this.props.history.push({ pathname: '/app/social-profile/leader-profile-configuration', state: { profileId: this.state.profileId } });
                } else if (this.state.type !== '' && this.state.type === 'Follower') {
                    this.props.history.push({ pathname: '/app/social-profile/leader-list', state: { profileId: this.state.profileId } });
                } else {
                    this.getSocialProfileList();
                }
            }
        } else if (typeof nextProps.subscriptionData !== 'undefined' && typeof nextProps.subscriptionData.SocialProfileList !== 'undefined' && nextProps.subscriptionData.SocialProfileList.length > 0) {
            var SocialProfileList = nextProps.subscriptionData.SocialProfileList;

            SocialProfileList.map((list, index) => {
                if (list.Subscribe) {
                    this.setState({ disablePlan: true });
                }
            });
            this.setState({ planList: nextProps.subscriptionData.SocialProfileList });
        }
    }

    onSubscribe(ProfileId, ProfileType) {
        this.setState({ type: ProfileType, profileId: ProfileId });
        this.props.getSocialProfileSubscribe(ProfileId);
    }

    onUnsubscribe(ProfileId) {
        this.setState({ type: '', profileId: '' });
        this.props.getSocialProfileUnSubscribe(ProfileId);
    }

    render() {
        const { planList, err_alert, err_msg, success_msg, success_alert, loading, disablePlan } = this.state;
        return (
            <Fragment>
                {success_msg && <div className="alert_area">
                    <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                </div>}
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                {
                    loading
                        ?
                        <div className="text-center py-40 w-100">
                            <CircularProgress className="progress-primary" thickness={2} />
                        </div>
                        :
                        <div className="row">
                            {
                                planList.length > 0
                                    ?
                                    <Fragment>
                                        {planList.map((list, index) => (
                                            <div className="col-sm-6 col-md-6" key={index}>
                                                <JbsCollapsibleCard customClasses="text-center border border-solid border-dark">
                                                    <div className="social-profileprice">
                                                        <strong><span>{list.ProfileType}</span></strong>
                                                        <span><sup>$</sup>{list.Price}</span>
                                                    </div>
                                                    <div className="col-md-12 mb-20 p-0">
                                                        {list.Subscribe === false ?
                                                            <Button disabled={disablePlan ? true : false} onClick={() => this.onSubscribe(list.ProfileId, list.ProfileType)} variant="raised" className="perverbtn"><IntlMessages id={"sidebar.btnSubscribe"} /></Button>
                                                            :
                                                            <div className="row">
                                                                <div className="col-md-6 col-sm-6 col">
                                                                    <Button disabled={disablePlan ? true : false} onClick={() => this.onUnsubscribe(list.ProfileId, list.ProfileType)} variant="raised" className="perverbtn"><IntlMessages id={"sidebar.btnUnSubscribe"} /></Button>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6 col">
                                                                    <Link className="btn btn-success text-white" to={{ pathname: list.ProfileType === 'Leader' ? "/app/social-profile/leader-profile-configuration" : "/app/social-profile/follower-profile-configuration", state: { profileId: list.ProfileId } }} variant="raised"><IntlMessages id={"sidebar.btnEdit"} /></Link>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="mt-10 text-left row">
                                                        <div className="col-md-8 col-sm-8 col">
                                                            <IntlMessages id="socialProfile.profileVisibility" />
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col">{list.Profile_Visiblity}</div>
                                                    </div>
                                                    <div className="mt-10 text-left row">
                                                        <div className="col-md-8 col-sm-8 col">
                                                            <IntlMessages id="socialProfile.canHaveFollower" />
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col">{list.Can_Have_Followers}</div>
                                                    </div>
                                                    <div className="mt-10 text-left row">
                                                        <div className="col-md-8 col-sm-8 col">
                                                            <IntlMessages id="socialProfile.canFollowerLeaders" />
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col">{list.Can_Follow_Leaders}</div>
                                                    </div>
                                                    <div className="mt-10 text-left row">
                                                        <div className="col-md-8 col-sm-8 col">
                                                            <IntlMessages id="socialProfile.canCopyTrade" />
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col">{list.Can_Copy_Trade}</div>
                                                    </div>
                                                    <div className="mt-10 text-left row">
                                                        <div className="col-md-8 col-sm-8 col">
                                                            <IntlMessages id="socialProfile.canMirrorTrade" />
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col">{list.Can_Mirror_Trade}</div>
                                                    </div>
                                                    <div className="mt-10 text-left row">
                                                        <div className="col-md-8 col-sm-8 col">
                                                            <IntlMessages id="socialProfile.minTradeVolume" />
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col">{list.Minimum_Trade_Volume}</div>
                                                    </div>
                                                </JbsCollapsibleCard>
                                            </div>
                                        ))}
                                    </Fragment>
                                    :
                                    <div className="">No data found.</div>
                            }
                        </div>
                }
            </Fragment>
        )
    }
}

//Map state to props..
const mapStateToProps = ({ socialProfileRdcer }) => {
    const { loading, subscribeData, subscriptionData } = socialProfileRdcer;
    return { loading, subscribeData, subscriptionData };
}

export default connect(mapStateToProps, {
    getSocialProfileSubscription,
    getSocialProfileSubscribe,
    getSocialProfileUnSubscribe
})(SocialSubscriptionPlan);