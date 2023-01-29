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
const currentSemester = "spring-2023";
const listOfSemesters = [
  { name: "Spring 2020", id: "spring-2020" },
  { name: "Fall 2020", id: "fall-2020" },
  { name: "IAP 2021", id: "iap-2021" },
  { name: "Spring 2021", id: "spring-2021" },
  { name: "Fall 2021", id: "fall-2021" },
  { name: "IAP 2022", id: "iap-2022" },
  { name: "Spring 2022", id: "spring-2022" },
  { name: "Fall 2022", id: "fall-2022" },
  { name: "IAP 2023", id: "iap-2023" },
  { name: "Spring 2023", id: "spring-2023" },
  { name: "Fall 2023", id: "fall-2023" },
  { name: "IAP 2024", id: "iap-2024" },
  { name: "Spring 2024", id: "spring-2024" },
  { name: "Fall 2024", id: "fall-2024" },
  { name: "IAP 2025", id: "iap-2025" },
  { name: "Spring 2025", id: "spring-2025" },
].reverse();
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
        if (!user.email || user.name === "No Name") {
          Modal.warning({
            title: "Sorry, there has been an error",
            content:
              "Please contact the interstellar team (Akshaj Kadaveru, Daniel Sun, Vivek Bhupatiraju, or Guang Cui). You can email akshajk@mit.edu.",
            onOk: () => {
              this.logout();
            },
          });
        } else {
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
        }
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
    let link = window.location.origin + "/api/signUpLogin";
    if (ENV != "development") {
      let link = link.replace("http:", "https:")
    }
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
                    return <Redirect to={this.props.cookies?.get("redirectLink") || "/"} />;
                  }}
                />
                <Main
                  path="/:semester"
                  state={this.state}
                  redirectPage={this.redirectPage}
                  setVisible={this.setVisible}
                  setProfileVisible={this.setProfileVisible}
                  logout={this.logout}
                  listOfSemesters={listOfSemesters}
                />

                <Route
                  default
                  render={() => {
                    return <Redirect to={"/" + currentSemester} />;
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
