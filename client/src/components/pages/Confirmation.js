import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Form, Input, Button, Checkbox } from "antd";

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
    });
  };

  render() {
    return (
      <>
        <div>{this.state.tok}</div>
        <div>One more step. Enter your email and hit confirm</div>
        <Input
          value={this.state.email}
          onChange={(e) => {
            this.setState({ email: e.target.value });
          }}
        ></Input>
        <Button onClick={this.submitForm}>Confirm</Button>
      </>
    );
  }
}

export default Confirmation;
