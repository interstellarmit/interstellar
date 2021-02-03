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
      yearOptions: [],
      road: undefined,
      roads: {},
      roadOpions: [],
    };
  }
  componentDidMount = () => {
    get("/api/roads").then((data) => {
      console.log(data.roads)
      this.setState({ roads: data.roads, roadOptions: Object.values(data.roads).map((element) => element.name), yearOptions: data.yearOptions })
    })
  }

  submitForm = () => {
    const roadId = Object.keys(this.state.roads).find((key) => this.state.roads[key].name === this.state.road);
    this.props.signContract(this.state.importClasses, this.state.classYear, roadId);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  onSelectRoad = (event) => {
    this.setState({ road: event.value })
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
              <Dropdown name="road" options={this.state.roadOptions} onChange={this.onSelectRoad} value={this.state.road} placeholder="FireRoad Name" />
              <Dropdown name="classYear" options={this.state.yearOptions} onChange={this.onSelect} value={this.state.classYear} placeholder="Class Year" />
              <br />
              <div>
                <Button
                  style={{ marginRight: "10px" }}
                  type="primary"
                  onClick={this.submitForm}
                  disabled={!this.state.isStudent || !this.state.doesAbide || (this.state.classYear == undefined) || (this.state.importClasses && !this.state.road)}>
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
