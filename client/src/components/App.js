import { Layout, Modal } from "antd";
import "antd/dist/antd.css";
import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { get, post } from "../utilities";
import "../utilities.css";
import SideBar from "./modules/SideBar.js";
import Main from "./pages/Main.js";
import Public from "./pages/Public.js";
import SignContract from "./pages/SignContract.js";

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: undefined,
      school: "",

      redirectPage: "",
      tryingToLogin: true,

      loading: false,
    };
  }

  componentDidMount() {
    this.initialiseUser();
  }

  initialiseUser() {
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
          signedContract: user.signedContract,
          classYear: user.classYear,
          tryingToLogin: false,
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
    let oldLink = window.location.pathname + window.location.search;
    let link = window.location.origin.replace("http:", "https:") + "/api/signUpLogin";
    if (link.includes("localhost:5000")) link = window.location.origin + "/api/signUpLogin";
    let encodedLink = encodeURIComponent(link);

    this.props.cookies.set("redirectLink", oldLink, { path: "/" });
    post("/api/getRedirectLink").then((ret) => {
      console.log(ret.link);
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
    if (this.state.tryingToLogin)
      return (
        <Layout style={{ minHeight: "100vh" }}>
          <SideBar notLoggedIn={true} />

          <Layout className="site-layout">
            <Content></Content>
          </Layout>
        </Layout>
      );

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
      <div style={{ maxHeight: "100vh", overflow: "hidden" }}>
        {!this.state.signedContract && false ? (
          <SignContract logout={this.logout} signContract={this.signContract} />
        ) : (
          <>
            <Router>
              <Switch>
                <Route
                  path="/redirect"
                  render={() => {
                    console.log(this.props.cookies.get("redirectLink"));
                    return <Redirect to={this.props.cookies.get("redirectLink")} />;
                  }}
                />
                <Main
                  path="/:semester"
                  state={this.state}
                  redirectPage={this.redirectPage}
                  setVisible={this.setVisible}
                  setProfileVisible={this.setProfileVisible}
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
            {!this.state.userId && (
              <Modal
                visible
                footer={null}
                closable={false}
                bodyStyle={{ padding: "20px", borderRadius: "20px", border: "10px solid #4090F7" }}
                className="radius-20"
              >
                <Public handleLogin={this.handleLogin} />
              </Modal>
            )}
          </>
        )}
      </div>
    );
  }
}

export default withCookies(App);
