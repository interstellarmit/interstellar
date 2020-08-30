import React, { Component } from "react";
import { get, post } from "../../utilities";
import DashboardTab from "../modules/DashboardTab";
import TempForumTab from "../modules/TempForumTab";
import ForumTab from "../modules/ForumTab";
import LoungesTab from "../modules/LoungesTab";
import InfoTab from "../modules/InfoTab";
import TabPage from "../modules/TabPage";
import AddLock from "../modules/AddLock";
import AdminRequests from "../modules/AdminRequests";
import AddEnterCode from "../modules/AddEnterCode";
import MySpin from "../modules/MySpin";
import { socket } from "../../client-socket.js";
import { Spin, Space, Button, Typography, Layout, PageHeader, Badge, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
import {
  UserAddOutlined,
  UserDeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
class Page extends Component {
  constructor(props) {
    super(props);
    let selectedPage = this.props.computedMatch.params.selectedPage;
    this.state = {
      pageName: selectedPage,
      users: [],
      dueDates: [],
      quickLinks: [],
      lounges: [],
      page: {},
      pageLoaded: false,
      lockModal: false,
    };
    props.updateSelectedPageName(selectedPage);
  }

  /*
  createNewDDQL
  Input: {
    title: String,
    objectType: String ("DueDate" or "QuickLink")
    dueDate: Date,
    url: String,
    pageId: String,
    visibility: String ("Public" or "Only Me")
  }*/
  createNewDDQL = (input, callback) => {
    post("/api/createNewDDQL", Object.assign(input, { pageId: this.state.page._id })).then(
      (data) => {
        if (!data.created) return;
        let DDQL = data.DDQL;
        post("/api/addOrCompleteDDQL", {
          objectId: DDQL._id,
          action: "add",
          amount: "single",
        }).then((result) => {
          if (result.done) {
            if (DDQL.objectType === "DueDate") {
              let DDQLs = this.state.dueDates;
              DDQL.addedUserIds = [this.props.user.userId];
              DDQLs.push(DDQL);
              this.setState({ dueDates: DDQLs });
            } else {
              let DDQLs = this.state.quickLinks;
              DDQL.addedUserIds = [this.props.user.userId];
              DDQLs.push(DDQL);
              this.setState({ quickLinks: DDQLs });
            }
            callback(DDQL._id);
          }
        });
      }
    );
  };

  editDDQL = (input) => {
    post("/api/editDDQL", input).then((data) => {
      if (data.edited) {
        if (data.DDQL.objectType === "DueDate") {
          let DDQLs = this.state.dueDates.filter((duedate) => {
            return duedate._id !== data.DDQL._id;
          });
          DDQLs.push(data.DDQL);
          this.setState({ dueDates: DDQLs });
        } else {
          let DDQLs = this.state.quickLinks.filter((quicklink) => {
            return quicklink._id !== data.DDQL._id;
          });
          DDQLs.push(data.DDQL);
          this.setState({ quickLinks: DDQLs });
        }
      }
    });
  };

  createNewLounge = (data) => {
    post("/api/createNewLounge", {
      name: data.name,
      pageId: this.state.page._id,
      zoomLink: data.zoomLink,
      permanent: data.permanent,
    }).then((data) => {
      if (!data.created) return;
      let lounges = this.state.lounges;
      lounges.push(data.lounge);
      this.setState({ lounges: lounges }, () => {
        let page = this.state.page;
        this.props.redirectPage(
          "/" + page.pageType.toLowerCase() + "/" + page.name + "/lounge"
          // "/" + page.pageType.toLowerCase() + "/" + page.name + "/lounges/" + data.lounge._id
        );
      });
    });
  };

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

  addSelfToLounge = (loungeId, callback = () => {}) => {
    post("/api/addSelfToLounge", {
      loungeId: loungeId,
    }).then((data) => {
      if (data.added) {
        this.addToLounge(this.props.user.userId, loungeId, callback);
      } else {
        callback();
      }
    });
  };

  removeSelfFromLounge = (loungeId, callback = () => {}) => {
    post("/api/removeSelfFromLounge", {
      loungeId: loungeId,
    }).then((data) => {
      if (data.removed) {
        this.removeFromLounge(this.props.user.userId, loungeId, callback);
      } else {
        callback();
      }
    });
  };

  componentDidMount() {
    post("/api/joinPage", { pageName: this.state.pageName, schoolId: this.props.schoolId }).then(
      (data) => {
        if (data.broken) {
          this.props.logout();
          return;
        }
        this.setState({
          users: data.users,
          dueDates: data.dueDates,
          quickLinks: data.quickLinks,
          lounges: data.lounges,
          page: data.page,
          pageLoaded: true,
          inPage: data.inPage,
          adminRequests: data.adminRequests,
        });
      }
    );
    // remember -- api calls go here!

    socket.on("userAddedToLounge", (data) => {
      this.addToLounge(data.userId, data.loungeId);
    });

    socket.on("userJoinedPage", (data) => {
      if (this.state.page._id !== data.pageId) return;
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

    socket.on("userRemovedFromLounge", (data) => {
      this.removeFromLounge(data.userId, data.loungeId);
    });

    socket.on("newLounge", (lounge) => {
      let lounges = this.state.lounges;
      lounges.push(lounge);
      this.setState({ lounges: lounges });
    });

    socket.on("locked", (data) => {
      if (data.pageId !== this.state.page._id) return;
      let page = this.state.page;
      page.locked = data.locked;
      this.setState({ page: page });
    });
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
    post("/api/addSelfToPage", { pageId: id, joinCode: joinCode }).then((data) => {
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
          post("/api/removeSelfFromPage", { pageId: this.state.page._id }).then((data) => {
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

    return (
      <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <PageHeader
          className="site-layout-sub-header-background"
          style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
          extra={(isPageAdmin && this.state.inPage
            ? [
                <Button icon={<UserOutlined />} disabled>
                  Admin
                </Button>,
              ]
            : []
          )
            .concat([this.state.inPage ? removeClassButton : addClassButton])
            .concat(isPageAdmin && this.state.inPage ? [lockButton] : [])}
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
        />
        <Content
          style={{
            padding: "0px 30px 30px 30px",
            background: "#fff",
            height: "calc(100vh - 64px)",
          }}
        >
          {this.state.inPage ? (
            <TabPage
              labels={[
                "Info",
                "Dashboard",
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div>{"Lounge"}</div>

                  <Badge count={numInLounge} size="small" style={{ marginLeft: "5px" }} />
                </div>,
                "Forum",
              ].concat(this.state.adminRequests.length > 0 ? ["Admin"] : [])}
              routerLinks={["info", "dashboard", "lounge", "forum"].concat(
                this.state.adminRequests.length > 0 ? ["admin"] : []
              )}
              defaultRouterLink={!this.state.inPage ? "info" : "dashboard"}
              page={this.state.page}
            >
              <InfoTab
                users={this.state.users}
                inPage={true}
                page={this.state.page}
                user={this.props.user}
                pageIds={this.props.pageIds}
                allPages={this.props.allPages}
                isSiteAdmin={this.props.isSiteAdmin}
              />
              <DashboardTab
                dueDates={this.state.dueDates}
                quickLinks={this.state.quickLinks}
                lounges={this.state.lounges}
                users={this.state.users}
                page={this.state.page}
                inPage={true}
                seeHelpText={this.props.seeHelpText}
                setSeeHelpText={this.props.setSeeHelpText}
                isSiteAdmin={this.props.isSiteAdmin}
                allPages={this.props.allPages}
                createNewDDQL={this.createNewDDQL}
                editDDQL={this.editDDQL}
                user={this.props.user}
                redirectPage={this.props.redirectPage}
                isPageAdmin={isPageAdmin}
              />
              <LoungesTab
                lounges={this.state.lounges}
                users={this.state.users}
                page={this.state.page}
                addSelfToLounge={this.addSelfToLounge}
                removeSelfFromLounge={this.removeSelfFromLounge}
                createNewLounge={this.createNewLounge}
                loungeId={this.props.loungeId}
                user={this.props.user}
                isSiteAdmin={this.props.isSiteAdmin}
                setLoungeId={this.props.setLoungeId}
              />
              <ForumTab user={this.props.user} users={this.state.users} page={this.state.page} />
              <AdminRequests adminRequests={this.state.adminRequests} />
            </TabPage>
          ) : (
            <TabPage
              labels={["Info"]}
              routerLinks={["info"]}
              defaultRouterLink={"info"}
              page={this.state.page}
            >
              <InfoTab
                users={this.state.users}
                inPage={false}
                page={this.state.page}
                user={this.props.user}
              />
            </TabPage>
          )}
        </Content>
      </Layout>
    );
  }
}

export default Page;
