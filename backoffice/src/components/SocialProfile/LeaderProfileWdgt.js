/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Leader Profile Configuration Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import { getLeaderTradingPolicy, editLeaderTradingPolicy } from "Actions/SocialProfile";
import validateLeaderProfileForm from "Validations/SocialProfile/leader_profile"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class LeaderProfileWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                Default_Visibility_of_Profile: "1",
                Max_Number_Followers_can_Follow: "",
                Min_Number_of_Followers_can_Follow: "",
            },
            loading: false,
            errors: {},
            fieldList: {},
            Ntf_flage: true,
            menudetail: [],
			menuLoading:false,
			notificationFlag:true,
        
        };
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('4C2CE5CB-491D-2EE3-01D1-DF14B9D549B5'); 

    }

    cancelData = () => {
        this.props.drawerClose();
        this.setState({ errors: {},menudetail:this.state.menudetail })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getLeaderTradingPolicy({});
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        if (this.state.Ntf_flage && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ Ntf_flage: false })
        } else if (this.state.Ntf_flage && nextProps.data.ReturnCode === 0) {
            if (typeof nextProps.data.LeaderAdminPolicy !== 'undefined' && Object.keys(nextProps.data.LeaderAdminPolicy).length > 0) {
                this.setState({ data: nextProps.data.LeaderAdminPolicy });
            } else {
                NotificationManager.success(nextProps.data.ReturnMsg)
                this.setState({ Ntf_flage: false })
                this.props.drawerClose();
            }
        }
    }

    onChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }


    updateData = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateLeaderProfileForm(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            var reqObj = Object.assign({}, this.state.data);
            delete reqObj.UpdatedDate;
            delete reqObj.UserName;

            reqObj.deviceId = getDeviceInfo();
            reqObj.mode = getMode();
            reqObj.hostName = getHostName();

            let self = this;
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.editLeaderTradingPolicy(reqObj);
            });
        }
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID.toUpperCase()] = item;
                        });
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }

    render() {
        const { loading, errors } = this.state;
        const { Default_Visibility_of_Profile, Max_Number_Followers_can_Follow, Min_Number_of_Followers_can_Follow } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('c1cd6a7c-1535-21aa-4647-860502b10291');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="LeaderForm">
                <Form className="tradefrm">
                    <Fragment>
                    {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                        <Fragment>
                            <Form>
                                {menuDetail && this.props.topButton &&
                                    <FormGroup className="mb-20 mt-20">
                                        <div className="socialUpdateBtn text-right">
                                            <Button variant="raised" color="primary" onClick={this.updateData}><IntlMessages id="button.update" /></Button>
                                        </div>
                                    </FormGroup>}
                                {(menuDetail["9821D652-6B7A-165E-5CE1-F640A0A9A2B0"] && menuDetail["9821D652-6B7A-165E-5CE1-F640A0A9A2B0"].Visibility === "E925F86B") && //9821D652-6B7A-165E-5CE1-F640A0A9A2B0
                                    <FormGroup row className="mb-20">
                                        <Label for="Default_Visibility_of_Profile" className="control-label col" ><IntlMessages id="socialProfile.profileVisibility" /><span className="text-danger">*</span></Label>
                                        <div className="col-md-7 col-sm-7 col-xs-12">
                                            <Input disabled={(menuDetail["9821D652-6B7A-165E-5CE1-F640A0A9A2B0"].AccessRight === "6AB0714D") ? true : false} type="select" name="Default_Visibility_of_Profile" value={Default_Visibility_of_Profile} id="Default_Visibility_of_Profile" onChange={this.onChange}>
                                                <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                                <IntlMessages id="sidebar.public">{(Public) => <option value="1">{Public}</option>}</IntlMessages>
                                                <IntlMessages id="sidebar.private">{(Private) => <option value="2">{Private}</option>}</IntlMessages>
                                            </Input>
                                            {errors.Default_Visibility_of_Profile && (<span className="text-danger text-left"><IntlMessages id={errors.Default_Visibility_of_Profile} /></span>)}
                                        </div>
                                    </FormGroup>
                                }
                                {(menuDetail["2AFA41F1-58A3-9435-0D71-44334C0D14B4"] && menuDetail["2AFA41F1-58A3-9435-0D71-44334C0D14B4"].Visibility === "E925F86B") && //2AFA41F1-58A3-9435-0D71-44334C0D14B4
                                    <FormGroup row className="mb-20">
                                        <Label for="Max_Number_Followers_can_Follow" className="control-label col" ><IntlMessages id="socialProfile.maxFollowersAllow" /><span className="text-danger">*</span></Label>
                                        <div className="col-md-7 col-sm-7 col-xs-12">
                                            <IntlMessages id="socialProfile.enterMaxFollowersAllow">
                                                {(placeholder) =>
                                                    <Input disabled={(menuDetail["2AFA41F1-58A3-9435-0D71-44334C0D14B4"].AccessRight === "6AB0714D") ? true : false} type="text" name="Max_Number_Followers_can_Follow" value={Max_Number_Followers_can_Follow} placeholder={placeholder} id="Max_Number_Followers_can_Follow" onChange={this.onChange} />
                                                }
                                            </IntlMessages>
                                            {errors.Max_Number_Followers_can_Follow && (<span className="text-danger text-left"><IntlMessages id={errors.Max_Number_Followers_can_Follow} /></span>)}
                                        </div>
                                    </FormGroup>
                                }
                                {(menuDetail["3C596694-8F01-9B40-646C-F442BFB2764B"] && menuDetail["3C596694-8F01-9B40-646C-F442BFB2764B"].Visibility === "E925F86B") && //3C596694-8F01-9B40-646C-F442BFB2764B
                                    <FormGroup row className="mb-20">
                                        <Label for="Min_Number_of_Followers_can_Follow" className="control-label col" ><IntlMessages id="socialProfile.minFollowersAllow" /><span className="text-danger">*</span></Label>
                                        <div className="col-md-7 col-sm-7 col-xs-12">
                                            <IntlMessages id="socialProfile.enterMinFollowersAllow">
                                                {(placeholder) =>
                                                    <Input disabled={(menuDetail["3C596694-8F01-9B40-646C-F442BFB2764B"].AccessRight === "6AB0714D") ? true : false} type="text" name="Min_Number_of_Followers_can_Follow" value={Min_Number_of_Followers_can_Follow} placeholder={placeholder} id="Min_Number_of_Followers_can_Follow" onChange={this.onChange} />
                                                }
                                            </IntlMessages>
                                            {errors.Min_Number_of_Followers_can_Follow && (<span className="text-danger text-left"><IntlMessages id={errors.Min_Number_of_Followers_can_Follow} /></span>)}
                                        </div>
                                    </FormGroup>
                                }
                                {menuDetail && !this.props.topButton &&
                                    <FormGroup row>
                                        <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                            <div className="btn_area">
                                                <Button variant="raised" color="primary" onClick={this.updateData}><IntlMessages id="button.update" /></Button>
                                                <Button variant="raised" color="danger" className="ml-15" onClick={this.cancelData}><IntlMessages id="button.cancel" /></Button>
                                            </div>
                                        </div>
                                    </FormGroup>}
                            </Form>
                        </Fragment>
                    </Fragment>
                </Form>
            </div >
        );
    }
}

LeaderProfileWdgt.defaultProps = {
    topButton: true,
}

//map state to props
const mapStateToProps = ({ socialTradingPolicy ,authTokenRdcer}) => {
    var response = {
        data: socialTradingPolicy.leaderData,
        loading: socialTradingPolicy.leaderLoading,
        menuLoading:authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights
    };
    return response;
};

export default connect(mapStateToProps, {
    getLeaderTradingPolicy,
    editLeaderTradingPolicy
})(LeaderProfileWdgt);