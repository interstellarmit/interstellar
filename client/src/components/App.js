import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import SideBar from "./modules/SideBar.js";
import Public from "./pages/Public.js";
import Home from "./pages/Home.js";
import Page from "./pages/Page.js";
import Main from "./pages/Main.js";
import MySpin from "./modules/MySpin";
import Confirmation from "./pages/Confirmation.js";
import SignContract from "./pages/SignContract.js";
import "../utilities.css";
import { Row, Col, Divider, Spin, Modal, Layout, Button, notification } from "antd";
import "antd/dist/antd.css";
const { Header, Content, Footer, Sider } = Layout;

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
      allPages: [],
      school: "",

      redirectPage: "",
      tryingToLogin: true,

      loading: false,
      // currentPageName from URL?
    };


  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({
          userId: user._id,
          schoolId: user.schoolId,
          name: user.name,
          loungeId: user.loungeId,
          //pageIds: user.pageIds,
          isSiteAdmin: user.isSiteAdmin,
          email: user.email,
          visible: user.visible,
          seeHelpText: user.seeHelpText,
          //allPages: allPages,
          signedContract: user.signedContract,
        });
      } else {
        this.setState({ tryingToLogin: false })
      }
    });
    socket.on("reconnect_failed", () => {
      this.setState({ disconnect: true });
    });
    socket.on("disconnect", (reason) => {
      console.log(reason);
      if (reason === "io server disconnect") {
        this.setState({ disconnect: true });
      }
    });
    socket.on("createdPage", (data) => {
      if (!this.state.userId) return;
      let allPages = this.state.allPages.concat([]);

      if (
        !allPages
          .map((page) => {
            return page._id;
          })
          .includes(data.page._id)
      ) {
        allPages.push(data.page);

        this.setState({ allPages: allPages });
      }
    });
  }

  /*
  Methods from Public (Dan's login stuff)
  */

  handleLogin = () => {
    let link = window.location.origin.replace("http:", "https:") + "/api/signUpLogin";
    if (link.includes("localhost:5000")) link = window.location.origin + "/api/signUpLogin";
    let encodedLink = encodeURIComponent(link);

    post("/api/getRedirectLink", {}).then((ret) => {
      window.location.href = ret.link + "login?redirect=" + encodedLink;
    });
  };

  logout = () => {
    post("/api/logout", {}).then((res) => {
      window.location.href = "/";
    });
  };

  setVisible = (bool) => {
    post("/api/setVisible", { visible: bool }).then((data) => {
      if (data.setVisible) {
        this.setState({ visible: bool });
      }
    });
  };
  setSeeHelpText = (bool) => {
    post("/api/setSeeHelpText", { seeHelpText: bool }).then((data) => {
      if (data.setSeeHelpText) {
        this.setState({ seeHelpText: bool });
      }
    });
  };
  redirectPage = (link) => {
    this.setState({ redirectPage: link });
  };

  logState = () => {
    console.log(this.state);
  };

  disconnect = () => {
    this.setState({ disconnect: true });
  };

  signContract = (importClasses, classYear) => {
    post("/api/signContract", { importClasses, classYear }).then((res) => {
      if (res.user) {
        this.setState({ signedContract: true });
      }
    });
  };

  notify = (data) => {
    this.setState({ notify: data });
  };

  render() {
    if (!this.state.userId || !this.state.allPages) {
      if (this.state.tryingToLogin)
        return (
          <Layout style={{ minHeight: "100vh" }}>
            <SideBar notLoggedIn={true} />

            <Layout className="site-layout">
              <Content>
                <Spin spinning={true}>
                  <Layout
                    style={{ background: "rgba(255, 255, 255, 1)", height: "100vh" }}
                  ></Layout>
                </Spin>
              </Content>
            </Layout>
          </Layout>
        );
      return (
        <>
          <Router>
            <Switch>
              <Confirmation path="/confirmation/:token"></Confirmation>
              <Public
                visible={true}
                handleLogin={this.handleLogin}
                logout={this.logout}
                me={this.me}
                loginMessage={this.state.loginMessage}
                signUpMessage={this.state.signUpMessage}
              />
            </Switch>
          </Router>
        </>
      );
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

    if (this.state.notify) {
      if (this.state.oldKey) notification.close(this.state.oldKey);
      let key = new Date().toString();
      notification.info(Object.assign(this.state.notify, { key: key }));
      this.setState({ notify: undefined, oldKey: key });
    }

    return (
      <div>
        {/* <button onClick={() => { get("/api/sync").then((user) => { console.log(user) }) }}>Test Sync</button>
        <button onClick={() => { get("/api/verify") }}>Verify Token</button>
        <button onClick={() => { get("/api/user_info") }}>User Info</button> */}
        {this.state.disconnect ? (
          Modal.error({
            title: "Disconnected",
            content: (
              <div>
                <p>
                  You have disconnected. Maybe you opened Interstellar in another tab, or you have
                  been inactive for a long period of time.
                </p>
                <p>Hit OK to relaunch Interstellar!</p>
              </div>
            ),
            onOk() {
              window.location.href = "/";
            },
          })
        ) : (
            <></>
          )}
        {!this.state.signedContract ? (
          <SignContract logout={this.logout} signContract={this.signContract} />
        ) : (
            <Router>
              <Switch>
                <Main
                  path="/:semester"
                  state={this.state}
                  redirectPage={this.redirectPage}
                  disconnect={this.disconnect}
                  setVisible={this.setVisible}
                  setSeeHelpText={this.setSeeHelpText}
                  logout={this.logout}
                />
                <Route
                  default
                  render={() => {
                    return <Redirect to="/spring-2021" />;
                  }}
                />
              </Switch>
            </Router>
          )}
      </div>
    );
  }
}

export default App;
