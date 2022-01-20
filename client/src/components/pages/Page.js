import { LinkOutlined, UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Button, Input, Layout, Modal, PageHeader, Typography } from "antd";
import React, { Component } from "react";
import { useMediaQuery } from "react-responsive";
import { post } from "../../utilities";
import InfoTab from "../modules/InfoTab";
import MySpin from "../modules/MySpin";
import TabPage from "../modules/TabPage";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph } = Typography;
class PageClassComponent extends Component {
  constructor(props) {
    super(props);
    let selectedPage = this.props.computedMatch.params.selectedPage;
    let code = window.location.search;
    const params = new URLSearchParams(code);
    code = params.get("link");
    this.state = {
      pageName: selectedPage,
      users: [],
      page: {},
      pageLoaded: false,
      inviteCode: code,
    };
    props.updateSelectedPageName(selectedPage);
  }

  showInviteModal = () => {
    if (!this.state.inPage && this.state.inviteCode && this.props.user.userId) {
      Modal.confirm({
        title: (
          <div>
            You have been invited to{" "}
            <span style={{ color: "#396dff", fontWeight: 900 }}>
              {this.state.page.name || "Group"}
            </span>
          </div>
        ),
        content: `All members of ${this.state.page.name} will be able to see your classes`,
        okText: `Join ${this.state.page.name}`,
        cancelText: `Decline Invitation`,
        onOk: () => {
          this.addSelfToPage(this.state.page._id);
        },
      });
    }
  };

  joinPage() {
    post("/api/joinPage", { pageName: this.state.pageName, semester: this.props.semester }).then(
      (data) => {
        this.setState(
          {
            users: data.users || [],
            page: data.page,
            pageLoaded: true,
            inPage: data.inPage,
            hostName: data.hostName,
          },
          () => {
            this.showInviteModal();
          }
        );
      }
    );
  }
  componentDidMount() {
    this.joinPage();
    // remember -- api calls go here!
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.semester !== prevProps.semester) {
      this.setState({ users: [] }, () => {
        this.joinPage();
      });
    }
  }

  addSelfToPage = (id) => {
    post("/api/addSelfToPage", {
      pageId: id,
      inviteCode: this.state.inviteCode,
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
          if (this.state.page.pageType === "Class") {
            this.addSelfToPage(this.state.page._id);
          } else if (this.state.inviteCode) {
            this.showInviteModal();
          } else {
            Modal.info({
              title: (
                <div>
                  Contact{" "}
                  <span style={{ color: "#396dff", fontWeight: 900 }}>
                    {this.state.hostName || "a member of the group"}
                  </span>{" "}
                  for the invite link
                </div>
              ),
              onOk() {},
            });
          }
        }}
      >
        <UserAddOutlined /> Join {this.state.page.pageType}
      </Button>
    );

    let inviteButton = (
      <Button
        onClick={() => {
          const url = `${window.location.host}/${
            this.props.semester
          }/${this.state.page.pageType.toLowerCase()}/${this.state.page.name}?link=${
            this.state.page?.inviteCode
          }`;
          navigator.clipboard.writeText(url);
          Modal.success({
            title: (
              <div>
                Invite link to{" "}
                <span style={{ color: "#396dff", fontWeight: 900 }}>
                  {this.state.page.name || "your group"}
                </span>{" "}
                copied to clipboard
              </div>
            ),
            content: (
              <>
                <Input
                  size="large"
                  placeholder="Invite Link"
                  suffix={<LinkOutlined />}
                  value={url}
                />
              </>
            ),
            onOk() {},
          });
        }}
      >
        <React.Fragment>
          <LinkOutlined /> Invite Link
        </React.Fragment>
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
            ? []
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
            .concat(
              this.state.inPage && this.state.page.pageType === "Group" ? [inviteButton] : []
            )}
          title={this.state.page.name}
          subTitle={!this.props.isMobile && this.state.page.title}
        ></PageHeader>
        <Content
          style={{
            padding: "0px 30px 30px 30px",
            background: "#fff",
            height: "calc(100% - 64px)",
          }}
        >
          <TabPage
            labels={["Info"]}
            isMobile={this.props.isMobile}
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
              redirectPage={this.props.redirectPage}
            />
          </TabPage>
        </Content>
      </Layout>
    );
  }
}

export default function Page(props) {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  return <PageClassComponent {...props} isMobile={isMobile} />;
}
