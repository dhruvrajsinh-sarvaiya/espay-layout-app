//compoennt for ser permission to the dashbaord by Tejas

import React, { Component, Fragment } from 'react';

// used for connect  component with store
import { connect } from "react-redux";

// import for design
import { Form, Button } from "reactstrap";

//used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// used for display notifications
import { NotificationManager } from "react-notifications";

// import for expansion panel
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';

// import for set menu/field(module) type
import { getMenuType } from 'Helpers/helpers';

//  used for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// intl messages
import IntlMessages from "Util/IntlMessages";

//import component
import OpenNextDrawer from './OpenNextDrawer';

//Added by salim dt:06/05/2019
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
//Added By Tejas For Get Data With Saga
import {
    getMenuAccess,
    updateModuleAccessPermission //Added by salim dt:06/05/2019
} from "Actions";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// used for open in drawer
const components = {
    OpenNextDrawer: OpenNextDrawer
}

// create dynamic component
const dynamicComponent = (TagName, props, drawerClose, closeAll, menuDetails, selectedObject, BreadCrumbData, GroupID, GetChildData, moduleChangeData, Toggle) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, menuDetails, selectedObject, BreadCrumbData, GroupID, GetChildData, moduleChangeData, Toggle });
};

//class for Set User permissions
class SetPermission extends Component {

    //constructor and set default state
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            selectedObject: {},
            getData: false,
            cnfgMdlData: {},
            expanded: 0,
            getListBit: 0,
            selectedId: "00000000-0000-0000-0000-000000000000",
            isGetMoreData: false,
            showData: false,
            //Added by salim dt:07/05/2019...
            GroupID: this.props.GroupID,
            bitGroupID: true,
            checkAll: false,
            mainCheckAll: false,
            isExpandSubModule: false,
            selCheckbox: false,
            updAPIData: {
                Data: []
            },
            getMainData: false,
            BreadCrumbData: [
            ],
            DrawerData: [],
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
            
        };
    }

    //used for close drawer 
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false, componentName: ""
        });
    };

    //used for close drawer and open drawer id available
    toggleDrawer = () => {

        let array = this.state.BreadCrumbData.splice(0, this.state.BreadCrumbData.length - 1)

        let selectedId = this.state.DrawerData[this.state.selectedId].ParentGUID;

        if (this.state.DrawerData[selectedId].ParentGUID !== '00000000-0000-0000-0000-000000000000') {

            delete this.state.DrawerData[this.state.selectedId];

            this.setState({ BreadCrumbData: array, DrawerData: this.state.DrawerData, selectedId: selectedId });
            this.showComponent('OpenNextDrawer', array, 0)
        } else {

            this.setState({ open: false, componentName: '', BreadCrumbData: array, DrawerData: this.state.DrawerData, selectedId: selectedId });
        }

    }

    //Expand Panel Change....
    expandPanelChange = (panel, value) => (event, expanded) => {

        let breadCrumb = [];

        breadCrumb.push({ title: value.ModuleName, link: '', index: 1, GUID: value.GUID })

        if (value.ParentGUID === '00000000-0000-0000-0000-000000000000' && !value.childs) {
            let info = this.state.DrawerData;

            info[value.GUID] = value

            this.setState({
                selectedId: value.GUID,
                isGetMoreData: true,
                getData: true,
                selectedObject: value,
                expanded: expanded ? panel : '',
                isExpandSubModule: true,
                DrawerData: info,
                BreadCrumbData: breadCrumb
            })

            this.getMenuAccessAPI(value.GUID, this.state.GroupID);

        } else {
            this.setState({ expanded: expanded ? panel : '', BreadCrumbData: breadCrumb });
        }


    };

    // call api for get menu access data 
    GetChildData = (event, selectedObject) => {

        let info = this.state.DrawerData;
        info[selectedObject.GUID] = selectedObject

        this.setState({
            selectedId: selectedObject.GUID,
            isGetMoreData: true,
            showData: true,
            getData: true,
            selectedObject: selectedObject,
            DrawerData: info
        });

        this.getMenuAccessAPI(selectedObject.GUID, this.state.GroupID);

    }
    componentWillMount() {
        this.props.getMenuPermissionByID('627E46A0-6181-4C1A-6B15-A1EF259930E8');

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
    /* update menu details if not set */        
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }

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

            var menuData = this.state.cnfgMdlData

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


                if (this.state.showData) {
                    this.showComponent('OpenNextDrawer', this.state.BreadCrumbData, 1)
                }

                this.setState({
                    cnfgMdlData: menuData,
                    getListBit: nextProps.getListBit,
                    getData: false,
                    isGetMoreData: false,
                });

            } else {
                
                
                //DrawerData
                this.setState({
                    cnfgMdlData: nextProps.menuList,
                    getData: false,
                    getListBit: nextProps.getListBit,
                    expanded:0
                });
            }

        }


        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({ open: false });
        }

        //Added by salim dt:07/05/2019..
        //Set GroupID from the parent props...
        if (Object.keys(nextProps.pagedata.prmData).length > 0 && this.state.bitGroupID) {
            let GroupID = nextProps.pagedata.prmData.GroupID;
            this.getMenuAccessAPI(this.state.selectedId, GroupID);
            this.setState({ GroupID: GroupID, bitGroupID: false, getData: true });
        }


        //Update Module & Field Data to API
        if (this.state.selCheckbox) {

            this.setState({ selCheckbox: false });
            if (nextProps.updData.ReturnCode > 0) {
                var errMsg = nextProps.updData.ErrorCode === 1 ? nextProps.updData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updData.ErrorCode}`} />;
                NotificationManager.error(errMsg);
            } else if (nextProps.updData.ReturnCode === 0) {

                if (this.state.getMainData) {

                    this.setState({ getData: true, isGetMoreData: false, getMainData: false,selectedId:"00000000-0000-0000-0000-000000000000" });
                    this.getMenuAccessAPI("00000000-0000-0000-0000-000000000000", this.state.GroupID);
                } else {

                    this.setState({ getData: true, isGetMoreData: true });
                    this.getMenuAccessAPI(this.state.selectedId, this.state.GroupID);
                }
                
                var sucMsg = nextProps.updData.ErrorCode === 0 ? nextProps.updData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updData.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
            }
        }

        //Check if atleast one sub module is check then check all submodule checkbox.
        if (nextProps.menuList.hasOwnProperty('Modules') && Object.keys(nextProps.menuList.Modules).length > 0 && this.state.isExpandSubModule) {
            var checkCount = this.checkAllSubModule(nextProps.menuList.Modules);
            this.setState({ checkAll: checkCount, isExpandSubModule: false });
        }

        //Check if atleast one sub module is check then check all submodule checkbox.
        if (nextProps.menuList.hasOwnProperty('Modules') && Object.keys(nextProps.menuList.Modules).length > 0 && this.state.getListBit === 0) {
            var checkCount = this.checkAllSubModule(nextProps.menuList.Modules);
            this.setState({ mainCheckAll: checkCount });
        }
    }

      /* check menu permission */
      checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    // used for set component name dynamically
    showComponent = (componentName, BreadCrumbData, isToggle) => {

        // check permission go on next page or not        
        let data = BreadCrumbData


        if (this.state.selectedId !== '00000000-0000-0000-0000-000000000000' && isToggle) {
            data.push({ title: this.state.selectedObject.ModuleName, link: '', index: 0, GUID: this.state.selectedObject.GUID })
        }

        this.setState({
            componentName: componentName,
            open: true,//!this.state.open,
            showData: false,
            BreadCrumbData: data
        });
    }

    //Added by salim dt:07/05/2019...
    //Check All submodule check is check or not...
    checkAllSubModule = (dataObj) => {
        var checkCount = 0;
        dataObj.map((mList, index) => {
            if (mList.Status) { checkCount += 1; }
        });

        // return checkCount > 0 ? true : false;
        return checkCount === dataObj.length ? true : false;
    }

    //Update State Value...
    updateStateData = (type, value, mIdx = '', smIdx = '') => {
        let newObj = Object.assign({}, this.state.cnfgMdlData);

        if (type === 'AllMainMenu') {
            var mainList = Object.assign([], newObj.Modules);
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
            var childList = Object.assign([], newObj.Modules[mIdx]['childs']['Modules']);
            for (var i = 0; i < childList.length; i++) {
                childList[i]['Status'] = value ? 1 : 0;
            }
            newObj.Modules[mIdx]['childs']['Modules'] = childList;
            this.setState({ checkAll: value ? 1 : 0 });
        }
        else if (type === 'subModule') {
            newObj.Modules[mIdx]['childs']['Modules'][smIdx]['Status'] = value ? 1 : 0;
            var checkCount = this.checkAllSubModule(newObj.Modules[mIdx]['childs']['Modules']);
            this.setState({ checkAll: checkCount });
        }
        this.setState({ cnfgMdlData: newObj });
    }

    //Update Module Access Permission API Call
    updateModuleAccessRight = (event, type, index) => {
        event.preventDefault();
        var reqObj = { GroupID: this.state.GroupID };
        reqObj.Data = [];

        if (type === 'MainMenu') {
            this.state.cnfgMdlData.Modules.map((item, index) => {              
                let mData = {
                    ModuleGroupAccessID: item.ModuleGroupAccessID,
                    ModuelID: item.ModuelID,
                    Status: item.Status, //1,
                    Utility: item.Utility,
                    CrudOption: item.CrudOption
                }
                reqObj.Data.push(mData);

            });
        } else if (type === 'subModule') {
            this.state.cnfgMdlData.Modules[index]['childs']['Modules'].map((item, index) => {

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

    //Get Menu Access List
    getMenuAccessAPI(ParentID, GroupID) {
        let reqObj = {
            ParentID: ParentID,
            GroupID: GroupID
        }
        this.props.getMenuAccess(reqObj);
    }

    //used for handle drawer and open specific component based on guid
    ToggleData = (GUID, index) => {

        let array = []

        this.state.BreadCrumbData.map((value, key) => {
            if (index >= key) {
                array.push(value)
            }
        })

        if (this.state.DrawerData[GUID].ParentGUID !== '00000000-0000-0000-0000-000000000000') {

            this.setState({ BreadCrumbData: array, DrawerData: this.state.DrawerData, selectedId: GUID });
            this.showComponent('OpenNextDrawer', array, 0)
        } else {

            this.setState({ open: false, componentName: '', BreadCrumbData: array, DrawerData: this.state.DrawerData, selectedId: GUID });
        }
    }

    // renders the component
    render() {

        // used for display creadcrumbdata
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
                title: <IntlMessages id="sidebar.userManagement" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="my_account.permissionGroups" />,
                link: '',
                index: 2
            },
            {
                title: <IntlMessages id="sidebar.listRolePermissionGroup" />,
                link: '',
                index: 3
            },
            {
                title: <IntlMessages id="my_account.editPermissionGroups" />,
                link: '',
                index: 4
            }
        ]

        const { cnfgMdlData, expanded } = this.state;
        const { drawerClose } = this.props; //Added by salim dt:06/05/2019
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('bae65420-21a9-8257-a42d-317705be68b8'); 
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        //returns the component
        return (
            <Fragment>
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">

                    {<WalletPageTitle
                        title={<IntlMessages id="my_account.editPermissionGroups" />}
                        breadCrumbData={BreadCrumbData}
                        drawerClose={drawerClose}
                        closeAll={this.closeAll}
                    />}
                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check edit curd operation
                        (<Form>
                            {typeof cnfgMdlData.Modules !== 'undefined' && cnfgMdlData.Modules.length > 0 &&
                                <Fragment>
                                    {/* Added by salim dt:07/05/2019 */}
                                    <div>
                                        <Checkbox
                                            color="primary"
                                            checked={this.state.mainCheckAll ? true : false}
                                            onChange={(e) => this.updateStateData('AllMainMenu', e.target.checked)} /><IntlMessages id="sidebar.selectAll" />
                                    </div>
                                    {cnfgMdlData.Modules.map((mdlList, mIndex) => {

                                        return <ExpansionPanel disabled={(mdlList.HasNext === false || mdlList.HasChild === false || mdlList.Status === 0) ? true : false} key={mIndex} className="epd_panel grp_prmsn m-0 expansion-panel-data" square expanded={expanded === 'pgMdl' + mdlList.ID} onChange={this.expandPanelChange('pgMdl' + mdlList.ID, mdlList)}>

                                            <Checkbox className="m_chcbox" color="primary" checked={mdlList.Status} onChange={(e) => this.updateStateData('MainMenu', e.target.checked, mIndex)} />
                                            <ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                                                {mdlList.ModuleName} ( {getMenuType(mdlList.Type)} )
                                        </ExpansionPanelSummary>


                                            <ExpansionPanelDetails className="epd_detail">
                                                <table className="table">
                                                    <colgroup>
                                                        <col width="30%" />
                                                        <col width="10%" />
                                                        <col width="10%" />
                                                        <col width="10%" />
                                                        <col width="10%" />
                                                        <col width="20%" />
                                                        <col width="10%" />
                                                    </colgroup>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th scope="col">
                                                                <Checkbox color="primary"
                                                                    name="View"
                                                                    checked={this.state.checkAll}
                                                                    onChange={(e) => this.updateStateData('AllSubModule', e.target.checked, mIndex)}
                                                                /><IntlMessages id="sidebar.modules" /></th>

                                                            {mdlList.Type === '3425D53F' ?

                                                                <th scope="col" className="text-center">
                                                                    <IntlMessages id="sidebar.create" /></th>

                                                                :
                                                                <th scope="col"></th>
                                                            }

                                                            {mdlList.Type === '3425D53F' ?
                                                                <th scope="col" className="text-center">
                                                                    <IntlMessages id="sidebar.edit" /></th>

                                                                :

                                                                <th scope="col"></th>
                                                            }

                                                            {mdlList.Type === '3425D53F' ?
                                                                <th scope="col" className="text-center">
                                                                    <IntlMessages id="sidebar.delete" /></th>

                                                                :
                                                                <th scope="col"></th>
                                                            }

                                                            {mdlList.Type === '7253F413' ?
                                                                <th scope="col" className="text-center">
                                                                    <IntlMessages id="sidebar.view" /></th>
                                                                :
                                                                <th scope="col"></th>
                                                            }

                                                            <th scope="col" className="text-center"></th>
                                                            <th scope="col" className="text-center"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {mdlList.childs
                                                            &&
                                                            <Fragment>
                                                                {mdlList.childs.Modules.map((smdlList, smIndex) => {
                                                                    return <tr key={smIndex}>
                                                                        <td><Checkbox color="primary"
                                                                            name="Module" checked={smdlList.Status}
                                                                            onChange={(e) => this.updateStateData('subModule', e.target.checked, mIndex, smIndex)} />
                                                                            {smdlList.ModuleName} ( {getMenuType(smdlList.Type)} )</td>

                                                                        {mdlList.Type === '7253F413' ?
                                                                            <td className="text-center"><Checkbox color="primary" name="Create" checked={smdlList.Create} onChange={(e) => this.updateStateData('subModule', e.target.checked, mIndex, smIndex)} /></td>
                                                                            :
                                                                            <td></td>
                                                                        }
                                                                        {mdlList.Type === '7253F413' ?
                                                                            <td className="text-center"><Checkbox color="primary" name="Edit" checked={smdlList.Edit} onChange={(e) => this.updateStateData('subModule', e.target.checked, mIndex, smIndex)} /></td>
                                                                            :
                                                                            <td></td>
                                                                        }
                                                                        {mdlList.Type === '7253F413' ?
                                                                            <td className="text-center"><Checkbox color="primary" name="Delete" checked={smdlList.Delete} onChange={(e) => this.updateStateData('subModule', e.target.checked, mIndex, smIndex)} /></td>
                                                                            :
                                                                            <td></td>
                                                                        }
                                                                        {mdlList.Type === '7253F413' ?
                                                                            <td className="text-center"><Checkbox color="primary" name="Delete" checked={smdlList.Delete} onChange={(e) => this.updateStateData('subModule', e.target.checked, mIndex, smIndex)} /></td>
                                                                            :
                                                                            <td></td>
                                                                        }

                                                                        <td></td>
                                                                        <td className="text-center">
                                                                            {smdlList.HasChild &&
                                                                                smdlList.HasNext &&
                                                                                smdlList.Status === 1 &&
                                                                                <a href="javascript:void(0)"
                                                                                    onClick={(event) => { this.GetChildData(event, smdlList) }}>
                                                                                    <i style={{ fontSize: "18px" }} className="fa fa-plus-circle" /></a>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                })}
                                                            </Fragment>
                                                        }
                                                    </tbody>
                                                </table>
                                                {/* Added by salim dt:07/05/2019 */}
                                                {mdlList.childs &&
                                                    <div className="mt-10 text-right">
                                                        <Button disabled={this.props.loading} variant="raised" color="primary" className="mr-10" onClick={(e) => this.updateModuleAccessRight(e, 'subModule', mIndex)}><IntlMessages id={"sidebar.btnSave"} /></Button>
                                                        <Button disabled={this.props.loading} variant="raised" color="danger" onClick={drawerClose}><IntlMessages id="button.back" /></Button>
                                                    </div>}
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    })}
                                    {/* Added by salim dt:07/05/2019 */}
                                    <div className="mt-10 text-right">
                                        <Button disabled={this.props.loading} variant="raised" color="primary" className="mr-10" onClick={(e) => { this.updateModuleAccessRight(e, 'MainMenu'); this.setState({ getMainData: true }) }}><IntlMessages id={"sidebar.btnSave"} /></Button>
                                        <Button disabled={this.props.loading} variant="raised" color="danger" onClick={drawerClose}><IntlMessages id="button.back" /></Button>
                                    </div>
                                </Fragment>
                            }
                        </Form>)
                    }
                </div>

                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    placement="right"
                    //level=".drawer1"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >

                    {this.state.componentName !== '' && dynamicComponent(
                        this.state.componentName,
                        this.props,
                        this.toggleDrawer,
                        this.closeAll,
                        this.state.cnfgMdlData,
                        this.state.DrawerData[this.state.selectedId],
                        this.state.BreadCrumbData,
                        this.state.GroupID,
                        this.GetChildData,
                        this.updateStateData,
                        this.ToggleData
                    )}
                </Drawer>
            </Fragment>
        )
    }
}

//Added by salim dt:07/05/2019..
//Default props...
SetPermission.defaultProps = {
    GroupID: 0,
    prmData: {}
}

const mapStateToProps = ({ getMenuAccess, drawerclose,authTokenRdcer }) => {

    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, menuList, getListBit, menuListError, updData } = getMenuAccess;
    return { loading, menuList, drawerclose, getListBit, menuListError, updData ,        menuLoading,
        menu_rights};
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getMenuAccess,
        updateModuleAccessPermission,
        getMenuPermissionByID,
    }
)(SetPermission); 