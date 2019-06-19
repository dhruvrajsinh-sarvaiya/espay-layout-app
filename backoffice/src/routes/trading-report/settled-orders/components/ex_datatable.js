/**
 * About Us Page
 */
import React from "react";
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

const ExDatatable = ({ title, data, columns, options }) => {
  return (
    <div className="StackingHistory">
      <JbsCollapsibleCard
        heading={<IntlMessages id={title} />}
        //reloadable
        fullBlock
      >
        <MUIDataTable
          title=""
          data={data}
          columns={columns}
          options={options}
        />
      </JbsCollapsibleCard>
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
