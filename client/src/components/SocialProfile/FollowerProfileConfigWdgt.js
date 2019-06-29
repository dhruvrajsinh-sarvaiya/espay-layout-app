/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Follower Profile Configuration Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, Button } from "reactstrap";
import FormGroup from "@material-ui/core/FormGroup";
// import Nouislider from 'react-nouislider';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
//Import addFollower Config Action...
import { editFollowerConfig, getLeaderFollowById } from "Actions/SocialProfile";
import { 
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
const validateFollowerProfileConfigForm = require("../../validation/SocialProfile/follower_profile_configuration");

class FollowerProfileConfigWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                LeaderId: '',
				Trade_Type: '',
				Trade_Percentage : ''
            },
            getData:true,
            changeData : false,
            showForm : true,
            loading : false,
            errors: {}
        };
        this.InitalState = this.state.data;

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        var leaderConfig = this.props.history.location.state;
        if(leaderConfig.LeaderId !== '' && leaderConfig.hasOwnProperty('LeaderId')) {
            if(leaderConfig.type === 'single') {
                this.props.getLeaderFollowById({ LeaderId : leaderConfig.LeaderId });
            }
            var newObj = Object.assign({},this.state.data);
            newObj.LeaderId = leaderConfig.LeaderId;
            this.setState({ data : newObj });
        } else {
            this.setState({ showForm : false, err_msg: <IntlMessages id="apiErrCode.0" />, err_alert: false });            
            this.props.history.push({ pathname: '/app/social-profile/leader-list', state : { profileId : 'follower' } });
        }
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({ loading : nextProps.loading });       

        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
            if(this.state.changeData) {
                NotificationManager.success(nextProps.data.ReturnMsg);
                this.setState({ changeData : false });
            } else if(this.state.getData && nextProps.data.hasOwnProperty('FollowerFrontConfiguration')) {
                var followerDetails = nextProps.data.FollowerFrontConfiguration;
                var newObj = Object.assign({},this.state.data);
                if(followerDetails.Can_Copy_Trade === 1) {
                    newObj.Trade_Type = '1';
                } else if(followerDetails.Can_Mirror_Trade === 1) {
                    newObj.Trade_Type = '2';
                }
                newObj.Trade_Percentage = followerDetails.Default_Copy_Trade_Percentage;
                this.setState({ data : newObj, getData : false });
            }
        }
    }

    clearData() {
        var newObj = Object.assign({}, this.state.data);
        newObj.Trade_Type = '';
        newObj.Trade_Percentage = '';
        this.setState({ err_msg: '', err_alert: false, success_msg: '', success_alert: false, data : newObj });
    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateFollowerProfileConfigForm(this.state.data);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            var reqObj = Object.assign({},this.state.data);
            reqObj.DeviceId = getDeviceInfo();
            reqObj.Mode = getMode();
            reqObj.HostName = getHostName();
            
            if(reqObj.Trade_Type === "2") {
                reqObj.Can_Mirror_Trade = 1;
                reqObj.Can_Copy_Trade = 2;
                reqObj.Trade_Percentage = 100;
            } else if(reqObj.Trade_Type === "1") {
                reqObj.Can_Copy_Trade = 1;
                reqObj.Can_Mirror_Trade = 2;
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                delete reqObj.Trade_Type;
                reqObj.IPAddress = ipAddress;
                self.setState({ changeData : true });
                self.props.editFollowerConfig(reqObj);
            });
        }
    }
    
    render() {
        const {  errors, showForm, loading } = this.state;
        const { Trade_Type, Trade_Percentage } = this.state.data;
        return (
            <div className="jbs-page-content">
                <div className="jbs-page-content col-md-12 mx-auto">
                    {loading && <JbsSectionLoader />}
                    {
                        showForm &&
                        <Form>
                            <FormGroup row className="mb-20">
                                <Label for="Trade_Type" className="control-label col-md-5 text-right" ><IntlMessages id="sidebar.tradeType" /></Label>
                                <div className="col-md-7">
                                    <Input type="select" className="w-40" name="Trade_Type" value={Trade_Type} id="Trade_Type" onChange={this.onChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.copyTrade">{(copyTrade) => <option value="1">{copyTrade}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.mirrorTrade">{(mirrorTrade) => <option value="2">{mirrorTrade}</option>}</IntlMessages>
                                    </Input>
                                    {errors.Trade_Type && (<span className="text-danger text-left"><IntlMessages id={errors.Trade_Type} /></span>)}
                                </div>
                            </FormGroup>
                            <FormGroup row className="mb-20">
                                <Label for="Trade_Percentage" className="control-label col-md-5 text-right" ><IntlMessages id="sidebar.tradeLimit" /></Label>
                                <div className="col-md-7">
                                    {
                                        Trade_Type === "2" ?
                                        <Label className="control-label">100</Label>
                                        :
                                        <Fragment>
                                            <IntlMessages id="sidebar.enterTradeLimit">
                                                {(placeholder) =>
                                                    <Input type="text" className="w-40" name="Trade_Percentage" value={Trade_Percentage} placeholder={placeholder} id="Trade_Percentage" onChange={this.onChange} />
                                                }
                                            </IntlMessages>
                                            {errors.Trade_Percentage && (<span className="text-danger text-left"><IntlMessages id={errors.Trade_Percentage} /></span>)}
                                        </Fragment>
                                    }
                                </div>
                            </FormGroup>
                            <FormGroup className="clearfix">
                                <div className="offset-md-5 px-15 ds-block">
                                    <Button variant="raised" className="perverbtn text-white mr-10" onClick={this.onSubmit}><IntlMessages id="button.save" /></Button>
                                    <Link to="/app/social-profile/leader-list" variant="raised" className="btn btn-danger text-white"><IntlMessages id="button.cancel" /></Link>
                                </div>
                            </FormGroup>
                        </Form>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ socialProfileRdcer }) => {
    const response = {
        data: socialProfileRdcer.followerData,
        loading: socialProfileRdcer.loading
    }
    return response;
};

export default withRouter(connect(mapStateToProps, {
    editFollowerConfig,
    getLeaderFollowById
})(FollowerProfileConfigWdgt));