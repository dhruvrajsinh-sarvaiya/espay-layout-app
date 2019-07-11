/**
 * About Us Page
 */
import React from "react";
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

const ExDatatable = ({ title, data, columns, options , darkMode, intl }) => {
  return (
    <div className={darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto':'DepositWithdrawHistory tbl_overflow_auto'}>
      <MUIDataTable
        title={<IntlMessages id={title} />}
        data={data.map(item => {
          {var type = item.Type == "BUY" ? intl.formatMessage({id:"sidebar.openOrders.filterLabel.type.buy"}) :
          intl.formatMessage({id:"sidebar.openOrders.filterLabel.type.sell"})}

          {var status = data.IsCancel == 1 ? intl.formatMessage({id:'myorders.response.status.2' }): intl.formatMessage({id:`myorders.response.status.${item.Status}`})}
          return [
            item.DateTime.replace('T', ' ').split('.')[0],
            item.PairName ? item.PairName.replace("_","/"):"",
            type,
            parseFloat(item.SettledQty).toFixed(8),
            (parseFloat(item.Price) === 0 ? intl.formatMessage({id:"trading.placeorder.label.market"}) : parseFloat(item.Price).toFixed(8)),
            parseFloat(item.Amount).toFixed(8),
            parseFloat(item.ChargeRs).toFixed(8),
            parseFloat(item.Total).toFixed(8),
            item.SettledDate.replace('T', ' ').split('.')[0],            
            status
          ];
        })}
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
