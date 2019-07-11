/* 
    Developer : Nishant Vadgama
    Date : 21-09-2018
    File Comment : Convert Token history component model
*/

import React from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
// import component for Card Design
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getConvertHistory } from "Actions/ConvertToken";

// Deposit & Withdraw History widget
class ConvertHistory extends React.Component {
  componentWillMount() {
    this.props.getConvertHistory();
  }

  render() {
    const columns = ["Sr", "Coin", "Amount", "Price", "Total", "Date"];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false
    };
    return (
      <JbsCollapsibleCard
        colClasses="col-sm-12 col-md-12 col-xl-6"
        heading={<IntlMessages id="wallet.CTHistoryTitle" />}
        fullBlock
      >
        {this.props.showLoading && <JbsSectionLoader />}
        <div className={this.props.darkMode ? 'StackingHistorydarkmode':'StackingHistory'}>
          <MUIDataTable
            title={""}
            data={this.props.historyList.map((item, key) => {
              return [
                key + 1,
                item.coin,
                item.amount,
                item.price,
                item.total,
                item.date
              ];
            })}
            columns={columns}
            options={options}
          />
        </div>
      </JbsCollapsibleCard>
    );
  }
}

const mapDispatchToProps = ({ convertHistory , settings }) => {
  const { darkMode } = settings;
  const { showLoading, historyList } = convertHistory;
  return { showLoading, historyList , darkMode };
};

export default connect(
  mapDispatchToProps,
  {
    getConvertHistory
  }
)(ConvertHistory);
