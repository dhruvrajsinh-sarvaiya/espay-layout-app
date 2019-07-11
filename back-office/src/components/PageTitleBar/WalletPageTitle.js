import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { DrawerClose } from 'Actions/DrawerClose';
class WalletPageTitle extends Component {
    method = (index) => {
        var open;
        switch (index) {
            case 0:
                return [
                    open = {
                        open1: false,
                        open2: false,
                        open3: false,
                        open4: false,
                        open5: false,
                        open6: false,
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 1:

                return [

                    open = {
                        open2: false,
                        open3: false,
                        open4: false,
                        open5: false,
                        open6: false,
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 2:

                return [

                    open = {
                        open3: false,
                        open4: false,
                        open5: false,
                        open6: false,
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 3:

                return [

                    open = {
                        open4: false,
                        open5: false,
                        open6: false,
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 4:

                return [

                    open = {
                        open5: false,
                        open6: false,
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 5:
                return [
                    open = {
                        open6: false,
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 6:
                return [
                    open = {
                        open7: false,
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 7:
                return [
                    open = {
                        open8: false,
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 8:
                return [
                    open = {
                        open9: false,
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 9:
                return [
                    open = {
                        open10: false,
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
            case 10:
                return [
                    open = {
                        open11: false
                    },
                    this.props.DrawerClose(open)
                ]
        }
    }

    /*Added by salim dt:29/05/2019
    * Parent Drawer Close method
    * Also clear filter data is isClearData pass true and also pass clear method.
    */
    drawerClose = () => {
        if (this.props.isClearData) {
            this.props.clearDataFun(false);
        }
        this.props.drawerClose();
    }

    render() {
        const { title, enableBreadCrumb, breadCrumbData, closeAll, enableButton } = this.props;
        return (
            <div className="page-title d-flex justify-content-between align-items-center">
                <div className="page-title-wrap">
                    {title &&
                        <h2>{title}</h2>
                    }
                    {enableBreadCrumb &&
                        <Breadcrumb className="tour-step-7 p-0" tag="nav">
                            {breadCrumbData.length > 0 &&
                                breadCrumbData.map((list, index) => {
                                    return <BreadcrumbItem active={breadCrumbData.length === index + 1} tag={breadCrumbData.length === index + 1 ? "span" : "a"} key={index} href={breadCrumbData.length === index + 1 ? "" : "javascript:void(0)"} onClick={() => this.method(list.index)}>{list.title}</BreadcrumbItem>
                                })
                            }
                        </Breadcrumb>
                    }
                </div>
                {enableButton &&
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 btnsmall" variant="fab" mini onClick={this.drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white btnsmall" variant="fab" mini onClick={closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                }
            </div>
        )
    }
}

// default props value
WalletPageTitle.defaultProps = {
    breadCrumbData: [],
    enableBreadCrumb: true,
    enableButton: true,
    clearData: false,
}
const mapStateToProps = ({ ChargeConfiguration }) => {
    return { ChargeConfiguration }
};
export default connect(
    mapStateToProps, { DrawerClose })(WalletPageTitle);

