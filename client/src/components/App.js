import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import SideBar from "./modules/SideBar.js";
import Public from "./pages/Public.js";
import Home from "./pages/Home.js";
import Page from "./pages/Page.js";
import Confirmation from "./pages/Confirmation.js";
import "../utilities.css";
import { Row, Col, Divider, Spin } from "antd";
import "antd/dist/antd.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import Cookies from "universal-cookie";
const cookies = new Cookies();
/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      allPages: [],
      school: "",
      selectedPageName: "",
      redirectPage: "",
      tryingToLogin: true,
      // currentPageName from URL?
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        console.log("SDKFKLSDJFLKS");
        this.me();
      } else {
        this.setState({ tryingToLogin: false });
      }
    });
    socket.on("disconnect", () => {
      this.setState({ disconnect: true });
    });
  }

  /*
  Methods from Public (Dan's login stuff)
  */
  login = (data) => {
    post("/api/login", data).then((res) => {
      console.log(res);
      cookies.set("token", res.token, { path: "/" });

      post("/api/initsocket", { socketid: socket.id }).then(() => {
        this.me();
      });
    });
  };
  logout = () => {
    post("/api/logout", {}).then((res) => {
      cookies.set("token", "", { path: "/" });
      this.setState({ userId: undefined, tryingToLogin: false });
      console.log(res);
    });
  };
  me = () => {
    get("/api/me", {}, cookies.get("token")).then((res) => {
      console.log(res);
      this.setState({
        userId: res.user._id,
        schoolId: res.user.schoolId,
        name: res.user.name,
        loungeId: res.user.loungeId,
        pageIds: res.user.pageIds,
        isSiteAdmin: res.user.isSiteAdmin,
        email: res.user.email,
        visible: res.user.visible,
        allPages: res.allPages,
      });
    });
  };
  signup = (data) => {
    post("/api/signup", data).then((res) => {
      console.log(res);
    });
  };

  updatePageIds = (newPageIds) => {
    this.setState({ pageIds: newPageIds });
  };

  updateSelectedPageName = (page) => {
    this.setState({ selectedPageName: page });
  };

  redirectPage = (link) => {
    this.setState({ redirectPage: link });
  };

  setLoungeId = (newId) => {
    this.setState({ loungeId: newId });
  };

  logState = () => {
    console.log(this.state);
  };
  /*
  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    post('api/logout', {name: "Daniel Sun", email: "dansun@mit.edu", password: "hehexd"}).then((res)=> {
      cookies.set('token','',{path:"/"})
      this.setState({userId: undefined})
    })
  };
  */

  render() {
    if (!this.state.userId) {
      if (this.state.tryingToLogin) return <Spin />;
      return (
        <>
          <Router>
            <Switch>
              <Confirmation path="/confirmation/:token"></Confirmation>
              <Public
                visible={true}
                login={this.login}
                logout={this.logout}
                me={this.me}
                signup={this.signup}
              />
            </Switch>
          </Router>
        </>
      );
    }
    if (this.state.disconnect) {
      return <h1>Disconnected</h1>;
    }
    if (this.state.redirectPage !== "") {
      let page = this.state.redirectPage;
      this.setState({ redirectPage: "" });
      return (
        <Router>
          <Redirect to={page} />
        </Router>
      );
    }

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col>
            <Public login={this.login} logout={this.logout} me={this.me} signup={this.signup} />
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <SideBar
              pageIds={this.state.pageIds}
              allPages={this.state.allPages}
              selectedPageName={this.state.selectedPageName}
              redirectPage={this.redirectPage}
              logout={this.logout}
              logState={this.logState}
            />
          </Col>
          <Col span={18}>
            <Router>
              <Switch>
                <Home
                  exact
                  path="/"
                  schoolId={this.state.schoolId}
                  updateSelectedPageName={this.updateSelectedPageName}
                  redirectPage={this.redirectPage}
                />
                <Page
                  path="/class/:selectedPage"
                  schoolId={this.state.schoolId}
                  pageIds={this.state.pageIds}
                  updatePageIds={this.updatePageIds}
                  updateSelectedPageName={this.updateSelectedPageName}
                  user={{ userId: this.state.userId, name: this.state.name }}
                  redirectPage={this.redirectPage}
                  loungeId={this.state.loungeId}
                  setLoungeId={this.setLoungeId}
                />
                <Page
                  path="/group/:selectedPage"
                  schoolId={this.state.schoolId}
                  pageIds={this.state.pageIds}
                  updatePageIds={this.updatePageIds}
                  updateSelectedPageName={this.updateSelectedPageName}
                  user={{ userId: this.state.userId, name: this.state.name }}
                  redirectPage={this.redirectPage}
                  loungeId={this.state.loungeId}
                  setLoungeId={this.setLoungeId}
                />
                <NotFound default />
              </Switch>
            </Router>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
