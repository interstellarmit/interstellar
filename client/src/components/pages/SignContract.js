import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import logo from "../../../dist/favicon.png";

class SignContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  submitForm = () => {
    this.props.signContract();
  };

  render() {
    return (
      <>
        <Row justify={"center"}>
          <Col
            style={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <br />
            <br />
            <br />
            <br />
            <img
              src={logo}
              style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "20%" }}
            />
            <br />
            <br />
            <h1 style={{ textAlign: "center" }}>Interstellar Policy</h1>
            <h2 style={{ textAlign: "center" }}>I am a current MIT student.</h2>
            <h2 style={{ textAlign: "center" }}>I will abide by MIT course policies. </h2>
            <br />
            <Button onClick={this.submitForm}>Accept</Button>
            <br />
          </Col>
        </Row>
      </>
    );
  }
}

export default SignContract;
