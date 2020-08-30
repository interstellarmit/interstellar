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
              <h2 style={{ textAlign: "center" }}>I am a current MIT student.</h2>
              <h2 style={{ textAlign: "center" }}>I will abide by MIT course policies. </h2>
              <br />
              <div>
                <Button style={{ marginRight: "10px" }} type="primary" onClick={this.submitForm}>
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
