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

import Cookies from "universal-cookie";
const cookies = new Cookies();

var getJSON = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

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

    let self = this;
    if (cookies.get("token") && cookies.get("token").length > 0) {
      self.me();
    } else if (window.location.href.indexOf("?code") > 0) {
      let code = window.location.href.substring(window.location.href.indexOf("?code"));
      self.state.code = code;
      post("/api/getRedirectLink", {}).then((ret) => {
        getJSON(ret.link + "fetch_token/" + code, (err, data) => {
          if (err !== null) {
            // alert("Something went wrong: " + err);
          } else {
            var req = new XMLHttpRequest();
            req.responseType = "json";
            req.open("GET", ret.link + "user_info/", true);
            req.setRequestHeader("Authorization", "Bearer " + data.access_info.access_token);
            req.onload = function () {
              var jsonResponse = req.response;
              let name = jsonResponse.name;
              let email = data.access_info.academic_id;
              let current_semester = data.access_info.current_semester;
              self.signUpLogin({ email: email, password: "DH3ordzkbjBra9", name: name });
            };
            req.send(null);
          }
        });
      });
    }
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id && cookies.get("token") != undefined) {
        // they are registed in the database, and currently logged in.
        this.me();
      } else if (!this.state.code) {
        this.setState({ tryingToLogin: false });
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
    let link = window.location.origin.replace("http:", "https:") + "/";
    if (link.includes("localhost:5000")) link = window.location.origin + "/";
    // console.log(window.location.origin)
    // console.log(window.location.href)
    // this.encodedLink = link.charAt(link.length - 1) === "/" ? link.substring(0, link.length - 1) : link;
    let encodedLink = encodeURIComponent(link);

    post("/api/getRedirectLink", {}).then((ret) => {
      window.location.href = ret.link + "login?redirect=" + encodedLink;
    });
  };

  signUpLogin = (data) => {
    post("/api/signUpLogin", data).then((res) => {
      cookies.set("token", res.token, { path: "/" });
      if (res.msg) {
        this.setState({ loginMessage: res.msg });
      }
      if (res.token) {
        this.setState({ loginMessage: "Success!" });
      } else {
      }
      post("/api/initsocket", { socketid: socket.id }).then((data) => {
        if (data.init) this.me();
        else {
          this.setState({
            disconnect: true,
          });
        }
      });
    });
  };

  login = (data) => {
    post("/api/login", data).then((res) => {
      cookies.set("token", res.token, { path: "/" });
      if (res.msg) {
        this.setState({ loginMessage: res.msg });
      }
      if (res.token) {
        this.setState({ loginMessage: "Success!" });
      }
      post("/api/initsocket", { socketid: socket.id }).then((data) => {
        if (data.init) this.me();
        else {
          this.setState({
            disconnect: true,
          });
        }
      });
    });
  };

  logout = () => {
    cookies.set("token", "", { path: "/" });
    post("/api/logout", {}).then((res) => {
      window.location.href = "/";
    });
  };

  me = async () => {
    let token = cookies.get("token");
    let res = await get("/api/me", {}, token);
    if (!res.user) {
      this.logout();
      return;
    }
    this.setState({
      userId: res.user._id,
      schoolId: res.user.schoolId,
      name: res.user.name,
      loungeId: res.user.loungeId,
      //pageIds: res.user.pageIds,
      isSiteAdmin: res.user.isSiteAdmin,
      email: res.user.email,
      visible: res.user.visible,
      seeHelpText: res.user.seeHelpText,
      //allPages: res.allPages,
      signedContract: res.user.signedContract,
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
  signup = (data) => {
    post("/api/signup", data).then((res) => {
      if (res.msg) {
        this.setState({ signUpMessage: res.msg });
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

  signContract = () => {
    post("/api/signContract", {}).then((res) => {
      if (res.success) {
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
                login={this.login}
                logout={this.logout}
                me={this.me}
                signup={this.signup}
                loginMessage={this.state.loginMessage}
                signUpMessage={this.state.signUpMessage}
                handleLogin={this.handleLogin}
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
