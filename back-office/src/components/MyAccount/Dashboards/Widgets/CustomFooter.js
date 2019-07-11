import React, { Fragment } from 'react';
import { Input, Row, Col } from 'reactstrap';
import IntlMessages from "Util/IntlMessages";
import Pagination from "react-js-pagination";
import AppConfig from 'Constants/AppConfig';

const CustomFooter = ({ count, rowsPerPage, onChangeRowsPerPage, page, handlePageChange }) => {
    return (
        <Fragment>
            {count > AppConfig.totalRecordDisplayInList &&
                <Row className="pagination_area">
                    <Col md={4} sm={12} className="p_total"><div className="m-15"><IntlMessages id="pagination.totalCount" /> {count}</div></Col>
                    <Col md={8} sm={12} className="p_info">
                        <ul className="text-right m-15 paginationmain">
                            <li className="pagerecord p_rowperpage">
                                <ul>
                                    <li><IntlMessages id="pagination.rowPerPage" /></li>
                                    <li><Input type="select" name="rowPerPage" value={rowsPerPage} onChange={onChangeRowsPerPage}>
                                        {/* <option>100</option>
                                        <option>250</option>
                                        <option>500</option>
                                        <option>1000</option> */}
                                        {/* CODE ADDED BY DEVANG PAREKH FOR HANDLE ROW PER PAGE FROM APP CONFIG (9-4-2019) */}
                                        {
                                            AppConfig.rowsPerPageOptions.map((item, key) => {
                                                return <option key={key}>{item}</option>
                                            })
                                        }
                                        {/* code end */}

                                    </Input>
                                    </li>
                                </ul>
                            </li>
                            <li className="clearfix p_no">
                                <Pagination
                                    hideDisabled
                                    prevPageText={<span aria-hidden="true" className="ti-angle-left"></span>}
                                    nextPageText={<span aria-hidden="true" className=" ti-angle-right"></span>}
                                    firstPageText={<span aria-hidden="true" className="ti-angle-double-left"></span>}
                                    lastPageText={<span aria-hidden="true" className="ti-angle-double-right"></span>}
                                    activePage={page}
                                    itemsCountPerPage={rowsPerPage}
                                    totalItemsCount={count}
                                    pageRangeDisplayed={5}
                                    onChange={handlePageChange}
                                />
                            </li>
                            <li className="pagerecord p_records">
                                <span>{page > 1 ? (1) + (rowsPerPage * (page - 1)) + ' - ' + ((rowsPerPage * page) > count ? (count) : (rowsPerPage * page)) : (1) + ' - ' + ((rowsPerPage * page) > count ? (count) : (rowsPerPage * page))} of {count} Records</span>
                            </li>
                        </ul>
                    </Col>
                </Row>
            }
        </Fragment>
    )
};
export { CustomFooter };
