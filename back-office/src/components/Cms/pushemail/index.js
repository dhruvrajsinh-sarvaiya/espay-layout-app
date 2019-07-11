/* Developed by Jinesh 30-01-2019 */
import React, { Component } from 'react'
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles'
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import MatButton from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import $ from 'jquery';
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { PushEmailRequest } from 'Actions/PushEmail';
import { displayUserList } from "Actions/PushMessage";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { DashboardPageTitle } from '../DashboardPageTitle';
import { Editor } from "@tinymce/tinymce-react";
// code added by devang parekh for new select (29-3-2019)
import Select from 'react-select' // Added By Megha Kariya (18/02/2019)
const validateEmail = require("../../../validation/PushEmail/pushEmail");
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

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.cms" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.PushEmail" />,
        link: '',
        index: 0
    }
];

class PushEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmailID: "",
            CC: "",
            Bcc: "",
            Subject: "",
            selectedUser: null,
            selectedBCCUser: null,
            selectedCCUser: null,
            Message: "",
            userList: '0',
            errors: {},
            isDisabled: false,
            isAPICall: 0,
            btn_disabled: false, // Added By Megha Kariya (08/02/2019),
            EmailList: [],
            CCEmailList: [],
            BCCEmailList: [],
            fieldList: {},
            menudetail: [],
            Pflag: true,
        };
        this.initState = {
            EmailID: "",
            CC: "",
            Bcc: "",
            Subject: "",
            selectedUser: null,
            selectedBCCUser: null,
            selectedCCUser: null,
            Message: "",
            userList: '0',
            errors: {},
            isDisabled: false,
            isAPICall: 0,
            btn_disabled: false, // Added By Megha Kariya (08/02/2019)
            EmailList: [],
            CCEmailList: [],
            BCCEmailList: []
        };
        this.onhandleChange = this.onhandleChange.bind(this);
        this.OnSendEmail = this.OnSendEmail.bind(this)
        this.closeAll = this.closeAll.bind(this);
        this.resetData = this.resetData.bind(this);
    }

    resetData() {
        this.setState(this.initState);
        this.props.drawerClose();
    }

    closeAll() {
        this.setState(this.initState);
        this.props.closeAll();
    }

    onhandleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('EF0CA6BC-4A0D-1C08-74C8-779360AA4DBC');
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.displayUserList({ cumpulsoryBit: 2 }); // 1 for Mobile number Cumplusory and 2 for Email Cumpulsory
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        if (this.state.isAPICall === 1) {
            if (nextProps.pushEmailResponse.ReturnCode === 0) {
                this.setState({ EmailList: [], CCEmailList: [], BCCEmailList: [] })
                NotificationManager.success(nextProps.pushEmailResponse.ReturnMsg);
                setTimeout(() => {
                    this.closeAll();
                }, 2000);
            } else {
                NotificationManager.error(nextProps.pushEmailResponse.ReturnMsg);
                this.setState({
                    btn_disabled: false // Added By Megha Kariya (08/02/2019)
                });
            }
        }
    }

    handleChangeMulti = selectedUser => {
        if (selectedUser === "") {
            selectedUser = null;
        }

        let BCCAddress = [];
        let CCAddress = [];
        let Address = [];
        let errorbit = 0;
        // Bcc Addresses
        if (this.state.selectedBCCUser !== null) {
            BCCAddress = this.state.selectedBCCUser.split(',');
        } else {
            BCCAddress =  [] ;
        }
        // CC addresses
        if (this.state.selectedCCUser !== null) {
            CCAddress = this.state.selectedCCUser.split(',');
        } else {
            CCAddress =  [] ;
        }
        // Current Field Value
        if (selectedUser !== null) {
            Address.push(selectedUser);
        }

        // check current value in BCC and CC addresses
        Address.forEach(function (value) {
            var matchBCCuser = $.inArray(value, BCCAddress);
            var matchCCUser = $.inArray(value, CCAddress);

            if ((matchBCCuser !== -1 && BCCAddress.length > 0)||(matchCCUser !== -1 && CCAddress.length > 0)) {
                errorbit = 1;
                NotificationManager.error(<IntlMessages id="pushEmail.error.SameRecipient" />);
                return false;
            } 
        });

        // if email unique then set in state and check total number of email selected
        if (errorbit === 0) {
            let totalCount = Address.length + BCCAddress.length + CCAddress.length;
            if (totalCount > 100) {
                this.setState({ isDisabled: true, selectedUser: Address });
            } else {
                this.setState({ isDisabled: false, selectedUser: Address });
            }
        }
    };

    handleChangeMultiBCC = selectedUser => {
        if (selectedUser === "") {
            selectedUser = null;
        }
        let Address = [];
        let CCAddress = [];
        let BCCAddress = [];
        let errorBit = 0;
        // Receipient addresses
        if (this.state.selectedUser !== null) {
            Address = this.state.selectedUser.split(',');
        } else {
            Address =  [];
        }
        // CC addresses
        if (this.state.selectedCCUser !== null) {
            CCAddress = this.state.selectedCCUser.split(',');
        } else {
            CCAddress =  [];
        }
        // Current field value
        if (selectedUser !== null) {
            BCCAddress = selectedUser.split(',');
        }

        // find total of addresses
        let totalCount = Address.length + BCCAddress.length + CCAddress.length;

        // check weather unique value or not
        BCCAddress.forEach(function (value) {
            var matchUser = $.inArray(value, Address);
            var matchCCUser = $.inArray(value, CCAddress);

            if ((matchUser !== -1 && Address.length > 0)||(matchCCUser !== -1 && CCAddress.length > 0)) {
                errorBit = 1;
                NotificationManager.error(<IntlMessages id="pushEmail.error.SameBCCAddress" />);
                return false;
            } 
        });

        if (errorBit !== 1 && totalCount <= 100) {
            this.setState({
                selectedBCCUser: selectedUser,
                isDisabled: false
            });
        } else if (totalCount > 100) {
            this.setState({ isDisabled: true });
            NotificationManager.error(<IntlMessages id="pushEmail.error.moreThan100MailAddress" />)
        }
    };

    handleChangeMultiCC = selectedUser => {
        if (selectedUser === "") {
            selectedUser = null;
        }
        let Address = [];
        let BCCAddress = [];
        let CCAddress = [];
        let errorBit = 0;
        // Receipient addresses
        if (this.state.selectedUser !== null) {
            Address = this.state.selectedUser.split(',');
        } else {
            Address =  [];
        }

        // BCC addresses
        if (this.state.selectedBCCUser !== null) {
            BCCAddress = this.state.selectedBCCUser.split(',');
        } else {
            BCCAddress =  [];
        }

        // Current field value
        if (selectedUser !== null) {
            CCAddress = selectedUser.split(',');
        }

        // find total of addresses
        let totalCount = Address.length + BCCAddress.length + CCAddress.length;

        // check weather unique value or not
        CCAddress.forEach(function (value) {
            var matchUser = $.inArray(value, Address);
            var matchBCCUser = $.inArray(value, BCCAddress);

            if ((matchUser !== -1 && Address.length > 0) || (matchBCCUser !== -1 && BCCAddress.length > 0)) {
                errorBit = 1;
                NotificationManager.error(<IntlMessages id="pushEmail.error.SameCCAddress" />);
                return false;
            }
        });

        if (errorBit !== 1 && totalCount <= 100) {
            this.setState({
                selectedCCUser: selectedUser,
                isDisabled: false
            });
        } else if (totalCount > 100) {
            this.setState({ isDisabled: true });
            NotificationManager.error(<IntlMessages id="pushEmail.error.moreThan100MailAddress" />)
        }
    };

    OnSendEmail() {
        //let request = {};
        let request = { Recepient: [], CC: [], BCC: [] };

        if (this.state.EmailList && this.state.EmailList.length) {
            this.state.EmailList.forEach(function (user) {
                request.Recepient.push(user.value)
            });
        }

        if (this.state.CCEmailList && this.state.CCEmailList.length) {
            this.state.CCEmailList.forEach(function (user) {
                request.CC.push(user.value)
            });
        }

        if (this.state.BCCEmailList && this.state.BCCEmailList.length) {
            this.state.BCCEmailList.forEach(function (user) {
                request.BCC.push(user.value)
            });
        }

        request.Body = this.state.Message;
        request.Subject = this.state.Subject;

        let Count = request.Recepient.length + request.CC.length + request.BCC.length;
        const { errors, isValid } = validateEmail(request);
        Object.keys(errors).forEach(function (item) {
            NotificationManager.error(<IntlMessages id={errors[item]} />);
        });
        this.setState({ errors: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
        if (isValid) {
            if (Count > 6) {
                if (request.CC.length > 1) {
                    request.Recepient.push(request.CC);
                    request.CC = [];
                    request.BCC = [];
                }
                if (request.BCC.length > 1) {
                    request.Recepient.push(request.BCC);
                    request.CC = [];
                    request.BCC = [];
                }
                this.setState({ isAPICall: 1 });
                this.props.PushEmailRequest({ request });
            } else {
                this.setState({ isAPICall: 1 });
                this.props.PushEmailRequest({ request });
            }
        }
        else { // Added By Megha Kariya (08/02/2019)
            this.setState({ btn_disabled: false });
        }
    }

    OnchangeMessage = (key, value) => {
        this.setState({ [key]: value });
    }

    // code added by devang parekh (29-3-2019) for handle select when select
    // for handle email list (receipient list)
    onChangeEmailID = (selectedUser) => {
        var self = this;
        if (selectedUser) {
            var matchCCUser = -1;
            var matchBCCuser = -1;

            selectedUser.forEach(function (user) {
                if (matchCCUser === -1) {
                    matchCCUser = self.state.CCEmailList.findIndex(CCEmailList => CCEmailList.value === user.value);
                }

                if (matchCCUser === -1) {
                    matchBCCuser = self.state.BCCEmailList.findIndex(BCCEmailList => BCCEmailList.value === user.value);
                }
            });

            if ((matchBCCuser !== -1 && self.state.BCCEmailList.length > 0) ||  (matchCCUser !== -1 && self.state.CCEmailList.length > 0)) {
                self.setState({ EmailList: selectedUser.pop() ? selectedUser : [] });
                NotificationManager.error(<IntlMessages id="pushEmail.error.SameRecipient" />);
            } else {
                var totalCount = selectedUser.length + self.state.CCEmailList.length + self.state.BCCEmailList.length;
                if (totalCount > 100) {
                    self.setState({ isDisabled: true, EmailList: selectedUser });
                } else {
                    self.setState({ isDisabled: false, EmailList: selectedUser });
                }
            }
        } else {
            self.setState({ isDisabled: false, EmailList: [] });
        }
    }

    // for handle ccemail list (ccemail list)
    onChangeCCEmailID = (selectedUser) => {
        var self = this;
        if (selectedUser) {
            var matchUser = -1;
            var matchBCCUser = -1;

            selectedUser.forEach(function (user) {
                if (matchUser === -1) {
                    matchUser = self.state.EmailList.findIndex(EmailList => EmailList.value === user.value);
                }

                if (matchBCCUser === -1) {
                    matchBCCUser = self.state.BCCEmailList.findIndex(BCCEmailList => BCCEmailList.value === user.value);
                }
            });

            if ((matchUser !== -1 && self.state.EmailList.length > 0) || (matchBCCUser !== -1 && self.state.BCCEmailList.length > 0)) {
                self.setState({ CCEmailList: selectedUser.pop() ? selectedUser : [] });
                NotificationManager.error(<IntlMessages id="pushEmail.error.SameCCAddress" />);
            } else {
                var totalCount = selectedUser.length + self.state.EmailList.length + self.state.BCCEmailList.length;
                if (totalCount > 100) {
                    self.setState({ isDisabled: true, CCEmailList: selectedUser });
                } else {
                    self.setState({ isDisabled: false, CCEmailList: selectedUser });
                }
            }
        } else {
            self.setState({ isDisabled: false, CCEmailList: [] });
        }
    }

    // for handle bccemail list (bccemail list)
    onChangeBCCEmailID = (selectedUser) => {
        var self = this;
        if (selectedUser) {
            var matchUser = -1;
            var matchCCUser = -1;

            // check in existing array of email and ccemail list if not then save otherwise ignore
            selectedUser.forEach(function (user) {
                if (matchUser === -1) {
                    matchUser = self.state.EmailList.findIndex(EmailList => EmailList.value === user.value);
                }
                if (matchCCUser === -1) {
                    matchCCUser = self.state.CCEmailList.findIndex(CCEmailList => CCEmailList.value === user.value);
                }
            });

            if ((matchUser !== -1 && self.state.EmailList.length > 0)  || (matchCCUser !== -1 && self.state.CCEmailList.length > 0)){
                self.setState({ BCCEmailList: selectedUser.pop() ? selectedUser : [] });
                NotificationManager.error(<IntlMessages id="pushEmail.error.SameBCCAddress" />);
            }  else {
                var totalCount = selectedUser.length + self.state.EmailList.length + self.state.CCEmailList.length;
                if (totalCount > 100) {
                    self.setState({ isDisabled: true, BCCEmailList: selectedUser });
                } else {
                    self.setState({ isDisabled: false, BCCEmailList: selectedUser });
                }
            }
        } else {
            self.setState({ isDisabled: false, BCCEmailList: [] });
        }
    }
    // code end

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = {};
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
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }

    render() {
        var menudetail = this.checkAndGetMenuAccessDetail('1BA85AEA-1D5F-388E-105C-7691701E7899');
        const { Subject, Message, btn_disabled, EmailList, CCEmailList, BCCEmailList } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
        const data = this.props.userDataList;
        
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.PushEmail" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
                {(this.props.loading || this.props.loadingUserList || this.props.menuLoading) && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <Form>
                        {this.state.userList === '0' && (menudetail["90219398-87E9-1A82-0DFF-DEB9D826A476"] && menudetail["90219398-87E9-1A82-0DFF-DEB9D826A476"].Visibility === "E925F86B") && //90219398-87E9-1A82-0DFF-DEB9D826A476
                            <FormGroup>
                                <Label for="fullName" className="control-label" style={{ display: 'flex' }}><IntlMessages id="pushEmail.label.Recipient" /><span className="text-danger">*</span></Label>
                                    <Select
                                        isDisabled={(menudetail["90219398-87E9-1A82-0DFF-DEB9D826A476"].AccessRight === "11E6E7B0") ? true : false}
                                        defaultValue={EmailList}
                                        options={data}
                                        name="emailIDList"
                                        onChange={this.onChangeEmailID}
                                        isMulti
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                <div className="col-md-5" />
                            </FormGroup>}
                        {this.state.userList === '0' && (menudetail["A6683AA6-2BF6-4893-1FE7-E16EF32437BE"] && menudetail["A6683AA6-2BF6-4893-1FE7-E16EF32437BE"].Visibility === "E925F86B") && //A6683AA6-2BF6-4893-1FE7-E16EF32437BE
                            <FormGroup>
                                <Label for="fullName" className="control-label col-md-2" style={{ display: 'flex' }}><IntlMessages id="pushEmail.label.BCC" /></Label>
                                    <Select
                                        isDisabled={(menudetail["A6683AA6-2BF6-4893-1FE7-E16EF32437BE"].AccessRight === "11E6E7B0") ? true : false}
                                        defaultValue={BCCEmailList}
                                        options={data}
                                        name="BCCEmailIDList"
                                        onChange={this.onChangeBCCEmailID}
                                        isMulti
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                <div className="col-md-5" />
                            </FormGroup>}
                        {this.state.userList === '0' && (menudetail["C5BE999E-2CE1-8D05-22CF-862ACE9B152A"] && menudetail["C5BE999E-2CE1-8D05-22CF-862ACE9B152A"].Visibility === "E925F86B") && //C5BE999E-2CE1-8D05-22CF-862ACE9B152A
                            <FormGroup>
                                <Label for="fullName" className="control-label col-md-2" style={{ display: 'flex' }}><IntlMessages id="pushEmail.label.CC" /></Label>
                                    <Select
                                        isDisabled={(menudetail["C5BE999E-2CE1-8D05-22CF-862ACE9B152A"].AccessRight === "11E6E7B0") ? true : false}
                                        defaultValue={CCEmailList}
                                        options={data}
                                        name="CCEmailIDList"
                                        onChange={this.onChangeCCEmailID}
                                        isMulti
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                <div className="col-md-5" />
                            </FormGroup>}
                        {(menudetail["B03B9778-255D-8F35-5F56-DC0860CA8430"] && menudetail["B03B9778-255D-8F35-5F56-DC0860CA8430"].Visibility === "E925F86B") && //B03B9778-255D-8F35-5F56-DC0860CA8430
                            <FormGroup>
                                <Label for="Subject" className="control-label col-md-2" style={{ display: 'flex' }}> <IntlMessages id="pushEmail.label.Subject" /> <span className="text-danger">*</span></Label>
                                <Input
                                    disabled={(menudetail["B03B9778-255D-8F35-5F56-DC0860CA8430"].AccessRight === "11E6E7B0") ? true : false}
                                    type="textarea"
                                    name="Subject"
                                    id="Subject"
                                    value={Subject}
                                    onChange={this.onhandleChange} />
                                <div className="col-md-4" />
                            </FormGroup>}
                        {(menudetail["11C1577D-3D30-3C51-37AD-D54E89505BFF"] && menudetail["11C1577D-3D30-3C51-37AD-D54E89505BFF"].Visibility === "E925F86B") && //11C1577D-3D30-3C51-37AD-D54E89505BFF
                            <FormGroup>
                                <Label for="Message" className="control-label col-md-2" style={{ display: 'flex' }}><IntlMessages id="pushEmail.label.Message" /><span className="text-danger">*</span></Label>
                                <Editor
                                    disabled={(menudetail["11C1577D-3D30-3C51-37AD-D54E89505BFF"].AccessRight === "11E6E7B0") ? true : false}
                                    init={{
                                        height: 500,
                                        plugins: 'link image code lists advlist table preview',
                                        toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                                        statusbar: false
                                    }}
                                    value={Message}
                                    onChange={(e) => this.OnchangeMessage("Message", e.target.getContent())}
                                />
                            </FormGroup>}
                        {Object.keys(menudetail).length > 0  &&
                            <FormGroup>
                                    <MatButton
                                        variant="raised"
                                        className="btn-primary text-white mr-10"
                                        onClick={this.OnSendEmail}
                                        disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
                                    > <IntlMessages id="button.submit" />
                                    </MatButton>

                                    <MatButton 
                                    variant="raised" 
                                    className="btn-danger text-white" 
                                    onClick={this.closeAll}
                                    ><IntlMessages id="button.cancel" disabled={btn_disabled} />
                                    </MatButton> {/* Added By Megha Kariya (08/02/2019) : add btn_disabled */}
                            </FormGroup>}
                    </Form>
                </JbsCollapsibleCard>
            </div>
        )
    }
}

const mapStateToProps = ({ pushEmail, pushMessage, authTokenRdcer }) => {
    var response = {
        pushEmailResponse: pushEmail.pushEmailResponse,
        loading: pushEmail.loading,
        userDataList: pushMessage.displayUserDara,
        loadingUserList: pushMessage.loading,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    }
    return response;
}

export default connect(mapStateToProps, {
    PushEmailRequest,
    displayUserList,
    getMenuPermissionByID
})(withStyles(styles)(PushEmail))