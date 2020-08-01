import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import SideBar from "./modules/SideBar.js";
import Public from "./pages/Public.js";
import Home from "./pages/Home.js";
import Page from "./pages/Page.js";

import Cookies from 'universal-cookie';
const cookies = new Cookies()

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        console.log("SDKFKLSDJFLKS")
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (body) => {
    post('api/login', {name: "Daniel Sun", email: "dansun@mit.edu", password: "hehexd"}).then((res)=> {
      console.log(res)
      cookies.set('token', res.token, {path: '/'})
      get('api/me', {}, res.token).then((user) => {
        this.setState({userId: user._id})
      })
    })
  }

  handleLogout = () => {
    post('api/logout', {name: "Daniel Sun", email: "dansun@mit.edu", password: "hehexd"}).then((res)=> {
      cookies.set('token','',{path:"/"})
      this.setState({userId: undefined})
    })
  };

  render() {
    let publicContent = 
      <Public
        path="/"
        handleLogin={this.handleLogin}
        userId={this.state.userId}
      />

    let privateContent = <>
      <SideBar
        handleLogout={this.handleLogout}
      />
      <Router>
        <Home
          exact path="/"
          userId={this.state.userId}
        />
        <Page
          path="/page"
          userId={this.state.userId}
        />
        <NotFound default />
      </Router>
    </>
    return (
      <>
        <button onClick = {()=>{console.log(this.state)}}>logState</button>
        {this.state.userId ? privateContent : publicContent}
      </>
    );
  }
}

export default App;
