import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js";
import { Spin, Space, Button, Typography, Layout, Row, Col, PageHeader } from "antd";
import DDQLSection from "../modules/DDQLSection";
import LoungeList from "../modules/LoungeList";
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

      if (lounge.userIds.length > 0) newLounges.push(lounge);
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
        this.props.disconnect();
        return;
      }
      this.setState({
        users: data.users,
        dueDates: data.dueDates,
        quickLinks: data.quickLinks,
        lounges: data.lounges,
        pageLoaded: true,
      });
    });

    socket.on("userAddedToLounge", (data) => {
      console.log("addingUser...");
      this.addToLounge(data.userId, data.loungeId);
    });

    socket.on("userRemovedFromLounge", (data) => {
      console.log("removingUser...");
      this.removeFromLounge(data.userId, data.loungeId);
    });

    socket.on("newLounge", (lounge) => {
      let lounges = this.state.lounges;
      lounges.push(lounge);
      this.setState({ lounges: lounges });
    });
    socket.on("userJoinedPage", (data) => {
      console.log("addingUser...");
      let users = this.state.users;
      users.push(data.user);
      this.setState({ users: users });
    });
  }

  render() {
    if (!this.state.pageLoaded) {
      return <Spin />;
    }
    let pageMap = {};
    let i = 0;
    for (i = 0; i < this.props.myPages.length; i++) {
      let page = this.props.myPages[i];
      pageMap[page._id] = page.name;
    }
    return (
      <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <Header
          className="site-layout-sub-header-background"
          style={{
            padding: "0px 20px 0px 20px",
            backgroundColor: "#fff",
            color: "white",
            height: "64px",
          }}
        >
          <Space align="end">
            <Title level={3}>{"Welcome, " + this.props.user.name.split(" ")[0] + "!"}</Title>
          </Space>
        </Header>

        <Content
          style={{
            margin: "36px 24px 36px 24px",
            padding: 24,
            background: "#fff",
            height: "calc(100vh - 64px)",
          }}
        >
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
                return (
                  <LoungeList
                    redirect={(link) => this.props.redirectPage(link)}
                    lounges={this.state.lounges.filter((lounge) => {
                      return lounge.pageId === page._id;
                    })}
                    users={this.state.users}
                    page={page}
                    home={true}
                  />
                );
              })}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Home;
