/**
 * Data Table For Ledger
 */
import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

const ExDatatable = ({ title, data, columns, options , darkMode,loading }) => {
  return (
    <div className={darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto':'DepositWithdrawHistory tbl_overflow_auto'}>
    {/* { loading &&
					<JbsSectionLoader />
				} */}
        <MUIDataTable
          title=""
          data={data}
          columns={columns}
          options={options}
        />      
    </div>
  );
};

ExDatatable.defaultProps = {
  title: "",
  data: [],
  columns: [],
  options: []
};

export default ExDatatable;
