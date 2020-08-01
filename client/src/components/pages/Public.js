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
          post('api/signup', {name: "Daniel Sun", email: "guang@mit.edu", password: "hehexd"}).then((res)=> {
            console.log(res)
          })
        }}>Signup</button>
        <button onClick = {this.props.handleLogin}>Login</button>
        <button onClick = {() => {
          get('api/me', {name: "Daniel Sun", email: "dansun@mit.edu", password: "hehexd"}, cookies.get('token')).then((res)=> {
            console.log(res)
          })
        }}>Me</button>
        <button onClick={()=> {
            console.log(cookies.get('token'))
        }}>Cookie</button>
      </>
    );
  }
}

export default Public;
