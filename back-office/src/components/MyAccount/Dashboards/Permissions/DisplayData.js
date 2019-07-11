// component for display More dat by Tejas 2/5/2019

import React, { Fragment, Component } from 'react';

// used for connect  component with store
import { connect } from "react-redux";

// import for design
import {
    Form,
    Modal,
} from "reactstrap";

import FieldModal from './ViewFieldModal';

//used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

import { NotificationManager } from "react-notifications";

//  used for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// intl messages
import IntlMessages from "Util/IntlMessages";

//import component
import DisplayMoreData from './DisplayMoreDrawer';

//Added By Tejas For Get Data With Saga
import {
    getMenuAccess,
} from "Actions";

const components = {
    DisplayMoreData: DisplayMoreData
}

const dynamicComponent = (TagName, props, drawerClose, closeAll, menuDetails, selectedObject, BreadCrumbData) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, menuDetails, selectedObject, BreadCrumbData });
};


//class for more data
class DisplayData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            componentName: '',
            getData: false,
            selectedObject: this.props.selectedObject,
            cnfgMdlData: this.props.menuDetails,
            expanded: 0,
            getListBit: 0,
            selectedId: this.props.selectedObject.GUID,
            isGetMoreData: false,
            fieldList: [],
            openFieldModel: false,
            selectedData: {},
            selectedValue: {},
            BreadCrumbData: this.props.BreadCrumbData
        };
    }

    //used for close drawer 
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false, componentName: "", BreadCrumbData: this.props.BreadCrumbData });
    };

    openModel = (event, name, value) => {

        event.preventDefault();

        this.setState({
            openFieldModel: true,
            selectedData: value
        })
    }

    CloseModal = () => {
        this.setState({
            openFieldModel: false
        })
    }

    //used for close drawer
    toggleDrawer = () => {
        this.setState({ open: false, componentName: "", BreadCrumbData: this.props.BreadCrumbData });
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.menuList &&
            nextProps.menuList.hasOwnProperty('Modules')
            && Object.keys(nextProps.menuList.Modules).length === 0
            && this.state.getListBit !== nextProps.getListBit && this.state.getData) {

            this.setState({
                getData: false
            })
            NotificationManager.error(<IntlMessages id="trading.market.label.nodata" />)
        }

        if (nextProps.menuList &&
            nextProps.menuList.hasOwnProperty('Modules')
            && Object.keys(nextProps.menuList.Modules).length > 0
            && this.state.getListBit !== nextProps.getListBit && this.state.getData) {

            let menuData = Object.assign({},this.state.selectedObject);
            if (this.state.isGetMoreData) {

                menuData.childs && menuData.childs.Modules.map((value1, key1) => {

                    if (value1.GUID === this.state.selectedId) {

                        menuData.childs.Modules[key1]['childs'] = nextProps.menuList
                    }

                    if (value1.childs) {

                        value1.childs.Modules.map((child, key2) => {

                            if (child.GUID === this.state.selectedId && value1.GUID === child.ParentGUID) {

                                menuData.childs.Modules[key1].childs.Modules[key2]['childs'] = nextProps.menuList
                            }

                            child.childs && child.childs.Modules.map((item1, key3) => {
                                if (item1.GUID === this.state.selectedId && child.GUID === item1.ParentGUID) {

                                    menuData.childs.Modules[key1].childs[key2].childs.Modules[key3]['childs'] = nextProps.menuList
                                }

                                item1.childs && item1.childs.Modules.map((item2, key4) => {

                                    if (item2.GUID === this.state.selectedId && item1.GUID === item2.ParentGUID) {

                                        menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4]['childs'] = nextProps.menuList
                                    }

                                    item2.childs && item2.childs.Modules.map((item3, key5) => {

                                        if (item3.GUID === this.state.selectedId && item2.GUID === item3.ParentGUID) {

                                            menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5]['childs'] = nextProps.menuList
                                        }

                                        item3.childs && item3.childs.Modules.map((item4, key6) => {

                                            if (item4.GUID === this.state.selectedId && item3.GUID === item4.ParentGUID) {

                                                menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6]['childs'] = nextProps.menuList
                                            }

                                            item4.childs && item4.childs.Modules.map((item5, key7) => {

                                                if (item5.GUID === this.state.selectedId && item4.GUID === item5.ParentGUID) {

                                                    menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7]['childs'] = nextProps.menuList
                                                }

                                                item5.childs && item5.childs.Modules.map((item6, key8) => {

                                                    if (item6.GUID === this.state.selectedId && item5.GUID === item6.ParentGUID) {

                                                        menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8]['childs'] = nextProps.menuList
                                                    }

                                                    item6.childs && item6.childs.Modules.map((item7, key9) => {

                                                        if (item7.GUID === this.state.selectedId && item6.GUID === item7.ParentGUID) {

                                                            menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9]['childs'] = nextProps.menuList
                                                        }

                                                        item7.childs && item7.childs.Modules.map((item8, key10) => {

                                                            if (item8.GUID === this.state.selectedId && item7.GUID === item8.ParentGUID) {

                                                                menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9].childs.Modules[key10]['childs'] = nextProps.menuList
                                                            }

                                                            item8.childs && item8.childs.Modules.map((item9, key11) => {

                                                                if (item9.GUID === this.state.selectedId && item8.GUID === item9.ParentGUID) {

                                                                    menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9].childs.Modules[key10].childs.Modules[key11]['childs'] = nextProps.menuList
                                                                }

                                                                item9.childs && item9.childs.Modules.map((item10, key12) => {

                                                                    if (item10.GUID === this.state.selectedId && item9.GUID === item10.ParentGUID) {

                                                                        menuData.childs.Modules[key1].childs[key2].childs.Modules[key3].childs.Modules[key4].childs.Modules[key5].childs.Modules[key6].childs.Modules[key7].childs.Modules[key8].childs.Modules[key9].childs.Modules[key10].childs.Modules[key11].childs.Modules[key12]['childs'] = nextProps.menuList
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

                let data = Object.assign({}, this.state.BreadCrumbData);
                data.push({ title: this.state.selectedValue.ModuleName, link: '', index: 0 })

                this.showComponent('DisplayMoreData', this.state.selectedValue)

                this.setState({
                    selectedObject: menuData,
                    getListBit: nextProps.getListBit,
                    getData: false,
                    BreadCrumbData: data
                });
            }
        }

    }

    // used for set component name dynamically
    showComponent = (componentName, selectedValue) => {

        this.setState({
            componentName: componentName,
            selectedObject: selectedValue,
            open: this.state.open ? false : true,
            isGetMoreData: false
        });
    }

    // call api for get menu access data 
    GetChildData = (event, selectedObject) => {

        this.setState({
            selectedId: selectedObject.GUID,
            isGetMoreData: true,
            showData: true,
            getData: true,
            selectedValue: selectedObject,
        })

        this.props.getMenuAccess(
            {
                ParentID: selectedObject.GUID,
                GroupID: "2"
            }
        );
    }

    //renders the component
    render() {

        const { selectedObject } = this.state;

        const { drawerClose } = this.props;

        return (
            <Fragment>
                {this.props.loading && <JbsSectionLoader />}

                <div className="jbs-page-content">
                    <WalletPageTitle
                        title={selectedObject.ModuleName}
                        breadCrumbData={this.state.BreadCrumbData}
                        drawerClose={drawerClose}
                        closeAll={this.closeAll}
                    />

                    <Form>
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
                                    <th scope="col"><IntlMessages id="sidebar.modules" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.view" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.create" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.edit" /></th>

                                    <th scope="col" className="text-center">
                                        <IntlMessages id="sidebar.delete" /></th>

                                    <th scope="col"><IntlMessages id="sidebar.fieldPrivileges" /></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedObject.childs
                                    &&
                                    <Fragment>
                                        {selectedObject.childs.Modules.map((smdlList, smIndex) => (
                                            <tr key={smIndex}>
                                                <td>{smdlList.ModuleName}</td>
                                                {(
                                                    smdlList.Type === '625CAE5E'
                                                    || smdlList.Type === '7253F413'
                                                    || smdlList.Type === '3425D53F'
                                                    || smdlList.Type === '9AAD5A4E'
                                                    || smdlList.Type === '70D4AD9A'
                                                    || smdlList.Type === '256BFF65'

                                                ) &&
                                                    <td className="text-center">
                                                        <Checkbox color="primary" name="View"
                                                            checked={smdlList.View} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, smIndex, smIndex)} /></td>
                                                }
                                                {smdlList.Type === '3425D53F' ?
                                                    <td className="text-center"><Checkbox color="primary" name="Create" checked={smdlList.Create} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, smIndex, smIndex)} /></td>
                                                    :
                                                    <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }
                                                {smdlList.Type === '3425D53F' ?
                                                    <td className="text-center"><Checkbox color="primary" name="Edit" checked={smdlList.Edit} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, smIndex, smIndex)} /></td>
                                                    :
                                                    <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }
                                                {smdlList.Type === '3425D53F' ?
                                                    <td className="text-center"><Checkbox color="primary" name="Delete" checked={smdlList.Delete} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, smIndex, smIndex)} /></td>
                                                    :
                                                    <td className="text-center"><i className="fa fa-close text-danger" /></td>
                                                }

                                                <td>
                                                    {(smdlList.Type === '3425D53F' || smdlList.Type === '9AAD5A4E') &&
                                                        (smdlList.Utility && smdlList.Utility.length > 0 ||
                                                            smdlList.Fields && smdlList.Fields.length > 0) ?
                                                        <span disabled={(smdlList.Type !== '3425D53F' || smdlList.Type !== '9AAD5A4E')} onClick={(event) => this.openModel(event, smdlList.ModuleName, smdlList)}
                                                            className="text-dark mr-5 cursor_pointer">
                                                            <i className="zmdi zmdi-settings zmdi-hc-2x">
                                                            </i></span>
                                                        :
                                                        <span
                                                            className="text-dark mr-5">
                                                            <i className="zmdi zmdi-settings zmdi-hc-2x">
                                                            </i></span>
                                                    }

                                                </td>
                                                <td>
                                                    {smdlList.HasChild ?
                                                        <a href="javascript:void(0)" onClick={(event) => { this.GetChildData(event, smdlList) }}><i className="fa fa-angle-double-right" /></a>
                                                        :
                                                        <a href="javascript:void(0)" onClick={(event) => { NotificationManager.error(<IntlMessages id="sidebar.childsNotAvailable" />) }}><i className="fa fa-angle-double-right" /></a>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                }
                            </tbody>
                        </table>
                    </Form>

                </div>

                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    level={null}
                    placement="right"
                    levelMove={100}
                    getContainer={null}
                    showMask={false}
                >

                    {this.state.componentName != '' &&
                        dynamicComponent(this.state.componentName,
                            this.props, this.toggleDrawer, this.closeAll,
                            this.state.cnfgMdlData, this.state.selectedValue,
                            this.state.BreadCrumbData
                        )}
                </Drawer>

                <Modal isOpen={this.state.openFieldModel} className="modal-lg">

                    <FieldModal
                        CloseModal={this.CloseModal}
                        selectedData={this.state.selectedData}
                    />
                </Modal>
            </Fragment>
        )
    }
}


const mapStateToProps = ({ GetMenuAccessReducer, drawerclose }) => {

    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { loading, menuList, getListBit } = GetMenuAccessReducer;
    return { loading, menuList, drawerclose, getListBit };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getMenuAccess,
    }
)(DisplayData);