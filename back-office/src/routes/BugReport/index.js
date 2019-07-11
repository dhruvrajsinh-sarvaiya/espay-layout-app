// Component For Bug Report By Tejas Date : 9/10/2018

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { getFileList, clearFileList, getFileDetail } from "Actions/BugReport";

// import loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

import MUIDataTable from "mui-datatables";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import MatButton from "@material-ui/core/Button";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

// define Bug Report component
class BugReport extends Component {
  // make default state values on load
  constructor(props) {
    super();
    this.state = {
      fileList: [],
      open: false,
      dialogData: [],
      sectionReload: false,
      fileDetail: []
    };
  }

  handleClearData = (event, item = {}) => {
    event.preventDefault();
    if (Object.keys(item).length) {
      this.props.clearFileList({ data: item });
    } else {
      if (this.state.fileDetail) {
        this.props.clearFileList({ data: this.state.fileDetail });
      }
    }
    this.setState({ open: false, dialogData: [] });
  };

  handleClose = () => {
    this.setState({ open: false, dialogData: [] });
  };

  componentDidMount() {
    this.props.getFileList();
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.fileList) {
      this.setState({
        fileList: nextprops.fileList
      });
    }

    if (nextprops.fileDetails !== this.props.fileDetail) {
      this.setState({
        sectionReload: false,
        fileDetail: nextprops.fileDetails
      });
    }
  }

  onEdit = (event, value) => {
    event.preventDefault();
    const fileID = value.id;
    this.setState({ sectionReload: true, open: true });
    this.props.getFileDetail({ fileID });
  };

  onClear = (event, value) => {
    event.preventDefault();
  };

  render() {
    var data = this.state.fileList;
    const { drawerClose } = this.props;
    // define options for data tables
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: false
    };

    // define columns for data tables
    const columns = [
      {
        name: <IntlMessages id={"bugreport.list.column.label.index"} />
      },
      {
        name: <IntlMessages id={"bugreport.list.column.label.date"} />
      },
      {
        name: <IntlMessages id={"bugreport.list.column.label.name"} />
      },
      {
        name: <IntlMessages id={"bugreport.list.column.label.action"} />
      }
    ];

    return (
      <Fragment>
        <div className="charts-widgets-wrapper">
          <div className="m-20 page-title d-flex justify-content-between align-items-center">
            <div className="page-title-wrap">
              <h2><IntlMessages id="sidebar.bugReport" /></h2>
            </div>
            <div className="page-title-wrap">
              <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
              <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
            </div>
          </div>
          <div className="mb-10 Bug-Report">
            {data.length ? (
              <MUIDataTable
                data={data.map((item, key) => {
                  return [
                    item.id,
                    item.date,
                    item.fileName,
                    <span>
                      <a
                        href="#"
                        onClick={event => {
                          this.onEdit(event, item);
                        }}
                      >
                        <i className="material-icons">edit</i>{" "}
                      </a>
                      <a
                        href="#"
                        onClick={event => {
                          this.handleClearData(event, item);
                        }}
                      >
                        <i className="material-icons">clear</i>{" "}
                      </a>
                    </span>
                  ];
                })}
                columns={columns}
                options={options}
              />
            ) : (
                ""
              )}
          </div>
        </div>
        {this.state.sectionReload && <JbsSectionLoader />}
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <div className="row mb-50">
            <AppBar className="bg-primary">
              <Toolbar>
                <IconButton
                  color="inherit"
                  onClick={this.handleClose}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
                <h5 className="w-100 mb-0">
                  <IntlMessages id="bugreport.list.dialog.label.title" />
                </h5>

                <MatButton
                  variant="raised"
                  className="btn-inherit text-white"
                  onClick={this.handleClearData}
                >
                  <IntlMessages id="bugreport.list.dialog.button.clear" />
                </MatButton>
              </Toolbar>
            </AppBar>
          </div>
          {this.state.fileDetail && (
            <div className="mt-20 ml-10">
              <pre style={{ padding: "25px" }}>{this.state.fileDetail}</pre>
            </div>
          )}
        </Dialog>
      </Fragment>
    );
  }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  fileList: state.bugReport.fileList,
  fileDetails: state.bugReport.fileDetail,
  loading: state.bugReport.loading
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  { getFileList, clearFileList, getFileDetail }
)(BugReport);
