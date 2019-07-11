/**
 * Theme Configuration Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button, FormGroup } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

// redux actions
import { getLanguageList, submitThemeConfig } from "Actions";

class ThemeConfigurationWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themevalue: "Dark",
      languageOption: "English",
      checkedSwitch: true
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitLanguage = this.onSubmitLanguage.bind(this);
  }

  componentWillMount() {
    this.props.getLanguageList();
  }

  onSubmitLanguage(item) {
    this.setState({ languageOption: item.name });
  }

  handleCheckChange = name => (event, checked) => {
    this.setState({ [name]: checked });
    if (checked === true) {
      this.setState({ themevalue: "Dark" });
    } else {
      this.setState({ themevalue: "Light" });
    }
  };

  onSubmit(event) {
    const { themevalue, languageOption } = this.state;
    this.props.submitThemeConfig({ themevalue, languageOption });
  }

  render() {
    const data = this.props.languageList;
    return (
      <Fragment>
        <h2 className="heading p-10 mb-20 text-center bg-primary text-white">
          <IntlMessages id="sidebar.themeConfiguration" />
        </h2>
        <div className="mb-0 offset-md-3">
          <form>
            <FormGroup>
              <div className="row">
                <label className="col-sm-12 col-md-2 col-form-label align-middle">
                  <IntlMessages id="sidebar.themeMode" />
                </label>
                <div className="col-sm-12 col-md-6">
                  <div>
                    <IntlMessages id="themeOptions.sidebarLight" />
                    <FormControlLabel
                      className="m-0"
                      control={
                        <Switch
                          checked={this.state.checkedSwitch}
                          onChange={this.handleCheckChange("checkedSwitch")}
                          color="primary"
                          className="switch-btn"
                        />
                      }
                    />
                    <IntlMessages id="themeOptions.sidebarDark" />
                  </div>
                </div>
              </div>
            </FormGroup>

            <FormGroup>
              <div className="row">
                <label className="col-sm-12 col-md-2 col-form-label align-middle">
                  <IntlMessages id="sidebar.languageOption" />
                </label>
                <div className="col-sm-12 col-md-6">
                  <div>
                    <div className="row">
                      {data.map((item, i) => {
                        return [
                          <div key={i} className="col-sm-12 col-md-3 mb-10">
                            <Button
                              color="primary"
                              onClick={() => this.onSubmitLanguage(item)}
                            >
                              {item.name}
                            </Button>
                          </div>
                        ];
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </FormGroup>

            <div className="row">
              <div className="col-md-2 col-sm-12 offset-md-2">
                <Button
                  variant="raised"
                  color="primary"
                  className=" text-white text-center btn-block"
                  onClick={this.onSubmit}
                >
                  <IntlMessages id="sidebar.btnSubmit" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ themeConfig }) => {
  var response = {
    languageList: themeConfig.ThemeConfigData,
    loading: themeConfig.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getLanguageList,
    submitThemeConfig
  }
)(ThemeConfigurationWdgt);
