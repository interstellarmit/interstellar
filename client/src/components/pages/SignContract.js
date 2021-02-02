import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import logo from "../../../dist/favicon.png";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


class SignContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isStudent: true,
      doesAbide: true,
      importClasses: true,
      classYear: undefined,
      yearOptions: ['2020', '2021', '2022', '2023', '2024']
    };
  }

  submitForm = () => {
    this.props.signContract(this.state.importClasses, this.state.classYear);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  onSelect = (event) => {
    this.setState({ classYear: event.value })
  }

  render() {
    return (
      <>
        <Row justify={"center"}>
          <Col>
            <div
              style={{
                height: "100vh",
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={logo} style={{ height: "200px", marginBottom: "20px" }} />
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "50px",
                  fontWeight: "700",
                  fontFamily: "Chakra Petch",
                  marginBottom: "0px",
                }}
              >
                interstellar
              </h1>
              <br />
              <label>
                <input
                  name="isStudent"
                  type="checkbox"
                  checked={this.state.isStudent}
                  onChange={this.handleInputChange}
                />
                &nbsp; I am a current MIT student.
              </label>
              <label>
                <input
                  name="doesAbide"
                  type="checkbox"
                  checked={this.state.doesAbide}
                  onChange={this.handleInputChange} />
                &nbsp; I will abide by MIT course policies.
              </label>
              <label>
                <input
                  name="importClasses"
                  type="checkbox"
                  checked={this.state.importClasses}
                  onChange={this.handleInputChange} />
                &nbsp; I want to import my previous classes into interstellar from fireroad.
              </label>
              <Dropdown options={this.state.yearOptions} onChange={this.onSelect} value={this.state.classYear} placeholder="Select an option" />;
              <br />
              <div>
                <Button style={{ marginRight: "10px" }} type="primary" onClick={this.submitForm} disabled={!this.state.isStudent || !this.state.doesAbide || (this.state.classYear == undefined)}>
                  Accept
                </Button>
                <Button onClick={this.props.logout}>Go Back</Button>
              </div>
              <br />
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default SignContract;
