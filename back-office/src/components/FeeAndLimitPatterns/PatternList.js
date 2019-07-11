/* 
    Developer : Nishant Vadgama
    Date : 28-09-2018
    File Comment : Fee and limit patterns list component
*/
import React from "react";
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { getPatternList, deletePattern } from "Actions/FeeAndLimitPatterns";
import Button from "@material-ui/core/Button";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import PatternAddForm from "Routes/fee-limit-patterns/add";
import PatternEditForm from "Routes/fee-limit-patterns/edit";

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

const components = {
  PatternAddForm: PatternAddForm,
  PatternEditForm: PatternEditForm
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata) => {
  return React.createElement(components[TagName], {
    props,
    drawerClose,
    closeAll,
    pagedata
  });
};

class PatternList extends React.Component {
  state = {
    selectedDeletedPatterns: null,
    open: false,
    pagedata: {}
  };
  onClick = () => {
    this.setState({ open: this.state.open ? false : true });
  };

  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
  };

  componentWillMount() {
    this.props.getPatternList();
  }

  onDeletePatterns(item) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedDeletedPatterns: item });
  }

  deletePatterns() {
    this.refs.deleteConfirmationDialog.close();
    let patternsData = this.props.patternList;
    let index = patternsData.indexOf(this.state.selectedDeletedPatterns);
    setTimeout(() => {
      patternsData.splice(index, 1);
    }, 1500);
    this.props.deletePattern(index);
  }

  showComponent = (componentName, page = "") => {
    if (page !== "") {
      this.setState({ pagedata: page });
    }
    this.setState({
      componentName: componentName,
      open: this.state.open ? false : true
    });
  };

  render() {
    const { drawerClose } = this.props;
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.patternName" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.patternDescription" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.exchange" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: true, filter: false }
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      print: false,
      search: true,
      customToolbar: () => {
        return (
          <Button
            variant="raised"
            className="btn-primary text-white mt-5"
            style={{ float: "right" }}
            onClick={() => this.showComponent("PatternAddForm")}
          >
            <IntlMessages id="button.addNew" />
          </Button>
        );
      }
    };

    return (
      <JbsCollapsibleCard>
        <div className="StackingHistory">
          <div className="page-title d-flex justify-content-between align-items-center">
            <h2>
              <span>{<IntlMessages id="sidebar.feesAndLimitPatterns" />}</span>
            </h2>
            <div className="page-title-wrap">
              <Button
                className="btn-warning text-white mr-10 mb-10"
                style={buttonSizeSmall}
                variant="fab"
                mini
                onClick={drawerClose}
              >
                <i className="zmdi zmdi-mail-reply" />
              </Button>
              <Button
                className="btn-info text-white mr-10 mb-10"
                style={buttonSizeSmall}
                variant="fab"
                mini
                onClick={this.closeAll}
              >
                <i className="zmdi zmdi-home" />
              </Button>
            </div>
          </div>
          <MUIDataTable
            data={this.props.patternList.map(item => {
              return [
                item.id,
                item.patternName,
                item.patternDescription,
                item.status,
                item.exchange,
                <div className="list-action">
                  <a
                    className="mr-10"
                    href="javascript:void(0)"
                    onClick={e => this.showComponent("PatternEditForm", item.id)}
                  >
                    <i className="ti-pencil" />
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.onDeletePatterns(item)}
                  >
                    <i className="ti-close" />
                  </a>
                </div>
              ];
            })}
            columns={columns}
            options={options}
          />
          {/* Delete Customer Confirmation Dialog */}
          <DeleteConfirmationDialog
            ref="deleteConfirmationDialog"
            title="Are You Sure Want To Delete?"
            message="Are You Sure Want To Delete Permanently This Data."
            onConfirm={() => this.deletePatterns()}
          />
          <Drawer
            width="100%"
            handler={false}
            open={this.state.open}
            onMaskClick={this.toggleDrawer}
            className="drawer2"
            level=".drawer1"
            placement="right"
            levelMove={100}
          >
            {this.state.componentName !== "" &&
              dynamicComponent(
                this.state.componentName,
                this.props,
                this.onClick,
                this.closeAll,
                this.state.pagedata
              )}
          </Drawer>
        </div>
      </JbsCollapsibleCard>
    );
  }
}

const mapStateToProps = ({ patternListReducer }) => {
  const { patternList, loading } = patternListReducer;
  return { patternList, loading };
};

export default connect(
  mapStateToProps,
  {
    getPatternList,
    deletePattern
  }
)(PatternList);
