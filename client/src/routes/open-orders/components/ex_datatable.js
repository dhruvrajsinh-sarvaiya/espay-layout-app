/**
 * About Us Page
 */
import React from "react";
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

const ExDatatable = ({ title, data, columns, options }) => {
	return (
		<div className="transaction-history-detail tbl_overflow_auto">
			<MUIDataTable
				title={<IntlMessages id={title} />}
				data={data}
				columns={columns}
				options={options}
			/>
		</div>
	);
}

ExDatatable.defaultProps = {
  title: "",
  data: [],
  columns: [],
  options: []
};

export default ExDatatable;
