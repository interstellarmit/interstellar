import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js";
import { Row, Col, Divider, Spin, Modal, Layout, Button, notification } from "antd";

import MySpin from "../modules/MySpin";
import Home from "./Home.js";
import Page from "./Page.js";
import UserPage from "./UserPage.js";
import NotFound from "../pages/NotFound.js";
import SideBar from "../modules/SideBar.js";
const { Header, Content, Footer, Sider } = Layout;

class Main extends Component {
  constructor(props) {
    super(props);
    let semester = this.props.computedMatch.params.semester || "spring-2021";
    // Initialize Default State
    this.state = { semester: semester, allPages: [], redirectPage: "" };
  }

  componentDidMount() {
    this.setState({ pageIds: [] }, () => {
      //console.log("Changing semester to ")
      post("/api/updateSemester", { semester: this.state.semester }).then((res) => {
        this.setState({
          allPages: res.allPages,
          pageIds: res.pageIds,

          loading: false,
        });
      });
    });
  }

  logout = () => {
    this.props.logout();
  };

  redirectPage = (link) => {
    this.setState({ redirectPage: "/" + this.state.semester + link });
  };
  changeSemester = (semester) => {
    let newLink = window.location.pathname.replace(this.state.semester, semester);
    if (newLink !== window.location.pathname) {
      this.props.redirectPage(newLink);
    }
    /*
    this.setState({ pageIds: [], loading: true }, () => {
      //console.log("Changing semester to ")
      post("/api/updateSemester", { semester: semester }).then((res) => {
        let oldSemester = this.state.semester;
        this.setState(
          {
            allPages: res.allPages,
            pageIds: res.pageIds,

            semester: semester,
            loading: false,
          },
          () => {
            let newLink = window.location.pathname.replace(oldSemester, semester);
            if (newLink !== window.location.pathname) {
              this.props.redirectPage(newLink);
            }
          }
        );
      });
    });
    */
  };

  updatePageIds = (newPageIds) => {
    this.setState({ pageIds: newPageIds });
  };

  updateSelectedPageName = (page) => {
    this.setState({ selectedPageName: page });
  };

  addClasses = (classList) => {
    post("/api/addClasses", {
      joinCode: "",
      pageNames: classList,
      semester: this.state.semester,
    }).then((res) => {
      let pageIds = this.state.pageIds;
      for (var i = 0; i < res.userPageIds.length; i++) {
        let pageId = res.userPageIds[i];
        if (!pageIds.includes(pageId)) {
          pageIds.push(pageId);
        }
      }
      this.setState(
        {
          pageIds: pageIds,
        },
        () => {
          this.redirectPage(classList[0] ? "/class/" + classList[0] : "/dashboard");
        }
      );
    });
  };

  notify = (data) => {
    this.setState({ notify: data });
  };

  render() {
    if (this.state.redirectPage !== "") {
      let page = this.state.redirectPage;
      this.setState({ redirectPage: "" });
      return (
        <Router>
          <Redirect to={page} />
        </Router>
      );
    }
    if (
      !["fall-2021", "spring-2021", "iap-2021", "fall-2020", "spring-2020"].includes(
        this.state.semester
      )
    ) {
      return (
        <h3>
          {"Sorry, " +
            this.state.semester +
            " is not a valid semester yet. If you want more semesters, please tell us! We weren't sure how many semesters to include."}
        </h3>
      );
    }
    let myPages = this.state.allPages.filter((page) => {
      return this.state.pageIds.includes(page._id + "");
    });
    //console.log(this.state.pageIds);
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar
          pageIds={this.state.pageIds}
          updatePageIds={this.updatePageIds}
          allPages={this.state.allPages}
          myPages={myPages}
          selectedPageName={this.state.selectedPageName}
          redirectPage={this.redirectPage}
          redirectPageOverall={this.props.redirectPage}
          logout={this.logout}
          logState={this.logState}
          email={this.props.state.email}
          semester={this.state.semester}
          changeSemester={this.changeSemester}
        />
        <Layout className="site-layout">
          <Content>
            <Spin spinning={this.state.loading}>
              <Router>
                <Switch>
                  <Home
                    key={this.state.semester}
                    exact
                    path={["/", "/dashboard", "/settings", "/admin", "/profile", "/dueDateAdmin"].map((s) => {
                      return "/:semester" + s;
                    })}
                    schoolId={this.props.state.schoolId}
                    updateSelectedPageName={this.updateSelectedPageName}
                    user={{
                      userId: this.props.state.userId,
                      name: this.props.state.visible ? this.props.state.name : "Anonymous (Me)",
                    }}
                    redirectPage={this.redirectPage}
                    myPages={myPages}
                    disconnect={this.props.disconnect}
                    allPages={this.state.allPages}
                    isSiteAdmin={this.props.state.isSiteAdmin}
                    logout={this.logout}
                    visible={this.props.state.visible}
                    setVisible={this.props.setVisible}
                    profileVisible={this.props.state.profileVisible}
                    setProfileVisible={this.props.setProfileVisible}
                    hometown={this.props.state.hometown}
                    curLoc={this.props.state.curLoc}
                    bio={this.props.state.bio}
                    activities={this.props.state.activities}
                    classYear={this.props.state.classYear}
                    restaurant={this.props.state.restaurant}
                    advice={this.props.state.advice}
                    funFact={this.props.state.funFact}
                    seeHelpText={this.props.state.seeHelpText}
                    setSeeHelpText={this.props.setSeeHelpText}
                    addClasses={this.addClasses}
                    email={this.props.state.email}
                    notify={this.notify}
                    semester={this.state.semester}
                  />
                  <Page
                    key={this.state.semester}
                    path={"/:semester/class/:selectedPage"}
                    schoolId={this.props.state.schoolId}
                    pageIds={this.state.pageIds}
                    updatePageIds={this.updatePageIds}
                    updateSelectedPageName={this.updateSelectedPageName}
                    user={{
                      userId: this.props.state.userId,
                      name: this.props.state.visible ? this.props.state.name : "Anonymous (Me)",
                    }}
                    redirectPage={this.redirectPage}
                    loungeId={this.props.state.loungeId}
                    setLoungeId={this.setLoungeId}
                    isSiteAdmin={this.props.state.isSiteAdmin}
                    disconnect={this.props.disconnect}
                    logout={this.logout}
                    visible={this.props.state.visible}
                    seeHelpText={this.props.state.seeHelpText}
                    setSeeHelpText={this.props.setSeeHelpText}
                    semester={this.state.semester}
                  />
                  <Page
                    path={"/:semester/group/:selectedPage"}
                    schoolId={this.props.state.schoolId}
                    pageIds={this.state.pageIds}
                    updatePageIds={this.updatePageIds}
                    updateSelectedPageName={this.updateSelectedPageName}
                    user={{ userId: this.props.state.userId, name: this.props.state.name }}
                    redirectPage={this.redirectPage}
                    loungeId={this.props.state.loungeId}
                    setLoungeId={this.setLoungeId}
                    allPages={this.state.allPages}
                    isSiteAdmin={this.props.state.isSiteAdmin}
                    disconnect={this.props.disconnect}
                    seeHelpText={this.props.state.seeHelpText}
                    setSeeHelpText={this.props.setSeeHelpText}
                    logout={this.logout}
                    semester={this.state.semester}
                  />        
                  <UserPage
                    style={{ height: "100%" }}
                    path={"/:semester/user/:selectedPage"}
                    schoolId={this.props.state.schoolId}
                    pageIds={this.state.pageIds}
                    updatePageIds={this.updatePageIds}
                    updateSelectedPageName={this.updateSelectedPageName}
                    user={{ userId: this.props.state.userId, name: this.props.state.name }}
                    redirectPage={this.redirectPage}
                    loungeId={this.props.state.loungeId}
                    setLoungeId={this.setLoungeId}
                    allPages={this.state.allPages}
                    isSiteAdmin={this.props.state.isSiteAdmin}
                    disconnect={this.props.disconnect}
                    seeHelpText={this.props.state.seeHelpText}
                    setSeeHelpText={this.props.setSeeHelpText}
                    logout={this.logout}
                    semester={this.state.semester}
                  />
                  <NotFound default />
                </Switch>
              </Router>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Main;
