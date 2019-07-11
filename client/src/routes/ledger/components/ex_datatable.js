/**
 * Data Table For Ledger
 */
import React from "react";
import MUIDataTable from "mui-datatables";

const ExDatatable = ({ data, columns, options , darkMode }) => {
  return (
    <div className={darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto':'DepositWithdrawHistory tbl_overflow_auto'}>
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