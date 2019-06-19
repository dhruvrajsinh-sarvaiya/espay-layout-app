/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 28-11-2018
    UpdatedDate : 30-11-2018
    Description : CMS Pages Breadcrumb
*/
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
const DashboardPageTitle = ({ title, enableBreadCrumb, breadCrumbData, enableButton, drawerClose, closeAll, close2Level }) => {
    // const path = match.path.substr(1);
    // const subPath = path.split('/');
    return (
        <div className="page-title d-flex justify-content-between align-items-center">
            <div className="page-title-wrap">
                {title && <h2>{title}</h2>}

                {enableBreadCrumb &&
                    <Breadcrumb className="tour-step-7 p-0" tag="nav">
                        {/* {breadCrumbData.length > 0 &&
                            breadCrumbData.map((list,index) => {
                                return <BreadcrumbItem active={breadCrumbData.length === index + 1} tag={breadCrumbData.length === index + 1 ? "span" : "a"} key={index} href={breadCrumbData.length === index + 1 ? "" : "javascript:void(0)"}  onClick={list.index && list.index==1 ? drawerClose : breadCrumbData.length === index + 1 ? null:closeAll}>{list.title}</BreadcrumbItem>
                            })                        
                        } */}
                        {/* Change By Megha Kariya (05-02-2019) */}
                        {breadCrumbData.length > 0 &&
                            breadCrumbData.map((list, index) => {
                                return <BreadcrumbItem active={breadCrumbData.length === index + 1} tag={breadCrumbData.length === index + 1 ? "span" : "a"} key={index} href={breadCrumbData.length === index + 1 ? "" : "javascript:void(0)"} onClick={list.index && list.index == 1 ? drawerClose : breadCrumbData.length === index + 1 ? null : list.index === 2 ? close2Level : closeAll}>{list.title}</BreadcrumbItem>
                            })
                        }
                    </Breadcrumb>
                }
            </div>
            {enableButton &&
                <div className="page-title-wrap drawer_btn mb-10 text-right">
                    <Button className="btn-warning text-white mr-10 mb-10 btnsmall" variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                    <Button className="btn-info text-white mr-10 mb-10 btnsmall" variant="fab" mini onClick={closeAll}><i className="zmdi zmdi-home"></i></Button>
                </div>
            }
        </div>
    )
};

// default props value
DashboardPageTitle.defaultProps = {
    breadCrumbData: [],
    enableBreadCrumb: true,
    enableButton: true
}

export { DashboardPageTitle };