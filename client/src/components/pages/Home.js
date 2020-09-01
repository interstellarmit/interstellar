import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js";
import {
  Spin,
  Space,
  Modal,
  Switch,
  Button,
  Typography,
  Layout,
  Row,
  Col,
  PageHeader,
  Descriptions,
  notification,
} from "antd";
import DDQLSection from "../modules/DDQLSection";
import TabPage from "../modules/TabPage";
import SearchBar from "../modules/SearchBar";
import MultipleSearchBar from "../modules/MultipleSearchBar";
import LoungeList from "../modules/LoungeList";
import MySpin from "../modules/MySpin";
import AdminRequests from "../modules/AdminRequests";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// var classes = require("../../full.json");

function populateLounges() {
  console.log("hi there");
  post("/api/populateLounges", { zoomLink: undefined }).then((res) => {
    console.log(res.created);
  });
}

class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      users: [],
      dueDates: [],
      quickLinks: [],
      lounges: [],
      showDueDate: true,
    };
    props.updateSelectedPageName("");
  }

  addToLounge = (userId, loungeId, callback = () => {}) => {
    let lounges = this.state.lounges;
    let lounge = lounges.find((l) => {
      return l._id + "" === loungeId;
    });
    if (!lounge) {
      callback();
      return;
    }
    let newLounges = lounges.filter((l) => {
      return l._id + "" !== loungeId;
    });

    let userIds = lounge.userIds;
    if (userIds.includes(userId)) return;
    userIds.push(userId);
    lounge.userIds = userIds;
    newLounges.push(lounge);
    this.setState({ lounges: newLounges }, callback);

    if (this.props.user.userId !== userId) {
      notification.info({
        message:
          (
            this.state.users.find((user) => {
              return user.userId === userId;
            }) || { name: "User Name" }
          ).name.split(" ")[0] +
          " entered the " +
          lounge.name +
          " lounge",

        description: "",
        placement: "bottomRight",
        onClick: () => {
          let page = this.props.myPages.find((pagee) => {
            return pagee._id === lounge.pageId;
          });
          if (!page) return;
          this.props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name + "/lounge");
        },
      });
    }
  };

  removeFromLounge = (userId, loungeId, callback = () => {}) => {
    if (loungeId !== "") {
      let lounges = this.state.lounges;
      let lounge = lounges.find((l) => {
        return l._id + "" === loungeId;
      });
      if (!lounge) {
        callback();
        return;
      }
      let newLounges = lounges.filter((l) => {
        return l._id + "" !== loungeId;
      });

      let userIds = lounge.userIds.filter((id) => {
        return id !== userId;
      });
      lounge.userIds = userIds;

      if (lounge.userIds.length > 0 || lounge.permanent) newLounges.push(lounge);
      this.setState({ lounges: newLounges }, () => {
        callback();
      });

      if (this.props.user.userId !== userId) {
        notification.info({
          message:
            (
              this.state.users.find((user) => {
                return user.userId === userId;
              }) || { name: "User Name" }
            ).name.split(" ")[0] +
            " left the " +
            lounge.name +
            " lounge",

          description: "",
          placement: "bottomRight",
          onClick: () => {
            let page = this.props.myPages.find((pagee) => {
              return pagee._id === lounge.pageId;
            });
            if (!page) return;
            this.props.redirectPage(
              "/" + page.pageType.toLowerCase() + "/" + page.name + "/lounge"
            );
          },
        });
      }
    } else {
      callback();
    }
  };

  componentDidMount() {
    post("api/joinPage", { home: true }).then((data) => {
      if (data.broken) {
        this.props.logout();
        return;
      }
      this.setState({
        users: data.users || [],
        dueDates: data.dueDates || [],
        quickLinks: data.quickLinks || [],
        lounges: data.lounges || [],
        pageLoaded: true,
        adminRequests: data.adminRequests || [],
      });
      document.getElementsByClassName("ant-tabs-content")[0].style.height = "100%";
    });

    socket.on("userAddedToLounge", (data) => {
      //console.log("user just got added to lounge");
      if (!this.state.pageLoaded) return;
      this.addToLounge(data.userId, data.loungeId);
    });

    socket.on("userRemovedFromLounge", (data) => {
      if (!this.state.pageLoaded) return;
      this.removeFromLounge(data.userId, data.loungeId);
    });

    socket.on("newLounge", (lounge) => {
      if (!this.state.pageLoaded) return;
      let lounges = this.state.lounges;
      lounges.push(lounge);
      this.setState({ lounges: lounges });
    });
    socket.on("userJoinedPage", (data) => {
      if (!this.state.pageLoaded) return;
      let users = this.state.users;
      if (
        users.filter((user) => {
          return user.userId === data.user.userId;
        }).length > 0
      )
        return;
      users.push(data.user);
      this.setState({ users: users });
    });
  }

  render() {
    if (!this.state.pageLoaded) {
      return <MySpin />;
    }
    let pageMap = {};
    let i = 0;
    for (i = 0; i < this.props.myPages.length; i++) {
      let page = this.props.myPages[i];
      pageMap[page._id] = page.name;
    }
    return (
      <>
        <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
          <PageHeader
            className="site-layout-sub-header-background"
            style={{
              padding: "20px 30px 0px 30px",
              backgroundColor: "#fff",
              color: "white",
              height: "64px",
            }}
            title={"Home"}
            subTitle={this.props.user.name}
          ></PageHeader>

          <Content
            style={{
              padding: "0px 30px 30px 30px",
              background: "#fff",
              height: "calc(100% - 64px)",
            }}
          >
            <TabPage
              labels={["Dashboard", "Settings/Privacy"].concat(
                this.props.isSiteAdmin ? ["Admin"] : []
              )}
              routerLinks={["dashboard", "settings"].concat(
                this.props.isSiteAdmin ? ["admin"] : []
              )}
              defaultRouterLink={"dashboard"}
            >
              <Row style={{ height: "100%" }} gutter={[16, 16]}>
                <Col span={14} style={{ height: "100%" }}>
                  <DDQLSection
                    dataSource={this.state.dueDates}
                    users={this.state.users}
                    user={this.props.user}
                    type="DueDate"
                    home={true}
                    pageMap={pageMap}
                  />
                </Col>
                <Col span={10} style={{ height: "100%" }}>
                  <div style={{ height: "45%" }}>
                    <PageHeader title={"My Lounges"} />
                    <div style={{ height: "calc(100% - 72px)", overflow: "auto" }}>
                      {this.props.myPages
                        .sort((a, b) => {
                          return a.name.localeCompare(b.name);
                        })
                        .map((page) => {
                          let lounge = this.state.lounges
                            ? this.state.lounges.find((lounge) => {
                                return lounge.main && page._id === lounge.pageId;
                              })
                            : undefined;
                          //console.log(lounge);
                          if (lounge) return { lounge: lounge, page: page };
                          return { lounge: { userIds: [] }, bad: true };
                        })
                        .sort((a, b) => {
                          return b.lounge.userIds.length - a.lounge.userIds.length;
                        })
                        .map((data) => {
                          if (data.bad) return <></>;

                          return (
                            <LoungeList
                              redirect={(link) => this.props.redirectPage(link)}
                              lounges={[data.lounge]}
                              users={this.state.users}
                              page={data.page}
                              home={true}
                            />
                          );
                        })}
                    </div>
                  </div>
                  <div style={{ height: "45%" }}>
                    <DDQLSection
                      dataSource={this.state.quickLinks}
                      users={this.state.users}
                      user={this.props.user}
                      type="QuickLink"
                      home={true}
                      pageMap={pageMap}
                    />
                  </div>
                </Col>
              </Row>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Switch
                    checked={!this.props.visible}
                    onChange={(checked) => {
                      this.props.setVisible(!checked);
                    }}
                    checkedChildren={"On"}
                    unCheckedChildren={"Off"}
                  />
                  <div style={{ paddingLeft: "10px" }}>
                    Toggle privacy mode to appear as anonymous in all of your classes
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
                  }}
                >
                  <Switch
                    checked={this.props.seeHelpText}
                    onChange={(checked) => {
                      this.props.setSeeHelpText(checked);
                    }}
                    checkedChildren={"On"}
                    unCheckedChildren={"Off"}
                  />
                  <div style={{ paddingLeft: "10px" }}>
                    Toggle help mode to show the helper text that appears on dashboard
                  </div>
                </div>
                {/*
          // Adding Classes
          */}
                {this.props.email === "dansun@mit.edu" ? (
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
                          sameAs: classObj.sa,
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
                ) : (
                  <></>
                )}
                {this.props.email === "dansun@mit.edu" ? (
                  <button
                    onClick={() => {
                      let keys = Object.keys(classes);
                      let runLoop = (i) => {
                        if (i >= keys.length) return;
                        let oneclass = keys[i];
                        let classObj = classes[oneclass];
                        console.log(classObj.sa);
                        post("/api/sameAs", {
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
                          sameAs: classObj.sa,
                        }).then((created) => {
                          if (created.created) console.log(oneclass + " " + i + "/" + keys.length);
                          else console.log("error:" + oneclass);
                          runLoop(i + 1);
                        });
                      };
                      runLoop(0);
                    }}
                  >
                    Same As
                  </button>
                ) : (
                  <></>
                )}
                {this.props.email === "dansun@mit.edu" ? (
                  <button onClick={populateLounges}>Populate Lounges</button>
                ) : (
                  <></>
                )}
              </div>
              <AdminRequests adminRequests={this.state.adminRequests} />
            </TabPage>
          </Content>

          <div style={{ bottom: "10px", padding: "10px 20% 10px 20%" }}>
            <center>
              <div style={{ fontSize: "10px" }}>
                Disclaimer: All material on this site is compiled by students and therefore
                unofficial. Thanks to{" "}
                <a href="https://hacklodge.org/" target="_blank">
                  Hacklodge
                </a>
                {", "}
                <a href="https://fireroad.mit.edu/" target="_blank">
                  FireRoad
                </a>{" "}
                and{" "}
                <a href="http://gather.town/" target="_blank">
                  Gather
                </a>{" "}
                for their support, and{" "}
                <a href="https://firehose.guide/" target="_blank">
                  Firehose
                </a>{" "}
                for class information. Please share any bugs or feedback{" "}
                <a href="https://forms.gle/ZSdrfPZfpwngxQ3aA" target="_blank">
                  here
                </a>
                !
              </div>
            </center>
          </div>
        </Layout>

        {
          // Modal.success({
          //   title: "Welcome to Interstellar!",
          //   content: (
          //     <>
          //       {"Enter your classes here!"}
          //       <MultipleSearchBar
          //         size="large"
          //         allPages={this.props.allPages}
          //         placeholder="Search for a class to join!"
          //         redirectPage={this.props.redirectPage}
          //         defaultOpen={true}
          //         addClasses={this.props.addClasses}
          //       />
          //     </>
          //   )
          // })
        }

        {
          <div>
            <Modal
              visible={this.props.myPages.length === 0}
              title={"Enter your schedule to get started!"}
              onCancel={() => {
                this.props.redirectPage("dashboard");
              }}
              footer={null}
              closable={false}
              maskClosable={false}
              centered
            >
              <MultipleSearchBar
                size="large"
                allPages={this.props.allPages}
                placeholder="Search for a class to join!"
                redirectPage={this.props.redirectPage}
                defaultOpen={true}
                addClasses={this.props.addClasses}
              />
            </Modal>
          </div>
        }
      </>
    );
  }
}

export default Home;
