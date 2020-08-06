import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import logo from "../../../dist/favicon.png";

class Confirmation extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    let tok = this.props.computedMatch.params.token;
    this.state = {
      tok: tok,
      email: "",
    };
  }

  submitForm = () => {
    post("/api/confirmation", { email: this.state.email, token: this.state.tok }).then((res) => {
      console.log(res);
      if (res.msg) {
        this.setState({ msg: res.msg })
      }
    });
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
            <h2 style={{ textAlign: "center" }}>One more step! Enter your email and hit confirm</h2>
            <Input
              value={this.state.email}
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
              style={{ width: "20%", textAlign: "center" }}
            ></Input>
            <br />
            <Button onClick={this.submitForm}>Confirm</Button>
            <br />
            {this.state.msg ? <>{this.state.msg}<a href={"/"}> Return to home</a></> : ""}
          </Col>
        </Row>
      </>
    );
  }
}

export default Confirmation;
