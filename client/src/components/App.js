import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import SideBar from "./modules/SideBar.js";
import Public from "./pages/Public.js";
import Home from "./pages/Home.js";
import Page from "./pages/Page.js";
import MySpin from "./modules/MySpin";
import Confirmation from "./pages/Confirmation.js";
import "../utilities.css";
import { Row, Col, Divider, Spin, Modal, Layout, Button } from "antd";
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
// var classes = require("./modules/full.json");

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
    console.log("load");
    let self = this;
    if (cookies.get("token") != undefined && cookies.get("token").length > 0) {
      get("/api/me", {}, cookies.get("token")).then((res) => {
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
          allPages: res.allPages,
        });
      });
    } else if (window.location.href.indexOf("?code") > 0) {
      let code = window.location.href.substring(window.location.href.indexOf("?code"));
      self.state.code = code
      getJSON("https://fireroad-dev.mit.edu/fetch_token/" + code, (err, data) => {
        if (err !== null) {
          // alert("Something went wrong: " + err);
        } else {
          var req = new XMLHttpRequest();
          req.responseType = "json";
          req.open("GET", "https://fireroad-dev.mit.edu/user_info/", true);
          req.setRequestHeader("Authorization", "Bearer " + data.access_info.access_token);
          req.onload = function () {
            var jsonResponse = req.response;
            let name = jsonResponse.name;
            let email = data.access_info.academic_id;
            console.log(name + email);
            self.signUpLogin({ email: email, password: "abcdef", name: name });
          };
          req.send(null);
        }
      });

      //redirect back to localhost:5000 home
    }
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id && cookies.get("token") != undefined) {
        // they are registed in the database, and currently logged in.
        this.me();
      } else if (this.state.code == undefined) {
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
    //redirect to fireroad-dev.mit.edu/login?redirect={localhost:5000}

    window.location.href =
      "https://fireroad-dev.mit.edu/login?redirect=http%3A%2F%2Flocalhost%3A5000";
    // "https://fireroad-dev.mit.edu/login?redirect=https%3A%2F%2Finterstellar-beta.herokuapp.com";
  };

  signUpLogin = (data) => {
    post("/api/signUpLogin", data).then((res) => {
      cookies.set("token", res.token, { path: "/" });
      console.log(res)
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
    post("/api/logout", {}).then((res) => {
      cookies.set("token", "", { path: "/" });
      this.setState({ userId: undefined, tryingToLogin: false }, () => {
        window.location.href = "/";
      });
    });
  };
  me = () => {
    let token = cookies.get("token")
    get("/api/me", {}, token).then((res) => {
      if (!res.user) {
        cookies.set("token", "", { path: "/" });
        window.location.href = "/";
        //this.logout();
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
        allPages: res.allPages,
      });
    });
  };
  signup = (data) => {
    console.log("ha");
    post("/api/signup", data).then((res) => {
      if (res.msg) {
        this.setState({ signUpMessage: res.msg });
      }
      // if (data.password.length < 6) {
      //   this.setState({ signUpMessage: "Please enter a longer password" })
      // }
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
          Adding Classes 
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
        <Layout style={{ minHeight: "100vh" }}>
          <SideBar
            pageIds={this.state.pageIds}
            allPages={this.state.allPages}
            myPages={myPages}
            selectedPageName={this.state.selectedPageName}
            redirectPage={this.redirectPage}
            logout={this.logout}
            logState={this.logState}
          />
          <Layout className="site-layout">
            <Content>
              <Router>
                <Switch>
                  <Home
                    exact
                    path={["/", "/welcome", "/dashboard"]}
                    schoolId={this.state.schoolId}
                    updateSelectedPageName={this.updateSelectedPageName}
                    user={{ userId: this.state.userId, name: this.state.name }}
                    redirectPage={this.redirectPage}
                    myPages={myPages}
                    disconnect={this.disconnect}
                    allPages={this.state.allPages}
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
                    isSiteAdmin={this.state.isSiteAdmin}
                    disconnect={this.disconnect}
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
                  />
                  <NotFound default />
                </Switch>
              </Router>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
