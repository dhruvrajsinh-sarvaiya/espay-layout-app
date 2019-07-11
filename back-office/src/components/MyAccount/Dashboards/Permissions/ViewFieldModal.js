// component for display modal Tejas 6/5/2019

import React, { Component, Fragment } from 'react';

import {
    Button,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from 'reactstrap';

//used for slider for fields data
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

// import for connect store
import { connect } from 'react-redux';

//used for conver messages in different language
import IntlMessages from 'Util/IntlMessages';
import { Checkbox } from '@material-ui/core';

//used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Added By Tejas For Get Data With Saga
import {
    updateModuleAccessPermission,
    updateModuleFieldAccess
} from "Actions";

const Utility = [
    "D42A3D17",
    "204CE299",
    "8B92994B",
    "18736530",
    "8E6956F5",
]

// class for display modal
class FieldModal extends Component {

    //constructor and ser default state
    constructor(props) {
        super(props)
        this.state = {
            GroupID: this.props.GroupID,
            selectedData: this.props.selectedData,
            visibility: false,
            accessRight: false,
            required: false,
            visibilityData: ""
        }
    }

    // set handleChange Event for Switch button
    SetVisibility = (value, index) => {

        let fieldsData = this.state.selectedData

        if (value === 0) {

            fieldsData.Fields[index].Visibility = 'AD6A01D2'
        } else if (value === 1) {

            fieldsData.Fields[index].Visibility = 'E925F86B'
            fieldsData.Fields[index].AccessRight = '11E6E7B0'
        } else if (value === 2) {

            fieldsData.Fields[index].Visibility = 'E925F86B'
            fieldsData.Fields[index].AccessRight = '6AB0714D'
        }

        this.setState({ selectedData: fieldsData });
    };

    // set object for update field data
    updateFieldData = (event) => {
        event.preventDefault()
        var reqObj = { GroupID: this.state.GroupID };
        reqObj.Data = [];

        this.state.selectedData.Fields.map((item, index) => {
            let mData = {
                ModuleGroupAccessID: this.state.selectedData.ModuleGroupAccessID,
                ModuleFormAccessID: item.ModuleFormAccessID,
                FiledID: item.FiledID, //1,
                Visibility: item.Visibility,
                AccessRights: item.AccessRight,
                Required: item.Required
            }
            reqObj.Data.push(mData);
        });

        this.props.UpdateField(reqObj)
    }

    //Update Module Access Permission API Call
    updateModuleAccessRight = (event, type, index) => {
        event.preventDefault();
        var reqObj = { GroupID: this.state.GroupID };
        reqObj.Data = [];
        let data = []
        Utility.map((value1, indexs) => {
            var findIndex = this.state.selectedData.Utility.indexOf(value1)
            if (findIndex !== -1) {
                data.push(value1)
            }
            return [];
        })

        let mData = {
            ModuleGroupAccessID: this.state.selectedData.ModuleGroupAccessID,
            ModuelID: this.state.selectedData.ModuelID,
            Status: this.state.selectedData.Status,
            Utility: data,
            CrudOption: this.state.selectedData.CrudOption
        }

        reqObj.Data.push(mData);
        this.props.UpdateModule(reqObj)
    }

    // used fro set object of utility data
    updateStateData = (value, utility) => {

        var data = this.state.selectedData
        if (value) {

            data.Utility.push(utility)
            this.setState({
                selectedData: data
            })
        } else {

            data.Utility.splice(data.Utility.indexOf(utility), 1)
            this.setState({ selectedData: data })
        }
    }

    //renders the component
    render() {

        return (
            <Fragment>

                <ModalHeader className="modal_header_success">
                    <div className="row">

                        {this.state.selectedData.Type === '3425D53F' &&

                            <h2 className="m-10 "><IntlMessages id="walletDashboard.lblUtils" /></h2>
                        }

                        {this.state.selectedData.Type === '9AAD5A4E' &&

                            <div className="d-flex">
                                <h2 className="m-10"><IntlMessages id="sidebar.fields.permission" /></h2>
                            </div>
                        }
                    </div>
                </ModalHeader>

                <ModalBody>

                    {this.props.loading && <JbsSectionLoader />}
                    {this.state.selectedData.Type === '3425D53F' &&
                        this.state.selectedData.Utility !== undefined
                        && this.state.selectedData.Utility !== null
                        &&
                        <div className="col-md-12">
                            <h3 className="m-5">
                                {this.state.selectedData.ModuleName}
                            </h3>
                            <div className="row">

                                {Utility.map((value1, index) => {
                                    var findIndex = this.state.selectedData.Utility ? this.state.selectedData.Utility.indexOf(value1) : -1
                                    return <div className="col-md-4 d-flex" key={index}>
                                        {value1 === 'D42A3D17' &&
                                            <span className="m-5">
                                                <Checkbox
                                                    color="primary"
                                                    checked={findIndex !== -1}
                                                    onChange={(e) => this.updateStateData(e.target.checked, 'D42A3D17')}
                                                />
                                                <IntlMessages id="sidebar.upload" />
                                            </span>
                                        }

                                        {value1 === '204CE299' &&
                                            <span className="m-5">
                                                <Checkbox
                                                    color="primary"
                                                    checked={findIndex !== -1}
                                                    onChange={(e) => this.updateStateData(e.target.checked, '204CE299')}
                                                />
                                                <IntlMessages id="sidebar.print" />
                                            </span>
                                        }

                                        {value1 === '8B92994B' &&
                                            <span className="m-5">
                                                <Checkbox
                                                    color="primary"
                                                    checked={findIndex !== -1}
                                                    onChange={(e) => this.updateStateData(e.target.checked, '8B92994B')}
                                                />
                                                <IntlMessages id="sidebar.download" />
                                            </span>
                                        }

                                        {value1 === '18736530' &&
                                            <span className="m-5">
                                                <Checkbox
                                                    color="primary"
                                                    checked={findIndex !== -1}
                                                    onChange={(e) => this.updateStateData(e.target.checked, '18736530')}
                                                />
                                                <IntlMessages id="sidebar.filter" />
                                            </span>
                                        }

                                        {value1 === '8E6956F5' &&
                                            <span className="m-5">
                                                <Checkbox
                                                    color="primary"
                                                    checked={findIndex !== -1}
                                                    onChange={(e) => this.updateStateData(e.target.checked, '8E6956F5')}
                                                />
                                                <IntlMessages id="sidebar.search" />
                                            </span>
                                        }

                                    </div>
                                })

                                }

                            </div>
                        </div>
                    }

                    {this.state.selectedData.Type === '9AAD5A4E' &&
                        this.state.selectedData.Fields !== undefined
                        && this.state.selectedData.Fields !== null
                        &&
                        <Fragment>
                            <div className="stsLbl">
                                <span className="lspn"><IntlMessages id="sidebar.invisible" /></span>
                                <span className="lspn"><IntlMessages id="sidebar.readOnly" /></span>
                                <span className="lspn"><IntlMessages id="sidebar.write" /></span>
                            </div>
                            <div className="row">
                                {this.state.selectedData.Fields.map((value, fIndex) => {
                                    return (
                                        <div
                                            className='col-md-4 d-flex' key={fIndex}>
                                            <div className="rng_sld slider">
                                                {
                                                    value.Visibility === 'E925F86B' && value.AccessRight === '11E6E7B0'
                                                    && <Slider min={0} max={2} tooltip={false} value={1}
                                                        className={value.Required === '74CF80F9' ? 'visibledata' : ''}
                                                        onChange={(e) => { value.Required === '8E21B258' && this.SetVisibility(e, fIndex) }}
                                                    />
                                                }
                                                {
                                                    value.Visibility === 'E925F86B' && value.AccessRight === '6AB0714D' &&
                                                    <Slider
                                                        className={value.Required === '74CF80F9' ? 'visibledata' : ''}
                                                        min={0} max={2} tooltip={false} value={2}
                                                        onChange={(e) => { value.Required === '8E21B258' && this.SetVisibility(e, fIndex) }}
                                                    />

                                                }

                                                {
                                                    (value.Visibility === 'AD6A01D2') &&
                                                    <Slider min={0} max={2} tooltip={false} value={0}
                                                        className={value.Required === '74CF80F9' ? 'visibledata' : ''}
                                                        onChange={(e) => { value.Required === '8E21B258' && this.SetVisibility(e, fIndex) }}
                                                    />
                                                }
                                            </div>
                                            <span className="ml-5 d-flex">
                                                <p>{value.FieldName}</p>
                                                {value.Required === '74CF80F9' && <p className="text-danger">*</p>}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </Fragment>
                    }
                </ModalBody>

                <ModalFooter>

                    <div className="row">

                        {this.state.selectedData.Type === '3425D53F' &&
                            <Button
                                disabled={this.props.loading}
                                variant="raised"
                                color="primary"
                                className="text-white m-5"
                                onClick={(e) => this.updateModuleAccessRight(e)}>
                                <IntlMessages id={"sidebar.btnSave"} />
                            </Button>
                        }

                        {this.state.selectedData.Type === '9AAD5A4E' &&
                            <Button
                                disabled={this.props.loading}
                                variant="raised"
                                color="primary"
                                className="text-white m-5"
                                onClick={(e) => this.updateFieldData(e)}>
                                <IntlMessages id={"sidebar.btnSave"} />
                            </Button>
                        }

                        <Button
                            variant="raised"
                            color="danger"
                            onClick={() => this.props.CloseModal()}
                            className="btn-danger text-white m-5"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>

                    </div>

                </ModalFooter>
            </Fragment>
        )
    }
}

FieldModal.defaultProps = {
    GroupID: 0,
    prmData: {}
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ GetMenuAccessReducer }) => {

    const { loading, menuList, getListBit, menuListError, updData } = GetMenuAccessReducer;
    return { loading, menuList, getListBit, menuListError, updData };
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        updateModuleAccessPermission,
        updateModuleFieldAccess
    }
)(FieldModal);