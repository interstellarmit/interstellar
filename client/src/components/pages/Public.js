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
/*
 <button onClick={()=> {
           post("api/createNewSchool", {name: "MIT", email: "mit.edu", classesString: 
           "6.031 Software Development\n6.033 Computer Systems Engineering\n6.UAT Presenting Skills\n11.125 Education"}).then((created) => {
             if(created.created) console.log("done");
             else console.log("error")
           })
        }}>Add MIT</button>
        */