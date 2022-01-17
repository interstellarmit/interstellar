import { Layout, Spin } from "antd";
import "antd/dist/antd.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { get, post } from "../utilities";
import "../utilities.css";
import SideBar from "./modules/SideBar.js";
import Confirmation from "./pages/Confirmation.js";
import Main from "./pages/Main.js";
import Public from "./pages/Public.js";
import SignContract from "./pages/SignContract.js";

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: undefined,
      allPages: [],
      school: "",

      redirectPage: "",
      tryingToLogin: true,

      loading: false,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({
          userId: user._id,
          name: user.name,
          isSiteAdmin: user.isSiteAdmin,
          email: user.email,
          visible: user.visible,
          profileVisible: user.profileVisible,
          curLoc: user.curLoc,
          hometown: user.hometown,
          bio: user.bio,
          activities: user.activities,
          restaurant: user.restaurant,
          advice: user.advice,
          funFact: user.funFact,
          seeHelpText: user.seeHelpText,
          signedContract: user.signedContract,
          classYear: user.classYear,
        });
      } else {
        this.setState({ tryingToLogin: false });
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

  setProfileVisible = (bool) => {
    post("/api/setProfileVisible", { profileVisible: bool }).then((data) => {
      if (data.setProfileVisible) {
        this.setState({ profileVisible: bool });
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

  signContract = (importClasses, classYear, roadId) => {
    this.setState({ tryingToLogin: true, userId: false });
    post("/api/signContract", { importClasses, classYear, roadId }).then((res) => {
      window.location.href = "/";
    });
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
                profileVisible={true}
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

    return (
      <div>
        {!this.state.signedContract ? (
          <SignContract logout={this.logout} signContract={this.signContract} />
        ) : (
          <Router>
            <Switch>
              <Main
                path="/:semester"
                state={this.state}
                redirectPage={this.redirectPage}
                setVisible={this.setVisible}
                setProfileVisible={this.setProfileVisible}
                setSeeHelpText={this.setSeeHelpText}
                logout={this.logout}
              />
              <Route
                default
                render={() => {
                  return <Redirect to="/spring-2022" />;
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
