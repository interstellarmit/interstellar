import React, { Component } from "react";
import { get, post } from "../../utilities";
import Cookies from 'universal-cookie';
const cookies = new Cookies()

import "../../utilities.css";

class Public extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <button onClick = {() => {
          this.props.signup()
        }}>Signup</button>
        <button onClick = {() => {
          this.props.login()
        }}>Login</button>
        <button onClick = {() => {
          this.props.me()
        }}>Me</button>
        <button onClick = {() => {
          this.props.logout()
        }}>Logout</button>
        <button onClick={()=> {
            console.log(cookies.get('token'))
        }}>Cookie</button>
      </>
    );
  }
}

export default Public;
