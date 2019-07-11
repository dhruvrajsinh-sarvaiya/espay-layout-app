/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount View Domain Dashboard Component
*/
import React, { Component } from "react";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { connect } from "react-redux";
import { FormGroup, Input, Label, Button } from "reactstrap";
import { changeDateFormat } from "Helpers/helpers";
import { getComplainById, replayComplain } from "Actions/MyAccount";
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import validateComplainForm from "Validations/MyAccount/complain_form";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
//Component for MyAccount User Dashboard
class ComplainReplyDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            replyData: {
                ComplainId: '',
                description: '',
                remark: '',
                ComplainstatusId: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            loading: false,
            errors: {},
            list: [],
            fieldList: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
            ListGUID:'',
            ApiCallBit: false
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.replyData);
        newObj[event.target.name] = event.target.value;
        this.setState({ replyData: newObj });
    }

    onCancel = () => {
        this.setState({ replyData: {}, errors: {} ,notificationFlag:true,menudetail:[]});
        this.props.drawerClose();
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateComplainForm(this.state.replyData);
        this.setState({ errors: errors });
        if (isValid) {
            let self = this;
            const { pagedata } = this.props;
            var reqObj = Object.assign({}, this.state.replyData);
            reqObj.ComplainId = pagedata;
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.setState({ replyData: reqObj });
                self.props.replayComplain(reqObj);
            });
        }
    }

    componentWillMount() {
        this.setState({ ApiCallBit: true })
        if (this.props.menuDetail.Status === '') {
            this.props.getMenuPermissionByID('9A30A1D1-1042-1617-2B7F-1AFCB1E69036'); // get myaccount menu permission
        }
        else if (this.props.menuDetail.Status === '1') {
            this.props.getMenuPermissionByID('3E999717-1AB0-927B-2756-FA0DD3200D3E'); // get myaccount menu permission
        }
        else if (this.props.menuDetail.Status === '2') {
            this.props.getMenuPermissionByID('D23104E9-8A87-6D33-75E1-004D09426778'); // get myaccount menu permission
        }
        else {
            this.props.getMenuPermissionByID('EA6A8A13-8B27-6347-81E3-5E605BB264B7');
        }
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            if (!this.state.ApiCallBit) {
                if (this.props.menuDetail.Status === '') {
                    this.props.getMenuPermissionByID('9A30A1D1-1042-1617-2B7F-1AFCB1E69036'); // get myaccount menu permission
                }
                else if (this.props.menuDetail.Status === '1') {
                    this.props.getMenuPermissionByID('3E999717-1AB0-927B-2756-FA0DD3200D3E'); // get myaccount menu permission
                }
                else if (this.props.menuDetail.Status === '2') {
                    this.props.getMenuPermissionByID('D23104E9-8A87-6D33-75E1-004D09426778'); // get myaccount menu permission
                }
                else {
                    this.props.getMenuPermissionByID('EA6A8A13-8B27-6347-81E3-5E605BB264B7');
                }
                this.setState({ ApiCallBit: true })
            }
        }, 1000)
        
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        //Added by Saloni Rathod
    /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                if (this.props.menuDetail.Status === '') {
                    this.setState({ListGUID : "AA802BF8-2BCB-0B8D-0DC8-660208520604"})
                } else if (this.props.menuDetail.Status === 1) {
                    this.setState({ListGUID : "C249F64A-9AF6-1797-87AF-75AB9F5B2F92"})
                } else if (this.props.menuDetail.Status === 2) {
                    this.setState({ListGUID : "6DA02D7B-93A4-7CE0-2029-F395270F791E"})
                } else if (this.props.menuDetail.Status === 3) {
                    this.setState({ListGUID : "1412543E-92CB-33EC-3D2D-DCE434B4403A"})
                }
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
            }
        }
        if (nextProps.ext_flag) {
            if (nextProps.dataObj.ReturnCode === 1 || nextProps.dataObj.ReturnCode === 9) {
                var errMsg = nextProps.dataObj.ErrorCode === 1 ? nextProps.dataObj.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.dataObj.ErrorCode}`} />;
                NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            } else if (nextProps.dataObj.ReturnCode === 0) {
                this.setState({ replyData: '' });
                NotificationManager.success(nextProps.dataObj.ReturnMsg); //added by Bharat Jograna for success_msg
                const { pagedata } = this.props;
                setTimeout(() => this.props.getComplainById(pagedata), 2000);
            }
        } else if (Object.keys(nextProps.getData).length > 0 && Object.keys(nextProps.getData.CompainAllData).length > 0) {
            this.setState({ list: nextProps.getData.CompainAllData });
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
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }

    Close = () => {
        this.props.drawerClose();
        this.setState({ open: false, componentName: "",ApiCallBit: false,notificationFlag:true ,menudetail:[]});
    }
    
    render() {
        const { errors, list } = this.state;
        const { description, remark, ComplainstatusId } = this.state.replyData;
        const { loading } = this.props;
        var headetrMsg = <IntlMessages id="sidebar.totalComplainRptList" />;
        if (this.props.menuDetail.Status === 1) {
            headetrMsg = <IntlMessages id="sidebar.openComplainRptList" />;
        } else if (this.props.menuDetail.Status === 2) {
            headetrMsg = <IntlMessages id="sidebar.closeComplainRptList" />;
        } else if (this.props.menuDetail.Status === 3) {
            headetrMsg = <IntlMessages id="sidebar.pendingComplainRptList" />;
        }
        
        var menuDetail = this.checkAndGetMenuAccessDetail(this.state.ListGUID)
       
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }

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
                title: <IntlMessages id="sidebar.adminPanel" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="sidebar.helpNSupport" />,
                link: '',
                index: 1
            },
            {
                title: headetrMsg,
                link: '',
                index: 2
            },
            {
                title: <IntlMessages id="sidebar.replyComplain" />,
                link: '',
                index: 3
            }
        ];
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.replyComplain" />} breadCrumbData={BreadCrumbData} drawerClose={this.Close} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="card p-15">

                    {list.ComplainMasterData &&
                        list.ComplainMasterData.map((lstCmpMstData, idxCmpMstData) => (
                            <div key={idxCmpMstData}>
                                <h4 className="heading">#{lstCmpMstData.ComplainId + " " + lstCmpMstData.Subject}</h4>
                                <h2 className="heading mb-10">#{lstCmpMstData.ComplainId}</h2>
                            </div>
                        ))}
                    {list.CompainTrailData &&
                        list.CompainTrailData.map((lstCmpTrnData, idxCmpMstData) => (
                            <div className="card p-10 mb-10" key={idxCmpMstData}>
                                <div className="media">
                                    <div className="media-left mr-25">
                                        <img
                                            src={require("Assets/img/user-8.jpg")}
                                            className="img-fluid rounded-circle"
                                            alt="user profile"
                                            width="50"
                                            height="50"
                                        />
                                    </div>
                                    <div className="media-body pt-10">
                                        <span className="mb-5 text-primary fs-14 d-block">
                                            {lstCmpTrnData.Username}{" "}
                                            <span className="date">{changeDateFormat(lstCmpTrnData.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
                                        </span>
                                        <p>{lstCmpTrnData.Description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    <form className="mt-25 tradefrm">
                        {((this.props.menuDetail.Status === '') ?
                            (menuDetail["2193DFDB-9CF9-7269-37D6-FA762D17A271"] && menuDetail["2193DFDB-9CF9-7269-37D6-FA762D17A271"].Visibility === "E925F86B")
                            : (this.props.menuDetail.Status === 1)
                                ? (menuDetail["205DC122-3783-21D3-2F29-6E21D91A5E6F"] && menuDetail["205DC122-3783-21D3-2F29-6E21D91A5E6F"].Visibility === "E925F86B")
                                : (this.props.menuDetail.Status === 2)
                                    ? (menuDetail["08E3D69D-44DE-83DD-2BDA-1C4300AB670D"] && menuDetail["08E3D69D-44DE-83DD-2BDA-1C4300AB670D"].Visibility === "E925F86B")
                                    : (menuDetail["F85CF2E1-2EC5-3AEF-075A-D33762B6141E"] && menuDetail["F85CF2E1-2EC5-3AEF-075A-D33762B6141E"].Visibility === "E925F86B"))
                            &&
                            <FormGroup>
                                <Label for="description" className="col"><IntlMessages id="sidebar.description" /><span className="text-danger">*</span></Label>
                                <Input disabled={((this.props.menuDetail.Status === '') ?
                                    (menuDetail["2193DFDB-9CF9-7269-37D6-FA762D17A271"] && menuDetail["2193DFDB-9CF9-7269-37D6-FA762D17A271"].AccessRight === "11E6E7B0")
                                    : (this.props.menuDetail.Status === 1)
                                        ? (menuDetail["205DC122-3783-21D3-2F29-6E21D91A5E6F"] && menuDetail["205DC122-3783-21D3-2F29-6E21D91A5E6F"].AccessRight === "11E6E7B0")
                                        : (this.props.menuDetail.Status === 2)
                                            ? (menuDetail["08E3D69D-44DE-83DD-2BDA-1C4300AB670D"] && menuDetail["08E3D69D-44DE-83DD-2BDA-1C4300AB670D"].AccessRight === "11E6E7B0")
                                            : (menuDetail["F85CF2E1-2EC5-3AEF-075A-D33762B6141E"] && menuDetail["F85CF2E1-2EC5-3AEF-075A-D33762B6141E"].AccessRight === "11E6E7B0")) ? true : false} type="textarea" name="description" className="form-control" rows="5" id="description" value={description} onChange={this.onChange} />
                                {errors.description && (<span className="text-danger"><IntlMessages id={errors.description} /></span>)}
                            </FormGroup>
                        }

                        <div className="row">
                            {((this.props.menuDetail.Status === '') ?
                                (menuDetail["9747A3ED-921A-61FA-3F2F-E5E097543CEB"] && menuDetail["9747A3ED-921A-61FA-3F2F-E5E097543CEB"].Visibility === "E925F86B")
                                : (this.props.menuDetail.Status === 1)
                                    ? (menuDetail["0876D351-7E1A-42FD-3CB7-36A20B362012"] && menuDetail["0876D351-7E1A-42FD-3CB7-36A20B362012"].Visibility === "E925F86B")
                                    : (this.props.menuDetail.Status === 2)
                                        ? (menuDetail["BBA1C6F3-9CBD-4DBF-547C-F5A4D69845A9"] && menuDetail["BBA1C6F3-9CBD-4DBF-547C-F5A4D69845A9"].Visibility === "E925F86B")
                                        : (menuDetail["F0D091FE-192B-1F0C-23CB-46CDA83863C0"] && menuDetail["F0D091FE-192B-1F0C-23CB-46CDA83863C0"].Visibility === "E925F86B"))
                                &&
                                <FormGroup className="col-md-6 col-sm-6 col-6">
                                    <div className="row">
                                        <Label for="remark" className="control-label col"><IntlMessages id="my_account.remark" /><span className="text-danger">*</span></Label>
                                        <div className="col-md-10" >
                                            <Input disabled={((this.props.menuDetail.Status === '') ?
                                                (menuDetail["9747A3ED-921A-61FA-3F2F-E5E097543CEB"] && menuDetail["9747A3ED-921A-61FA-3F2F-E5E097543CEB"].AccessRight === "11E6E7B0")
                                                : (this.props.menuDetail.Status === 1)
                                                    ? (menuDetail["0876D351-7E1A-42FD-3CB7-36A20B362012"] && menuDetail["0876D351-7E1A-42FD-3CB7-36A20B362012"].AccessRight === "11E6E7B0")
                                                    : (this.props.menuDetail.Status === 2)
                                                        ? (menuDetail["BBA1C6F3-9CBD-4DBF-547C-F5A4D69845A9"] && menuDetail["BBA1C6F3-9CBD-4DBF-547C-F5A4D69845A9"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["F0D091FE-192B-1F0C-23CB-46CDA83863C0"] && menuDetail["F0D091FE-192B-1F0C-23CB-46CDA83863C0"].AccessRight === "11E6E7B0")) ? true : false} type="text" name="remark" id="remark" value={remark} onChange={this.onChange} />
                                            {errors.remark && (<span className="text-danger"><IntlMessages id={errors.remark} /></span>)}
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                            {((this.props.menuDetail.Status === '') ?
                                (menuDetail["C2E6D436-38DB-2DFC-7D6E-3F66C8672FE9"] && menuDetail["C2E6D436-38DB-2DFC-7D6E-3F66C8672FE9"].Visibility === "E925F86B")
                                : (this.props.menuDetail.Status === 1)
                                    ? (menuDetail["98A462C6-3295-0846-51AF-190FF23C695B"] && menuDetail["98A462C6-3295-0846-51AF-190FF23C695B"].Visibility === "E925F86B")
                                    : (this.props.menuDetail.Status === 2)
                                        ? (menuDetail["6D3C1293-37D3-93FD-608D-422FEF7F7EAD"] && menuDetail["6D3C1293-37D3-93FD-608D-422FEF7F7EAD"].Visibility === "E925F86B")
                                        : (menuDetail["9675DC12-184A-097B-86A7-0DB33DE1535E"] && menuDetail["9675DC12-184A-097B-86A7-0DB33DE1535E"].Visibility === "E925F86B"))
                                &&
                                <FormGroup className="col-md-6 col-sm-6 col-6">
                                    <div className="row">
                                        <Label for="ComplainstatusId" className="col"><IntlMessages id="sidebar.status" /><span className="text-danger">*</span></Label>
                                        <div className="col-md-10" >
                                            <Input disabled={((this.props.menuDetail.Status === '') ?
                                                (menuDetail["C2E6D436-38DB-2DFC-7D6E-3F66C8672FE9"] && menuDetail["C2E6D436-38DB-2DFC-7D6E-3F66C8672FE9"].AccessRight === "11E6E7B0")
                                                : (this.props.menuDetail.Status === 1)
                                                    ? (menuDetail["98A462C6-3295-0846-51AF-190FF23C695B"] && menuDetail["98A462C6-3295-0846-51AF-190FF23C695B"].AccessRight === "11E6E7B0")
                                                    : (this.props.menuDetail.Status === 2)
                                                        ? (menuDetail["6D3C1293-37D3-93FD-608D-422FEF7F7EAD"] && menuDetail["6D3C1293-37D3-93FD-608D-422FEF7F7EAD"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["9675DC12-184A-097B-86A7-0DB33DE1535E"] && menuDetail["9675DC12-184A-097B-86A7-0DB33DE1535E"].AccessRight === "11E6E7B0")) ? true : false} type="select" name="ComplainstatusId" value={ComplainstatusId} id="ComplainstatusId" onChange={this.onChange}>
                                                <option value="">Please Select</option>
                                                <option value="1">Open</option>
                                                <option value="2">Close</option>
                                                <option value="3">Pending</option>
                                            </Input>
                                            {errors.ComplainstatusId && (<span className="text-danger"><IntlMessages id={errors.ComplainstatusId} /></span>)}
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                        </div>
                        <div className="mb-15 text-center">
                            <Button variant="raised" color="primary" className="col-md-1 col-sm-2 col-4 mr-10 text-white" onClick={this.onSubmit}>{<IntlMessages id="sidebar.btnReplay" />}</Button>
                            <Button variant="raised" className="btn-danger col-md-1 col-sm-2 col-4 text-white" onClick={this.onCancel}>{<IntlMessages id="sidebar.btnCancel" />}</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

ComplainReplyDashboard.defaultProps = {
    menuDetail: {
        Status : ''
    }
}

//map state to props
const mapStateToProps = ({ complainRdcer, authTokenRdcer }) => {
    return {
        list: complainRdcer.list,
        dataObj: complainRdcer.data,
        loading: complainRdcer.loading,
        getData: complainRdcer.getData,
        ext_flag: complainRdcer.ext_flag,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights
    }
//     return reponse;
};

export default (connect(mapStateToProps, {
    getComplainById,
    replayComplain,
    getMenuPermissionByID
})(ComplainReplyDashboard));