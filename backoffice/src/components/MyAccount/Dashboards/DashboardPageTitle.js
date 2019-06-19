/* 
    Developer : Salim Deraiya
    Date : 28-11-2018
    File Comment : Used To Display Dashboard Page Title, Breadcrumbs & Buttons
*/
import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Button from '@material-ui/core/Button';

class DashboardPageTitle extends Component {
    render() {
        const { title, enableBreadCrumb, breadCrumbData, enableButton, drawerClose, closeAll,close2Level } = this.props;
        return (
            <div className="page-title d-flex justify-content-between align-items-center">
               <div className="page-title-wrap">
                { title && 
                    <h2>{title}</h2>
                }
                { enableBreadCrumb &&
                    <Breadcrumb className="tour-step-7 p-0" tag="nav">
                        {breadCrumbData.length > 0 &&
                            breadCrumbData.map((list,index) => {
                                return <BreadcrumbItem active={breadCrumbData.length === index + 1} tag={breadCrumbData.length === index + 1 ? "span" : "a"} key={index} href={breadCrumbData.length === index + 1 ? "" : "javascript:void(0)"}  onClick={list.index && list.index==1 ? drawerClose : list.index === 2 ? close2Level :closeAll}>{list.title}</BreadcrumbItem>                                
                            })                        
                        }
                    </Breadcrumb>                     
                }
                </div>
                { enableButton &&
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10 btnsmall" variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10 btnsmall" variant="fab" mini onClick={closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                }
            </div>
        )
    }
}

// default props value
DashboardPageTitle.defaultProps = {
    breadCrumbData: [],
    enableBreadCrumb: true,
    enableButton: true
}

export {DashboardPageTitle};
