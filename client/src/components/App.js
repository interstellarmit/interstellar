import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import SideBar from "./modules/SideBar.js";
import Public from "./pages/Public.js";
import Home from "./pages/Home.js";
import Page from "./pages/Page.js";
import MySpin from "./modules/MySpin";
import Confirmation from "./pages/Confirmation.js";
import SignContract from "./pages/SignContract.js"
import "../utilities.css";
import { Row, Col, Divider, Spin, Modal, Layout, Button } from "antd";
import "antd/dist/antd.css";
const { Header, Content, Footer, Sider } = Layout;

import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

import Cookies from "universal-cookie";
const cookies = new Cookies();

// var classes = require("../full.json");

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
      selectedPageName: "",
      redirectPage: "",
      tryingToLogin: true,
      // currentPageName from URL?
    };
    this.encodedLink = encodeURIComponent(window.location.href);
    let self = this;
    if (cookies.get("token") != undefined && cookies.get("token").length > 0) {
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
      if (reason === "io server disconnect") {
        this.setState({ disconnect: true });
      }
    });
  }

  /*
  Methods from Public (Dan's login stuff)
  */

  handleLogin = () => {
    post("/api/getRedirectLink", {}).then((ret) => {
      window.location.href = ret.link + "login?redirect=" + this.encodedLink;
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
      //this.setState({ userId: undefined, tryingToLogin: false }, () => {

      //});
    });
  };

  me = () => {
    let token = cookies.get("token");
    get("/api/me", {}, token).then((res) => {
      if (!res.user) {
        this.logout();
        return;
      }
      this.setState({
        userId: res.user._id,
        schoolId: res.user.schoolId,
        name: res.user.name,
        loungeId: res.user.loungeId,
        pageIds: res.user.pageIds,
        isSiteAdmin: res.user.isSiteAdmin,
        email: res.user.email,
        visible: res.user.visible,
        seeHelpText: res.user.seeHelpText,
        allPages: res.allPages,
        signedContract: res.user.signedContract,
      });
      console.log("loungeId " + res.user.loungeId);
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

  disconnect = () => {
    this.setState({ disconnect: true });
  };

  signContract = () => {
    post("/api/signContract", {}).then((res) => {
      if (res.success) {
        this.setState({ signedContract: true })
      }
    })
  }

  render() {
    if (!this.state.userId) {
      if (this.state.tryingToLogin) return <MySpin />;
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
    let myPages = this.state.allPages.filter((page) => {
      return this.state.pageIds.includes(page._id);
    });
    return (
      <div>
        {/*
          // Adding Classes
          <button
            onClick={() => {
              let keys = Object.keys(classes);
              let runLoop = (i) => {
                if (i >= keys.length) return;
                let oneclass = keys[i];
                let classObj = classes[oneclass];
                post("/api/createNewPage", {
                  pageType: "Class",
                  name: oneclass,
                  title: classObj.n,
                  description: classObj.d,
                  professor: classObj.i,
                  rating: classObj.ra,
                  hours: classObj.h,
                  units: classObj.u1 + classObj.u2 + classObj.u3,
                  locked: false,
                  joinCode: "",
                }).then((created) => {
                  if (created.created) console.log(oneclass + " " + i + "/" + keys.length);
                  else console.log("error:" + oneclass);
                  runLoop(i + 1);
                });
              };
              runLoop(0);
            }}
          >
            Add MIT
          </button>
        */}
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
        {!this.state.signedContract ?
          <SignContract
            signContract={this.signContract}
          />
          :
          <Layout style={{ minHeight: "100vh" }}>
            <SideBar
              pageIds={this.state.pageIds}
              allPages={this.state.allPages}
              myPages={myPages}
              selectedPageName={this.state.selectedPageName}
              redirectPage={this.redirectPage}
              logout={this.logout}
              logState={this.logState}
              email={this.state.email}
            />
            <Layout className="site-layout">
              <Content>
                <Router>
                  <Switch>
                    <Home
                      exact
                      path={["/", "/welcome", "/dashboard", "/privacy", "/admin"]}
                      schoolId={this.state.schoolId}
                      updateSelectedPageName={this.updateSelectedPageName}
                      user={{
                        userId: this.state.userId,
                        name: this.state.visible ? this.state.name : "Anonymous (Me)",
                      }}
                      redirectPage={this.redirectPage}
                      myPages={myPages}
                      disconnect={this.disconnect}
                      allPages={this.state.allPages}
                      isSiteAdmin={this.state.isSiteAdmin}
                      logout={this.logout}
                      visible={this.state.visible}
                      setVisible={this.setVisible}
                      seeHelpText={this.state.seeHelpText}
                      setSeeHelpText={this.setSeeHelpText}
                    />
                    <Page
                      path="/class/:selectedPage"
                      schoolId={this.state.schoolId}
                      pageIds={this.state.pageIds}
                      updatePageIds={this.updatePageIds}
                      updateSelectedPageName={this.updateSelectedPageName}
                      user={{
                        userId: this.state.userId,
                        name: this.state.visible ? this.state.name : "Anonymous (Me)",
                      }}
                      redirectPage={this.redirectPage}
                      loungeId={this.state.loungeId}
                      setLoungeId={this.setLoungeId}
                      isSiteAdmin={this.state.isSiteAdmin}
                      disconnect={this.disconnect}
                      logout={this.logout}
                      visible={this.state.visible}
                      seeHelpText={this.state.seeHelpText}
                      setSeeHelpText={this.setSeeHelpText}
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
                      allPages={this.state.allPages}
                      pageIds={this.state.pageIds}
                      isSiteAdmin={this.state.isSiteAdmin}
                      disconnect={this.disconnect}
                      seeHelpText={this.state.seeHelpText}
                      setSeeHelpText={this.setSeeHelpText}
                      logout={this.logout}
                    />
                    <NotFound default />
                  </Switch>
                </Router>
              </Content>
            </Layout>
          </Layout>
        }
      </div>
    );
  }
}

export default App;
