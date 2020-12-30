import React, { Component } from "react";
import { get, post } from "../../utilities";

import InfoTab from "../modules/InfoTab";
import TabPage from "../modules/TabPage";
import AddLock from "../modules/AddLock";
import AddEnterCode from "../modules/AddEnterCode";
import MySpin from "../modules/MySpin";
import { socket } from "../../client-socket.js";
import { Spin, Space, Button, Typography, Layout, PageHeader, Badge, Row, Col, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
import {
  UserAddOutlined,
  UserDeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
class Page extends Component {
  constructor(props) {
    super(props);
    let selectedPage = this.props.computedMatch.params.selectedPage;
    this.state = {
      pageName: selectedPage,
      users: [],
      page: {},
      pageLoaded: false,
      lockModal: false,
    };
    props.updateSelectedPageName(selectedPage);
  }
  joinPage() {
    post("/api/joinPage", { pageName: this.state.pageName, semester: this.props.semester }).then(
      (data) => {
        if (data.broken) {
          //this.props.disconnect();
          this.props.logout();
          return;
        }
        this.setState({
          users: data.users || [],
          page: data.page,
          pageLoaded: true,
          inPage: data.inPage,
          showClasses: data.page.showClasses,
          hostName: data.hostName,
        });
      }
    );
  }
  componentDidMount() {
    this.joinPage();
    // remember -- api calls go here!

    socket.on("userJoinedPage", (data) => {
      if (!this.state.pageLoaded) return;
      if (this.state.page._id !== data.pageId) return;
      if (this.props.semester !== data.semester) return;
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

    socket.on("locked", (data) => {
      if (!this.state.pageLoaded) return;
      if (data.pageId !== this.state.page._id) return;
      let page = this.state.page;
      page.locked = data.locked;
      this.setState({ page: page });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.semester !== prevProps.semester) {
      this.setState({ users: [] }, () => {
        this.joinPage();
      });
    }
  }

  setLockModal = (bol) => {
    this.setState({ lockModal: bol });
  };

  setLockCode = (lock, code) => {
    post("/api/setJoinCode", { lock: lock, code: code, pageId: this.state.page._id }).then(
      (data) => {
        if (data.setCode) {
          let page = this.state.page;
          page.locked = lock;
          this.setState({ page: page });
        }
      }
    );
  };

  addSelfToPage = (id, joinCode = "") => {
    post("/api/addSelfToPage", {
      pageId: id,
      joinCode: joinCode,
      semester: this.props.semester,
    }).then((data) => {
      if (data.added) {
        let newPageIds = this.props.pageIds;
        newPageIds.push(id);
        this.props.updatePageIds(newPageIds);
        this.setState({ inPage: true, pageLoaded: false });
        this.componentDidMount();
      } else console.log("error");
    });
  };

  render() {
    if (!this.state.pageLoaded) {
      return <MySpin />;
    }

    let mainLounge = this.state.lounges
      ? this.state.lounges.find((lounge) => {
          return lounge.main;
        })
      : undefined;
    let numInLounge = mainLounge ? mainLounge.userIds.length : 0;
    let removeClassButton = (
      <Button
        type="primary"
        onClick={() => {
          post("/api/removeSelfFromPage", {
            pageId: this.state.page._id,
            semester: this.props.semester,
          }).then((data) => {
            if (data.removed) {
              this.props.updatePageIds(
                this.props.pageIds.filter((id) => {
                  return id !== this.state.page._id;
                })
              );
              this.setState({ inPage: false });
              this.props.redirectPage(
                "/" + this.state.page.pageType.toLowerCase() + "/" + this.state.page.name + "/info"
              );
            } else console.log("error");
          });
        }}
      >
        <UserDeleteOutlined /> Leave {this.state.page.pageType}
      </Button>
    );

    let addClassButton = (
      <Button
        type="primary"
        onClick={() => {
          this.state.page.locked
            ? this.setState({ enterCodeModal: true })
            : this.addSelfToPage(this.state.page._id);
        }}
      >
        <UserAddOutlined /> Join {this.state.page.pageType}
      </Button>
    );

    let lockButton = (
      <Button
        onClick={() => {
          this.state.page.locked ? this.setLockCode(false, "") : this.setLockModal(true);
        }}
      >
        {this.state.page.locked ? (
          <React.Fragment>
            <LockOutlined /> Locked
          </React.Fragment>
        ) : (
          <React.Fragment>
            <UnlockOutlined /> Unlocked
          </React.Fragment>
        )}
      </Button>
    );

    let isPageAdmin =
      this.state.page.adminIds.includes(this.props.user.userId) || this.props.isSiteAdmin;
    let sameAs =
      this.state.page.sameAs && this.state.page.sameAs.length > 0
        ? this.state.page.sameAs.split(", ")
        : [];
    return (
      <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <PageHeader
          className="site-layout-sub-header-background"
          style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
          extra={(this.state.page.pageType === "Group"
            ? [
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    let sc = this.state.showClasses;
                    post("/api/setShowClasses", {
                      pageId: this.state.page._id,
                      showClasses: !sc,
                    }).then((data) => {
                      if (data.set) this.setState({ showClasses: !sc });
                    });
                  }}
                  disabled={!isPageAdmin}
                >
                  {!this.state.showClasses ? "Classes Hidden" : "Classes Visible"}
                </Button>,
              ]
            : [
                sameAs.length > 0 ? (
                  <Button
                    onClick={() => {
                      this.props.redirectPage("/class/" + sameAs[0]);
                    }}
                  >
                    Same as <a>{" " + sameAs[0] + ""}</a>
                  </Button>
                ) : (
                  <></>
                ),
              ]
          )

            .concat([this.state.inPage ? removeClassButton : addClassButton])
            .concat(isPageAdmin ? [lockButton] : [])}
          title={this.state.page.name}
          subTitle={this.state.page.title}
        ></PageHeader>
        <AddLock
          lockModal={this.state.lockModal}
          setLockModal={this.setLockModal}
          setLockCode={this.setLockCode}
        />
        <AddEnterCode
          enterCodeModal={this.state.enterCodeModal}
          setEnterCodeModal={(bool) => {
            this.setState({ enterCodeModal: bool });
          }}
          addSelfToPage={this.addSelfToPage}
          pageId={this.state.page._id}
          hostName={this.state.hostName}
        />

        <Content
          style={{
            padding: "0px 30px 30px 30px",
            background: "#fff",
            height: "calc(100% - 64px)",
          }}
        >
          <TabPage
            labels={["Info"]}
            routerLinks={["info"]}
            defaultRouterLink={"info"}
            page={this.state.page}
            semester={this.props.semester}
          >
            <InfoTab
              users={this.state.users}
              inPage={this.state.inPage}
              page={this.state.page}
              user={this.props.user}
              pageIds={this.props.pageIds}
              allPages={this.props.allPages}
              isSiteAdmin={this.props.isSiteAdmin}
              showClasses={this.state.showClasses}
            />
          </TabPage>
        </Content>
      </Layout>
    );
  }
}

export default Page;
