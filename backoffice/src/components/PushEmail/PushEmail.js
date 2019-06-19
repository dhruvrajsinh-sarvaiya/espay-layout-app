import React, {Component} from 'react'
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles'
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import MatButton from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import $ from 'jquery';
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';
import {NotificationManager} from "react-notifications";
import {Form, FormGroup, Label, Input} from 'reactstrap';
import MultiSelectComponent from '../PushMessage/component/MultiSelectComponent';
import {PushEmailRequest} from 'Actions/PushEmail';
import {displayUserList} from "Actions/PushMessage";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const validateEmail = require("../../validation/PushEmail/pushEmail");
const ITEM_HEIGHT = 48;

const styles = theme => ({
    chip: {
        margin: theme.spacing.unit / 4,
    },

    '@global': {
        '.Select-control': {
            display: 'flex',
            alignItems: 'center',
            border: 0,
            height: 'auto',
            background: 'transparent',
            '&:hover': {
                boxShadow: 'none',
            },
        },
        '.Select-multi-value-wrapper': {
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
        },
        '.Select--multi .Select-input': {
            margin: 0,
        },
        '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
            padding: 0,
        },
        '.Select-noresults': {
            padding: theme.spacing.unit * 2,
        },
        '.Select-input': {
            display: 'inline-flex !important',
            padding: 0,
            height: 'auto',
        },
        '.Select-input input': {
            background: 'transparent',
            border: 0,
            padding: 0,
            cursor: 'default',
            display: 'inline-block',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            margin: 0,
            outline: 0,
        },
        '.Select-placeholder, .Select--single .Select-value': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.pxToRem(16),
            padding: 0,
        },
        '.Select-placeholder': {
            opacity: 0.42,
            color: theme.palette.common.black,
        },
        '.Select-menu-outer': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            position: 'absolute',
            left: 0,
            top: `calc(100% + ${theme.spacing.unit}px)`,
            width: '100%',
            zIndex: 2,
            maxHeight: ITEM_HEIGHT * 4.5,
        },
        '.Select.is-focused:not(.is-open) > .Select-control': {
            boxShadow: 'none',
        },
        '.Select-menu': {
            maxHeight: ITEM_HEIGHT * 4.5,
            overflowY: 'auto',
        },
        '.Select-menu div': {
            boxSizing: 'content-box',
        },
        '.Select-arrow-zone, .Select-clear-zone': {
            color: theme.palette.action.active,
            cursor: 'pointer',
            height: 21,
            width: 21,
            zIndex: 1,
        },
        // Only for screen readers. We can't use display none.
        '.Select-aria-only': {
            position: 'absolute',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            height: 1,
            width: 1,
            margin: -1,
        },
    },
});

class PushEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmailID: "",
            CC: "",
            Bcc: "",
            Subject: "",
            selectedUser: null,
            selectedBCCUser:null,
            selectedCCUser:null,
            Message: "",
            userList: '0',
            errors: {},
            isDisabled:false,
            isAPICall:0
        };
        this.onhandleChange = this.onhandleChange.bind(this);
        this.OnSendEmail = this.OnSendEmail.bind(this)
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.handelClearform = this.handelClearform.bind(this);
    }

    onhandleChange(event) {
        this.setState({[event.target.name]: event.target.value})
    };

    componentWillMount() {
        this.props.displayUserList({cumpulsoryBit:2}); // 1 for Mobile number Cumplusory and 2 for Email Cumpulsory
    }

    componentWillReceiveProps(nextProps, nextContext) {
        
        if(this.state.isAPICall == 1){
            if(nextProps.pushEmailResponse.ReturnCode == 0){
                NotificationManager.success(nextProps.pushEmailResponse.ReturnMsg);
                this.handelClearform();
            }else{
                NotificationManager.error(nextProps.pushEmailResponse.ReturnMsg);
            }
        }

    }

    handleChangeMulti = selectedUser => {
        if(selectedUser == ""){
            selectedUser = null;
        }
        let BCCAddress = [];
        let CCAddress = [];
        let Address = [];
        let errorbit = 0;
        if(this.state.selectedBCCUser !== null){
            BCCAddress = this.state.selectedBCCUser.split(',');
        }else {
            BCCAddress = this.state.selectedBCCUser == null ? [] : this.state.selectedBCCUser;
        }
        if (this.state.selectedCCUser !== null){
            CCAddress = this.state.selectedCCUser.split(',');
        }else{
            CCAddress = this.state.selectedCCUser == null ? [] : this.state.selectedCCUser;
        }

        let matchBCCUser = $.inArray(selectedUser, BCCAddress);

        let matchCCuser = $.inArray(selectedUser, CCAddress) ;

        if(matchBCCUser === -1 && matchCCuser === -1){
            this.setState({
                selectedUser: selectedUser,
            });
        }else{
            errorbit = 1;
            NotificationManager.error(<IntlMessages id="pushEmail.error.SameRecipient" />);
        }
        if(errorbit == 0){
            if (selectedUser !== null){
                Address = selectedUser.split(',');
            }

            let totalCount = Address.length + BCCAddress.length + CCAddress.length;

            if(totalCount > 100){
                this.setState({isDisabled:true});
            }else{
                this.setState({isDisabled:false});
            }
        }

    };
    handleChangeMultiBCC = selectedUser => {
        if(selectedUser == ""){
            selectedUser = null;
        }
        let Address = [];
        let CCAddress = [];
        let BCCAddress = [];
        let errorBit = 0;
        if(this.state.selectedUser !== null){
            Address = this.state.selectedUser.split(',');
        }else {
            Address = this.state.selectedUser == null ? [] : this.state.selectedUser;
        }
        if (this.state.selectedCCUser !== null){
            CCAddress = this.state.selectedCCUser.split(',');
        }else {
            CCAddress = this.state.selectedCCUser == null ? [] : this.state.selectedCCUser;
        }


        let matchuser = $.inArray(selectedUser, Address);
        let matchCCuser = $.inArray(selectedUser, CCAddress) ;


        if (selectedUser !== null){
            BCCAddress = selectedUser.split(',');
        }
        let totalCount = Address.length + BCCAddress.length + CCAddress.length;

        if(matchuser === -1 && matchCCuser === -1 && totalCount <= 6){
            this.setState({
                selectedBCCUser: selectedUser,
                isDisabled:false
            });
        }else if(totalCount > 6){
            this.setState({isDisabled:true});
            NotificationManager.error(<IntlMessages id="pushEmail.error.moreThan100MailAddress"/>)
        }else{
            NotificationManager.error(<IntlMessages id="pushEmail.error.SameBCCAddress" />)
        }

    };
    handleChangeMultiCC = selectedUser => {
        if(selectedUser == ""){
            selectedUser = null;
        }
        let Address = [];
        let BCCAddress = [];
        let CCAddress = [];
        if(this.state.selectedUser !== null){
             Address = this.state.selectedUser.split(',');
        }else{
            Address = this.state.selectedUser == null ? [] : this.state.selectedUser;
        }
        if (this.state.selectedBCCUser !== null){
             BCCAddress = this.state.selectedBCCUser.split(',');
        }else{
            BCCAddress = this.state.selectedBCCUser == null ? [] : this.state.selectedBCCUser;
        }
        if (selectedUser !== null){
            CCAddress = selectedUser.split(',');
        }

        let matchuser = $.inArray(selectedUser, Address);
        let matchBccuser = $.inArray(selectedUser, BCCAddress);
        let totalCount = Address.length + BCCAddress.length + CCAddress.length;

        if(totalCount >= 100){
            this.setState({isDisabled:true});
        }else{
            this.setState({isDisabled:false});
        }

        if(matchuser === -1 && matchBccuser === -1 && totalCount <= 6){
            this.setState({
                selectedCCUser: selectedUser,isDisabled:true
            });
        }else if(totalCount > 6){

            this.setState({isDisabled:false});
            NotificationManager.error(<IntlMessages id="pushEmail.error.moreThan100MailAddress"/>)
        }else{
            NotificationManager.error(<IntlMessages id="pushEmail.error.SameCCAddress"/>)
        }

    };

    OnSendEmail() {

        let request = {};
        if(this.state.selectedUser !== null){
            request.Recepient = this.state.selectedUser.split(',');
        }else{
            request.Recepient = this.state.selectedUser == null ? [] : this.state.selectedUser;
        }
        if(this.state.selectedCCUser !== null){
            request.CC = this.state.selectedCCUser.split(',');
        }else{
            request.CC = this.state.selectedCCUser == null ? [] : this.state.selectedCCUser;
        }
        if(this.state.selectedBCCUser !== null){
            request.BCC = this.state.selectedBCCUser.split(',');
        }else{
            request.BCC = this.state.selectedBCCUser == null ? [] : this.state.selectedBCCUser;
        }
        request.Body = this.state.Message;
        request.Subject = this.state.Subject;


        let Count = request.Recepient.length + request.CC.length + request.BCC.length;
        const {errors, isValid} = validateEmail(request);
        this.setState({errors: errors});
        if(isValid){
            if(Count > 6){
                if(request.CC.length > 1){
                    request.Recepient.push(request.CC);
                    request.CC = [];
                    request.BCC = [];
                }
                if (request.BCC.length > 1){
                    request.Recepient.push(request.BCC);
                    request.CC = [];
                    request.BCC = [];
                }
                this.setState({isAPICall: 1});
                this.props.PushEmailRequest({request});
            }else{
                this.setState({isAPICall: 1});
                this.props.PushEmailRequest({request});
            }
        }
    }

    handelClearform () {
        this.setState({
            EmailID: "",
            CC: "",
            Bcc: "",
            Subject: "",
            selectedUser: null,
            selectedBCCUser:null,
            selectedCCUser:null,
            Message: "",
            userList: '0',
            errors: {},
            isDisabled:false,
            isAPICall:0
        })
    };
    OnchangeMessage = (key, value) => {
        this.setState({[key]: value});
    }

    render() {
        const {Subject, selectedUser,selectedBCCUser,selectedCCUser, Message, errors} = this.state;
        const {classes} = this.props;
        const data = this.props.userDataList;
        return (
            <div>
                {(this.props.loading || this.props.loadingUserList ) && <JbsSectionLoader/>}
                <JbsCollapsibleCard>
                    <Form>
                        <FormGroup>
                            <Label for="fullName" className="control-label" ><IntlMessages id="pushEmail.label.Recipient"/></Label>
                            {this.state.userList === '0' &&
                            <FormGroup>
                                <MultiSelectComponent id="Userlist" data={data} classes={classes} selectedUser={selectedUser}
                                                      handleChangeMulti={this.handleChangeMulti}/>
                                {errors.selectedUser &&
                                <span className="text-danger"><IntlMessages id={errors.selectedUser}/></span>}
                            </FormGroup>
                            }
                            <div className="col-md-5"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="fullName" className="control-label col-md-1"><IntlMessages id="pushEmail.label.BCC"/></Label>
                            {this.state.userList === '0' &&
                            <FormGroup>
                                <MultiSelectComponent disabled={this.state.isDisabled} id="BCCUserList" data={data} classes={classes} selectedUser={selectedBCCUser}
                                                      handleChangeMulti={this.handleChangeMultiBCC}/>
                                {errors.selectedBCCUser &&
                                <span className="text-danger"><IntlMessages id={errors.selectedBCCUser}/></span>}
                            </FormGroup>
                            }
                            <div className="col-md-5"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="fullName" className="control-label col-md-1"><IntlMessages id="pushEmail.label.CC"/></Label>
                            {this.state.userList === '0' &&
                            <FormGroup>
                                <MultiSelectComponent disabled={this.state.isDisabled} id="CCUserList" data={data} classes={classes} selectedUser={selectedCCUser}
                                                      handleChangeMulti={this.handleChangeMultiCC}/>
                                {errors.selectedCCUser &&
                                <span className="text-danger"><IntlMessages id={errors.selectedCCUser}/></span>}
                            </FormGroup>
                            }
                            <div className="col-md-5"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Subject" className="control-label col-md-1"> <IntlMessages id="pushEmail.label.Subject" /> </Label>
                            <div className="col-md-6">
                                <Input type="textarea"
                                       name="Subject"
                                       id="Subject"
                                       value={Subject}
                                       onChange={this.onhandleChange} />
                            </div>
                            {errors.Subject &&
                            <span className="text-danger"><IntlMessages id={errors.Subject}/></span>}
                            <div className="col-md-5"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Message"><IntlMessages id="pushEmail.label.Message"/></Label>
                            <JoditEditor value={Message} onChange={(e) => this.OnchangeMessage("Message", e)}/>
                            {errors.Body &&
                            <span className="text-danger"><IntlMessages id={errors.Body}/></span>}
                        </FormGroup>

                        <MatButton
                            variant="raised"
                            className="btn-primary text-white mb-10"
                            onClick={this.OnSendEmail}
                        > Submit
                        </MatButton>
                    </Form>
                </JbsCollapsibleCard>
            </div>
        )
    }
}

const mapStateToProps = ({pushEmail, pushMessage}) => {
    var response = {
        pushEmailResponse: pushEmail.pushEmailResponse,
        loading: pushEmail.loading,
        userDataList: pushMessage.displayUserDara,
        loadingUserList: pushMessage.loading,
    }
    return response;
}

export default connect(
    mapStateToProps,
    {
        PushEmailRequest, displayUserList
    }
)(withStyles(styles)(PushEmail))

