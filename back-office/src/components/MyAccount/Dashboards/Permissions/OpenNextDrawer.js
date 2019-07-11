//compoennt for open next drawer by Tejas 9/5/2019

import React, { Component, Fragment } from 'react';

// used for connect  component with store
import { connect } from "react-redux";

// import for design
import {
    Form,
    Button,
    Modal,
} from "reactstrap";
// import for back button
import MatButton from '@material-ui/core/Button';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
//used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//used for display notifications
import { NotificationManager } from "react-notifications";
// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
// used for display menu name and modulename type
import { getMenuType } from 'Helpers/helpers';
//Added By Tejas For Get Data With Saga
import {
    getMenuAccess,
    updateModuleAccessPermission, //Added by salim dt:06/05/2019
    updateModuleFieldAccess
} from "Actions";
// intl messages
import IntlMessages from "Util/IntlMessages";
//used for open modal
import FieldModal from './ViewFieldModal';

// class for handle multiple drawer
class OpenNextDrawer extends Component {

    //constructor and set default state
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            componentName: '',
            getData: false,
            selectedObject: this.props.selectedObject,
            cnfgMdlData: this.props.menuDetails,
            getListBit: 0,
            selectedId: this.props.selectedObject.GUID,
            isGetMoreData: false,
            fieldList: [],
            openFieldModel: false,
            selectedData: {},
            selectedValue: {},
            //Added by salim dt:07/05/2019...
            GroupID: this.props.GroupID,
            bitGroupID: true,
            selCheckbox: false,
            mainCheckAll: false,
            checkAll: false,
            modalData: {},
            getSelectedObject: false,
            reqObj: null
        };
    }

    //Added by salim dt:07/05/2019...
    //Check All submodule check is check or not...
    checkAllSubModule = (dataObj) => {
        var checkCount = 0;
        dataObj.map((mList, index) => {
            if (mList.Status) { checkCount += 1; }
        });
        return checkCount === dataObj.length ? true : false;
    }

    // used for open modal
    openModel = (event, name, value) => {

        event.preventDefault();

        this.setState({
            openFieldModel: true,
            selectedData: value
        })
    }

    //used for close modal
    CloseModal = () => {
        this.setState({
            openFieldModel: false
        })
    }

    //Update Module Access Permission API Call
    updateModuleAccessRight = (event, type, index) => {
        event.preventDefault();
        var reqObj = { GroupID: this.state.GroupID };
        reqObj.Data = [];

        if (this.state.reqObj !== null) {
            this.setState({ selCheckbox: true })

            this.props.updateModuleAccessPermission(this.state.reqObj);
        } else {
            if (type === 'MainMenu') {
                this.state.cnfgMdlData.Modules.map((item,ind) => {
                    let mData = {
                        ModuleGroupAccessID: item.ModuleGroupAccessID,
                        ModuelID: item.ModuelID,
                        Status: item.Status, //1,
                        Utility: item.Utility,
                        CrudOption: item.CrudOption
                    }
                    reqObj.Data.push(mData);
                    // }
                });
            } else if (type === 'subModule') {

                this.state.selectedObject['childs']['Modules'].map((item,key) => {

                    let mData = {
                        ModuleGroupAccessID: item.ModuleGroupAccessID,
                        ModuelID: item.ModuelID,
                        Status: item.Status, //1,
                        Utility: item.Utility,
                        CrudOption: item.CrudOption
                    }
                    reqObj.Data.push(mData);

                });
            }

            this.setState({ selCheckbox: true })

            this.props.updateModuleAccessPermission(reqObj);
        }

    }

    //Added by salim dt:07/05/2019...
    //Update Module Access Permission API Call
    moduleChangeData = (type, value, dataObj, index, curType = '') => {

        this.setState({ selectedId: dataObj.GUID });
        var reqObj = { GroupID: this.state.GroupID };
        reqObj.Data = [];
        var mData = {};

        if (type === 'All' && dataObj.Modules.length > 0) {
            dataObj.Modules.map((mList, indexes) => {
                 mData = {
                    ModuleGroupAccessID: mList.ModuleGroupAccessID,
                    ModuelID: mList.ModuelID,
                    Status: value ? 1 : 0,
                    Utility: mList.Utility,
                    CrudOption: mList.CrudOption
                }
                reqObj.Data.push(mData);
            });
        } else if (type === 'list_form' && curType !== '') {
            let CrudOption = this.state.selectedObject;
            if (value) {

                CrudOption.childs.Modules[index].CrudOption.push(curType)
            } else  {

                var findIndex = CrudOption.childs.Modules[index].CrudOption.indexOf(curType);
                if (findIndex !== -1) CrudOption.childs.Modules[index].CrudOption.splice(findIndex, 1);
            }

            this.setState({ selectedObject: CrudOption });

            mData = {
                ModuleGroupAccessID: dataObj.ModuleGroupAccessID,
                ModuelID: dataObj.ModuelID,
                Status: value ? 1 : 0,
                Utility: this.state.selectedObject.childs.Modules[index].Utility,
                CrudOption: this.state.selectedObject.childs.Modules[index].CrudOption
            }
            reqObj.Data.push(mData);

            this.setState({ reqObj: reqObj })
        }
    }

    //Update State Value...
    updateStateData = (type, value, mIdx = '', smIdx = '') => {


        let newObj = Object.assign({}, this.state.selectedObject);

        if (type === 'AllMainMenu') {
            var mainList = Object.assign([], newObj);
            for (var i = 0; i < mainList.length; i++) {
                mainList[i]['Status'] = value ? 1 : 0;
            }
            newObj.Modules = mainList;

            this.setState({ mainCheckAll: value ? 1 : 0 });
        }
        else if (type === 'MainMenu') {
            newObj.Modules[mIdx]['Status'] = value ? 1 : 0;
            var checkCount = this.checkAllSubModule(newObj.Modules);

            this.setState({ mainCheckAll: checkCount });
        }
        else if (type === 'AllSubModule') {
            var childList = Object.assign([], newObj['childs']['Modules']);
            for (var j = 0; j < childList.length; j++) {
                childList[j]['Status'] = value ? 1 : 0;
            }
            newObj['childs']['Modules'] = childList;

            this.setState({ checkAll: value ? 1 : 0 });
        }
        else if (type === 'subModule') {
            newObj['childs']['Modules'][smIdx]['Status'] = value ? 1 : 0;
            var checkCounts = this.checkAllSubModule(newObj['childs']['Modules']);
            this.setState({ checkAll: checkCounts });
        }
        this.setState({ selectedObject: newObj });
    }

    //Get Menu Access List
    getMenuAccessAPI(ParentID, GroupID) {
        let reqObj = {
            ParentID: ParentID,
            GroupID: GroupID
        }
        this.props.getMenuAccess(reqObj);
    }

    componentWillReceiveProps(nextProps) {

        // set new object when draweer togle
        if (nextProps.selectedObject.GUID !== this.state.selectedId) {
            this.setState({
                selectedObject: nextProps.selectedObject,
                selectedId: nextProps.selectedObject.GUID
            })
        }

        // set new object when Update module data
        if (this.state.getSelectedObject) {

            this.setState({
                selectedObject: nextProps.selectedObject,
                selectedId: nextProps.selectedObject.GUID,
                getSelectedObject: false
            })
        }

        //display error message when menu list error
        if (nextProps.menuListError &&
            nextProps.menuListError.ReturnCode === 1
            && this.state.getListBit !== nextProps.getListBit && this.state.getData) {

            this.setState({
                getData: false,
                getListBit: nextProps.getListBit
            })

            NotificationManager.error(<IntlMessages id={`apiErrCode.${nextProps.menuListError.ErrorCode}`} />);
        }

        //Get ConfigData
        if (nextProps.menuList &&
            nextProps.menuList.hasOwnProperty('Modules')
            && Object.keys(nextProps.menuList.Modules).length > 0
            && this.state.getListBit !== nextProps.getListBit && this.state.getData) {
            let menuData = Object.assign({}, this.state.cnfgMdlData);
            
            if (this.state.isGetMoreData) {

                menuData.Modules.map((value1, key1) => {
                    if (value1.GUID === this.state.selectedId) {
                        menuData.Modules[key1]['childs'] = nextProps.menuList
                    }

                    if (value1.childs) {

                        value1.childs.Modules.map((child, key2) => {

                            if (child.GUID === this.state.selectedId && value1.GUID === child.ParentGUID) {
                                menuData.Modules[key1].childs.Modules[key2]['childs'] = nextProps.menuList
                            }

                            child.childs && child.childs.Modules.map((item1, key3) => {
                                if (item1.GUID === this.state.selectedId && child.GUID === item1.ParentGUID) {

                                    menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3]['childs'] = nextProps.menuList
                                }

                                item1.childs && item1.childs.Modules.map((item2, key4) => {

                                    if (item2.GUID === this.state.selectedId && item1.GUID === item2.ParentGUID) {

                                        menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4]['childs'] = nextProps.menuList
                                    }

                                    item2.childs && item2.childs.Modules.map((item3, key5) => {

                                        if (item3.GUID === this.state.selectedId && item2.GUID === item3.ParentGUID) {

                                            menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5]['childs'] = nextProps.menuList
                                        }

                                        item3.childs && item3.childs.Modules.map((item4, key6) => {

                                            if (item4.GUID === this.state.selectedId && item3.GUID === item4.ParentGUID) {

                                                menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6]['childs'] = nextProps.menuList
                                            }

                                            item4.childs && item4.childs.Modules.map((item5, key7) => {

                                                if (item5.GUID === this.state.selectedId && item4.GUID === item5.ParentGUID) {

                                                    menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7]['childs'] = nextProps.menuList
                                                }

                                                item5.childs && item5.childs.Modules.map((item6, key8) => {

                                                    if (item6.GUID === this.state.selectedId && item5.GUID === item6.ParentGUID) {

                                                        menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8]['childs'] = nextProps.menuList
                                                    }

                                                    item6.childs && item6.childs.Modules.map((item7, key9) => {

                                                        if (item7.GUID === this.state.selectedId && item6.GUID === item7.ParentGUID) {

                                                            menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9]['childs'] = nextProps.menuList
                                                        }

                                                        item7.childs && item7.childs.Modules.map((item8, key10) => {

                                                            if (item8.GUID === this.state.selectedId && item7.GUID === item8.ParentGUID) {

                                                                menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9].childs.Modules[key10]['childs'] = nextProps.menuList
                                                            }

                                                            item8.childs && item8.childs.Modules.map((item9, key11) => {

                                                                if (item9.GUID === this.state.selectedId && item8.GUID === item9.ParentGUID) {

                                                                    menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9].childs.Modules[key10].childs.Modules[key11]['childs'] = nextProps.menuList
                                                                }

                                                                item9.childs && item9.childs.Modules.map((item10, key12) => {

                                                                    if (item10.GUID === this.state.selectedId && item9.GUID === item10.ParentGUID) {

                                                                        menuData.Modules[key1].childs.Modules[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9].childs.Modules[key10].childs.Modules[key11].childs.Modules[key12]['childs'] = nextProps.menuList
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    })

                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    }

                })

                this.setState({
                    cnfgMdlData: menuData,
                    getListBit: nextProps.getListBit,
                    getData: false,
                    isGetMoreData: false,
                });

            } else {

                //DrawerData
                this.setState({
                    //cnfgMdlData: menuData,
                    cnfgMdlData: nextProps.menuList,
                    getData: false,
                    getListBit: nextProps.getListBit
                });
            }

        }

        //Update Module & Field Data to API
        if (this.state.selCheckbox) {

            this.setState({ selCheckbox: false, openFieldModel: false, reqObj: null });
            if (nextProps.updData.ReturnCode > 0) {
                var errMsg = nextProps.updData.ErrorCode === 1 ? nextProps.updData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updData.ErrorCode}`} />;
                NotificationManager.error(errMsg);
            } else if (nextProps.updData.ReturnCode === 0) {

                this.setState({ getData: true, isGetMoreData: true, selCheckbox: false, openFieldModel: false, reqObj: null });
                this.getMenuAccessAPI(this.state.selectedId, this.state.GroupID);
                var sucMsg = nextProps.updData.ErrorCode === 0 ? nextProps.updData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updData.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
            }
        }
    }

    // update module data and call api 
    UpdateModule = (obj) => {

        this.setState({ selCheckbox: true })

        this.props.updateModuleAccessPermission(obj);
    }

    // update field data and call api 
    UpdateField = (obj) => {
        this.setState({ selCheckbox: true })

        this.props.updateModuleFieldAccess(obj);
    }

    //redner    
    render() {

        const { selectedObject } = this.state;
        const { drawerClose } = this.props;

        //Added by salim dt:8/05/2019...
        //Check if atleast one sub module is check then check all submodule checkbox.
        var checkCount = false;
        if (this.props.selectedObject && this.props.selectedObject.childs &&
            this.props.selectedObject.childs.hasOwnProperty('Modules') && Object.keys(this.props.selectedObject.childs.Modules).length > 0) {
            checkCount = this.checkAllSubModule(this.props.selectedObject.childs.Modules);
        }

        return (
            <Fragment>
                {this.props.loading && <JbsSectionLoader />}

                <div className="jbs-page-content">
                    <div className="page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>{selectedObject.ModuleName}</h2>

                            <Breadcrumb className="tour-step-7 p-0" tag="nav">
                                {this.props.BreadCrumbData.length > 0 &&
                                    this.props.BreadCrumbData.map((list, index) => {
                                        return <BreadcrumbItem active={this.props.BreadCrumbData.length === index + 1}
                                            tag={this.props.BreadCrumbData.length === index + 1 ? "span" : "a"}
                                            key={index} href={this.props.BreadCrumbData.length === index + 1 ?
                                                "" : "javascript:void(0)"} onClick={() =>
                                                    this.props.Toggle(list.GUID, index)}>{list.title}</BreadcrumbItem>
                                    })
                                }
                            </Breadcrumb>
                        </div>
                        <div className="page-title-wrap">
                            <MatButton className="btn-warning text-white mr-10 mb-10 btnsmall" variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></MatButton>
                            <MatButton className="btn-info text-white mr-10 mb-10 btnsmall" variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></MatButton>
                        </div>
                    </div>

                    <Form>
                        <table className="table">
                            <colgroup>
                                <col width="30%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                            </colgroup>

                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">
                                        <Checkbox color="primary" name="View"
                                            checked={checkCount}
                                            onChange={(e) => this.updateStateData('AllSubModule', e.target.checked)}
                                        /><IntlMessages id="sidebar.modules" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.view" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.create" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.edit" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.delete" /></th>

                                    <th scope="col" className="text-center"><IntlMessages id="sidebar.utilityPrivileges" /></th>
                                    <th scope="col" className="text-center"><IntlMessages id="sidebar.fieldPrivileges" /></th>
                                    <th scope="col" className="text-center"></th>
                                </tr>
                            </thead>

                            <tbody>

                                {selectedObject.childs
                                    &&
                                    <Fragment>
                                        { selectedObject.childs.Modules.map((smdlList, smIndex) => {

                                            let findCreateIndex = smdlList.CrudOption ? smdlList.CrudOption.indexOf('04F44CE0') : -1

                                            var findUpdateIndex = smdlList.CrudOption ? smdlList.CrudOption.indexOf('0BB7ACAC') : -1

                                            var findViewIndex = smdlList.CrudOption ? smdlList.CrudOption.indexOf('6AF64827') : -1

                                            var findDeleteIndex = smdlList.CrudOption ? smdlList.CrudOption.indexOf('B873B896') : -1

                                            return <tr key={smIndex}>
                                                <td><Checkbox color="primary"
                                                    name="Module" checked={smdlList.Status}
                                                    onChange={(e) => this.updateStateData('subModule', e.target.checked, 0, smIndex)} />
                                                    {smdlList.ModuleName} ( {getMenuType(smdlList.Type)} )</td>
                                                {
                                                    smdlList.Type === '3425D53F' && smdlList.HasChild ?
                                                        <td className="text-center">
                                                            <Checkbox color="primary"
                                                                name="View" checked={findViewIndex !== -1}
                                                                onChange={(e) => this.moduleChangeData('list_form', e.target.checked, smdlList, smIndex, '6AF64827')} /></td>
                                                        :
                                                        <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }

                                                {
                                                    smdlList.Type === '3425D53F' && smdlList.HasChild ?
                                                        <td className="text-center">
                                                            <Checkbox color="primary"
                                                                name="Create" checked={findCreateIndex !== -1}
                                                                onChange={(e) => this.moduleChangeData('list_form', e.target.checked, smdlList,smIndex,'04F44CE0')} /></td>
                                                        :
                                                        <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }
                                                {
                                                    smdlList.Type === '3425D53F' && smdlList.HasChild ?
                                                        <td className="text-center">
                                                            <Checkbox color="primary"
                                                                name="Edit" checked={findUpdateIndex !== -1}
                                                                onChange={(e) => this.moduleChangeData('list_form', e.target.checked, smdlList, smIndex, '0BB7ACAC')}
                                                            /></td>
                                                        :
                                                        <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }
                                                {
                                                    smdlList.Type === '3425D53F' && smdlList.HasChild ?
                                                        <td className="text-center">
                                                            <Checkbox color="primary"
                                                                name="Delete" checked={findDeleteIndex !== -1}
                                                                onChange={(e) => this.moduleChangeData('list_form', e.target.checked, smdlList, smIndex, 'B873B896')}
                                                            /></td>
                                                        :
                                                        <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }

                                                <td className="text-center">
                                                    {
                                                        smdlList.Type === '3425D53F' ?
                                                            (smdlList.Utility && smdlList.HasNext && smdlList.Status === 1 ?

                                                                <span onClick={(event) => this.openModel(event, smdlList.ModuleName, smdlList)}
                                                                    className="text-dark mr-5 cursor_pointer">
                                                                    <i className="zmdi zmdi-settings zmdi-hc-2x">
                                                                    </i></span>
                                                                :

                                                                <span
                                                                    className="text-dark mr-5 cursor_pointer">
                                                                    <i className="zmdi zmdi-settings zmdi-hc-2x">
                                                                    </i></span>)
                                                            :
                                                            <i className="fa fa-close text-danger" />
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        smdlList.Type === '9AAD5A4E' ?
                                                            (smdlList.Fields && smdlList.HasNext && smdlList.Status === 1 && smdlList.Fields.length > 0 ?
                                                                <span onClick={(event) => this.openModel(event, smdlList.ModuleName, smdlList)}
                                                                    className="text-dark mr-5 cursor_pointer">
                                                                    <i className="zmdi zmdi-settings zmdi-hc-2x">
                                                                    </i></span>

                                                                :

                                                                <span onClick={(event) => smdlList.Status === 0 ?
                                                                    NotificationManager.error(<IntlMessages id="sidebar.checkAndSave" />)
                                                                    :
                                                                    NotificationManager.error(<IntlMessages id="sidebar.fieldsNotAvailable" />)}
                                                                    className="text-dark mr-5 cursor_pointer">
                                                                    <i className="zmdi zmdi-settings zmdi-hc-2x">
                                                                    </i></span>
                                                            )
                                                            :
                                                            <i className="fa fa-close text-danger" />
                                                    }

                                                </td>
                                                <td className="text-center">

                                                    {smdlList.HasChild && smdlList.HasNext && smdlList.Status === 1 && <a href="javascript:void(0)"
                                                        onClick={(event) => this.props.GetChildData(event, smdlList)}>
                                                        <i style={{ fontSize: "18px" }} className="fa fa-plus-circle" /></a>
                                                    }
                                                </td>
                                            </tr>
                                            // }
                                        })}
                                    </Fragment>

                                }
                            </tbody>
                        </table>
                        {selectedObject.childs &&
                            <div className="mt-10 text-right">
                                <Button disabled={this.props.loading} variant="raised" color="primary" className="mr-10" onClick={(e) => { this.updateModuleAccessRight(e, 'subModule', 0); this.setState({ getSelectedObject: true }) }}><IntlMessages id={"sidebar.btnSave"} /></Button>
                                <Button disabled={this.props.loading} variant="raised" color="danger" onClick={drawerClose}><IntlMessages id="button.back" /></Button>
                            </div>}
                    </Form>
                </div>

                <Modal isOpen={this.state.openFieldModel} className="modal-lg">

                    <FieldModal
                        CloseModal={this.CloseModal}
                        selectedData={this.state.selectedData}
                        GroupID={this.props.GroupID}
                        UpdateField={this.UpdateField}
                        UpdateModule={this.UpdateModule}
                    />
                </Modal>

            </Fragment>
        )
    }
}

//Added by salim dt:07/05/2019..
//Default props...
OpenNextDrawer.defaultProps = {
    GroupID: 0
}

const mapStateToProps = ({ GetMenuAccessReducer, drawerclose }) => {

    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }


    const { loading, menuList, getListBit, updData, menuListError } = GetMenuAccessReducer;
    return { loading, menuList, getListBit, drawerclose, updData, menuListError };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getMenuAccess,
        updateModuleAccessPermission,
        updateModuleFieldAccess
    }
)(OpenNextDrawer);