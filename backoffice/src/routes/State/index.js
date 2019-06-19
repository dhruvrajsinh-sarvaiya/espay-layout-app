/**
 * CreatedBy :Raj Kangad
 * Date :08/10/2018
 */
/**
 * countries
 */
import React, { Component } from "react";
import MUIDataTable from "mui-datatables";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

import {
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

const countrylist = [
  {
    statename: "Lakshadweep",
    Zone_Name: "Badakhs",
    State_Code: "ALA"
  },
  {
    statename: "Madhya Pradesh",
    Zone_Name: "Badghis	",
    State_Code: "AFG"
  },
  {
    statename: "Maharashtra",
    Zone_Name: "Bahrain",
    State_Code: "ALB"
  },
  {
    statename: "Algeria",
    Zone_Name: "Azerbaijan",
    State_Code: "DZA"
  },
  {
    statename: "Manipur",
    Zone_Name: "Bamian",
    State_Code: "ASM"
  },
  {
    statename: "Imphal",
    Zone_Name: "Ascension Island",
    State_Code: "ADM"
  }
];

export default class index extends Component {
  constructor(props) {
    super();
    this.state = {
      errors: "",
      selectedUser: null,
      open: false,
      userrole: "Administrator",
      id: "",
      modal: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const columns = [
      {
        name: <IntlMessages id="state.State.name" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="state.State Name" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="state.State Code" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="state.State.action" />,
        options: { sort: true, filter: true }
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: true,
      download: false,
      viewColumns: true,
      print: false,
      search: true,
      sort: true
    };
    return (
      <div className="responsive-table-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.state" />}
          match={this.props.match}
        />

        <JbsCollapsibleCard fullBlock>
          <MUIDataTable
            title={"State List"}
            data={countrylist.map(item => {
              return [
                item.statename,
                item.Zone_Name,
                item.State_Code,

                <div className="list-action">
                  <a onClick={this.toggle}>
                    {this.props.buttonLabel}
                    <i className="ti-pencil" />
                  </a>
                </div>
              ];
            })}
            columns={columns}
            options={options}
          />
        </JbsCollapsibleCard>

        <Row>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Edit State</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="text">State Name</Label>
                  <Input
                    type="text"
                    name="Zone Name"
                    id="Zone Name"
                    placeholder=""
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="text">State Code</Label>
                  <Input
                    type="text"
                    name="Zone Code "
                    id="Zone Code"
                    placeholder=""
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="Select" className="pt-20">
                    Country
                  </Label>
                  <Input type="select" name="select" id="Select Country">
                    <option>Afghanistan</option>
                    <option>Algeria</option>
                    <option>Andorra</option>
                    <option>Algeria</option>
                    <option>Antarctica</option>
                    <option>Angola</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="Select" className="pt-20">
                    Status
                  </Label>
                  <Input type="select" name="select" id="Select Status">
                    <option>Enable</option>
                    <option>Disable</option>
                  </Input>
                </FormGroup>
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={this.toggle}>
                Save
              </Button>
              <Button color="danger" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Row>
      </div>
    );
  }
}
