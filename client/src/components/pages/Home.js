import {
  GiftOutlined,
  HomeOutlined,
  LaptopOutlined,
  ReadOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Descriptions, Layout, PageHeader, Switch } from "antd";
import React, { Component } from "react";
import EditProfile from "../modules/EditProfile";
import MultipleSearchBar from "../modules/MultipleSearchBar";
import SearchBar from "../modules/SearchBar";
import TabPage from "../modules/TabPage";

const { Content } = Layout;
class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      profileModal: false,
    };
    props.updateSelectedPageName("");
  }

  componentDidMount() {
    document.getElementsByClassName("ant-tabs-content")[0].style.height = "100%";
  }

  setProfileModal = (bool) => {
    this.setState({ profileModal: bool });
  };

  render() {
    let pageMap = {};
    let i = 0;
    for (i = 0; i < this.props.myPages.length; i++) {
      let page = this.props.myPages[i];
      pageMap[page._id] = page.name;
    }
    let semester =
      this.props.semester.replace("-", " ")[0].toUpperCase() +
      this.props.semester.replace("-", " ").substring(1);

    let userInfo = [
      { icon: <LaptopOutlined />, label: "Currently lives in", value: this.props.curLoc },
      { icon: <HomeOutlined />, label: "Originally from", value: this.props.hometown },
      { icon: <UserOutlined />, label: "Bio", value: this.props.bio },
      { icon: <ReadOutlined />, label: "Activities", value: this.props.activities },
      { icon: <ShopOutlined />, label: "Favorite Boston Restaurant", value: this.props.restaurant },
      { icon: <GiftOutlined />, label: "Advice", value: this.props.advice },
    ];
    let anyInfo =
      userInfo.filter((entry) => {
        return entry.value && entry.value.length > 0;
      }).length > 0;
    return (
      <>
        <Layout style={{ background: "rgba(255, 255, 255, 1)", height: "100vh" }}>
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
              labels={["Dashboard", "Settings/Privacy", "Profile"]}
              routerLinks={["dashboard", "settings", "profile"]}
              defaultRouterLink={"profile"}
              semester={this.props.semester}
            >
              <div>
                {this.props.myPages.filter((page) => {
                  return page.pageType === "Class";
                }).length > 0 ? (
                  <SearchBar
                    size="large"
                    allPages={this.props.allPages}
                    placeholder={"Search for a " + semester + " class!"}
                    redirectPage={this.props.redirectPage}
                    defaultOpen={true}
                  />
                ) : (
                  <MultipleSearchBar
                    size="large"
                    allPages={this.props.allPages}
                    placeholder={"Add classes to your " + semester + " schedule!"}
                    redirectPage={this.props.redirectPage}
                    defaultOpen={true}
                    addClasses={this.props.addClasses}
                  />
                )}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Switch
                    checked={!this.props.visible}
                    onChange={(checked) => {
                      this.props.setVisible(!checked);
                    }}
                    checkedChildren={"On "}
                    unCheckedChildren={"Off"}
                  />
                  <div style={{ paddingLeft: "10px" }}>
                    Toggle privacy mode to appear as anonymous in all of your classes
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <Switch
                    checked={!this.props.profileVisible}
                    onChange={(checked) => {
                      this.props.setProfileVisible(!checked);
                    }}
                    checkedChildren={"On "}
                    unCheckedChildren={"Off"}
                  />
                  <div style={{ paddingLeft: "10px" }}>
                    Toggle profile privacy mode to hide your profile from other users
                  </div>
                </div>
              </div>

              <div style={{ overflowY: "auto", height: "100%" }}>
                <Descriptions
                  column={1}
                  bordered={anyInfo}
                  title="My User Info"
                  extra={
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setProfileModal(true);
                      }}
                    >
                      <UserOutlined /> Edit Profile
                    </Button>
                  }
                >
                  {userInfo
                    .filter((entry) => {
                      return entry.value && entry.value.length > 0;
                    })
                    .map((entry) => {
                      return (
                        <Descriptions.Item
                          label={
                            <div>
                              {entry.icon} {entry.label}
                            </div>
                          }
                        >
                          {entry.value}
                        </Descriptions.Item>
                      );
                    })}
                </Descriptions>
                {anyInfo ? "" : "You have not added info to your profile yet!"}

                <EditProfile
                  profileModal={this.state.profileModal}
                  setProfileModal={this.setProfileModal}
                  hometown={this.props.hometown}
                  bio={this.props.bio}
                  activities={this.props.activities}
                  advice={this.props.advice}
                  curLoc={this.props.curLoc}
                  restaurant={this.props.restaurant}
                />
              </div>
            </TabPage>
          </Content>

          <div style={{ bottom: "10px", padding: "10px 50px 10px 50px" }}>
            <center>
              <div style={{ fontSize: "10px" }}>
                Thanks to{" "}
                <a href="https://hacklodge.org/" target="_blank">
                  Hacklodge
                </a>
                {" and "}
                <a href="https://fireroad.mit.edu/" target="_blank">
                  FireRoad
                </a>{" "}
                for support and class information. This is not a catalog. Please share any bugs or
                feedback{" "}
                <a href="https://forms.gle/ZSdrfPZfpwngxQ3aA" target="_blank">
                  here
                </a>
                !
              </div>
            </center>
          </div>
        </Layout>
      </>
    );
  }
}

export default Home;
