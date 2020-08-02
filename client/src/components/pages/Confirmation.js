import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Form, Input, Button, Checkbox } from 'antd';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    let tok = this.props.computedMatch.params.token
    this.state = {
        tok: tok
    };
  }

  submitForm = () => {
    post('/api/confirmation', {email:"dansun@mit.edu",token:this.state.tok}).then((res)=> {
        console.log(res)
    })
  }

  render() {
    return <>
        <div>{this.state.tok}</div>
        <div>One more step. Click below to confirm your email.</div>
        <button onClick = {this.submitForm}>Confirm</button>
    </>
  }
}

export default Confirmation;