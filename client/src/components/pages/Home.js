import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js";
import {
  Spin,
  Space,
  Switch,
  Button,
  Typography,
  Layout,
  Row,
  Col,
  PageHeader,
  Descriptions,
} from "antd";
import DDQLSection from "../modules/DDQLSection";
import TabPage from "../modules/TabPage";
import SearchBar from "../modules/SearchBar";
import LoungeList from "../modules/LoungeList";
import MySpin from "../modules/MySpin";
import AdminRequests from "../modules/AdminRequests";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      users: [],
      dueDates: [],
      quickLinks: [],
      lounges: [],
    };
    props.updateSelectedPageName("");
  }

  addToLounge = (userId, loungeId, callback = () => {}) => {
    let lounges = this.state.lounges;
    let lounge = lounges.filter((l) => {
      return l._id + "" === loungeId;
    })[0];

    let newLounges = lounges.filter((l) => {
      return l._id + "" !== loungeId;
    });

    let userIds = lounge.userIds;
    if (userIds.includes(userId)) return;
    userIds.push(userId);
    lounge.userIds = userIds;
    newLounges.push(lounge);
    this.setState({ lounges: newLounges }, callback);
  };

  removeFromLounge = (userId, loungeId, callback = () => {}) => {
    if (loungeId !== "") {
      let lounges = this.state.lounges;
      let lounge = lounges.filter((l) => {
        return l._id + "" === loungeId;
      })[0];
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
        users: data.users,
        dueDates: data.dueDates,
        quickLinks: data.quickLinks,
        lounges: data.lounges,
        pageLoaded: true,
        adminRequests: data.adminRequests,
      });
    });

    socket.on("userAddedToLounge", (data) => {
      console.log("user just got added to lounge");
      this.addToLounge(data.userId, data.loungeId);
    });

    socket.on("userRemovedFromLounge", (data) => {
      this.removeFromLounge(data.userId, data.loungeId);
    });

    socket.on("newLounge", (lounge) => {
      let lounges = this.state.lounges;
      lounges.push(lounge);
      this.setState({ lounges: lounges });
    });
    socket.on("userJoinedPage", (data) => {
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
            padding: "30px 30px 30px 30px",
            background: "#fff",
            height: "calc(100vh - 64px)",
          }}
        >
          <TabPage
            labels={["Welcome", "Dashboard", "Privacy"].concat(
              this.props.isSiteAdmin ? ["Admin"] : []
            )}
            routerLinks={["welcome", "dashboard", "privacy"].concat(
              this.props.isSiteAdmin ? ["admin"] : []
            )}
            defaultRouterLink={this.props.seeHelpText ? "welcome" : "dashboard"}
          >
            <div>
              <SearchBar
                size="large"
                allPages={this.props.allPages}
                placeholder="Search for a class or group to join!"
                redirectPage={this.props.redirectPage}
                defaultOpen={true}
              />
            </div>
            <Row>
              <Col span={12}>
                <DDQLSection
                  dataSource={this.state.dueDates}
                  users={this.state.users}
                  user={this.props.user}
                  type="DueDate"
                  home={true}
                  pageMap={pageMap}
                />

                <DDQLSection
                  dataSource={this.state.quickLinks}
                  users={this.state.users}
                  user={this.props.user}
                  type="QuickLink"
                  home={true}
                  pageMap={pageMap}
                />
              </Col>
              <Col span={12}>
                <Title level={4}>{"Open Lounges"}</Title>
                {this.props.myPages.map((page) => {
                  let lounges = this.state.lounges
                    ? this.state.lounges.filter((lounge) => {
                        return lounge.pageId === page._id;
                      })
                    : [];
                  if (lounges.length === 0) return <></>;
                  return (
                    <LoungeList
                      redirect={(link) => this.props.redirectPage(link)}
                      lounges={lounges}
                      users={this.state.users}
                      page={page}
                      home={true}
                    />
                  );
                })}
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
                  Toggle help mode to hide the helper text that appears on dashboard
                </div>
              </div>
            </div>
            <AdminRequests adminRequests={this.state.adminRequests} />
          </TabPage>
        </Content>

        <div style={{ bottom: "20px", padding: "10px 10px 10px 10px" }}>
          <center>
            <Button type="link" target="_blank" href="https://forms.gle/ZSdrfPZfpwngxQ3aA">
              Please share any bugs or feedback here!
            </Button>
          </center>
        </div>
      </Layout>
    );
  }
}

export default Home;
