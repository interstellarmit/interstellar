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
  Menu,
  Layout,
  Row,
  Col,
  Alert,
  PageHeader,
  Descriptions,
  notification,
} from "antd";

import TabPage from "../modules/TabPage";
import SearchBar from "../modules/SearchBar";
import EditProfile from "../modules/EditProfile";
import MultipleSearchBar from "../modules/MultipleSearchBar";
import MySpin from "../modules/MySpin";
import {
  UserOutlined,
  UserDeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      profileModal: false
    };
    props.updateSelectedPageName("");
  }

  componentDidMount() {
    /*
    post("/api/joinPage", { home: true, semester: this.props.semester }).then((data) => {
      if (data.broken) {
        this.props.logout();
        //this.props.disconnect();
        return;
      }
      this.setState({
        users: data.users || [],
        pageLoaded: true,
      });
      document.getElementsByClassName("ant-tabs-content")[0].style.height = "100%";
    });
    */
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
    // const [editProfile, setEditProfile] = React.useState(false);
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
                    placeholder={"Search for a " + semester + " class or group!"}
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
                    // flexDirection: "column",
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
                    marginTop: "10px"
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

              <div 
              style={{ overflowY: 'scroll' ,
                      height: "100%"}}
              // style={{
              //   display: "flex",
              //   flexDirection: "column",
              // }}
              >

                {/* {this.props.email}, {this.props.useer.userId} */}
                <div>Name: {this.props.user.name} </div>
                <div>Class year: {this.props.classYear} </div>
                <div>Current Location/Dorm: {this.props.curLoc} </div>
                <div>Hometown: {this.props.hometown} </div>

                <br></br>

                <div>Bio: {this.props.bio} </div>

                <br></br>

                <div>Classes taking: </div> 
                {/* {this.props.myPages[0]} </div> */}
                {console.log(this.props.myPages)}
                <Menu>
                  {this.props.myPages
                  .filter((page) => {
                    return page.pageType === "Class";
                  })
                  .map((page) => {
                    return (
                      <Menu.Item

                        key={page.name}
                        onClick={() => {
                          this.props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
                        }}
                      >
                        {page.name}
                      </Menu.Item>
                    );
                  })}
                </Menu>

                <div>Clubs/groups I'm a part of: </div>

                <Menu>
                  {this.props.myPages
                    .filter((page) => {
                      return page.pageType === "Group";
                    })
                    .map((page) => {
                      return (
                        <Menu.Item
                          key={page.name}
                          onClick={() => {
                            this.props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
                          }}
                        >
                          {page.name}
                        </Menu.Item>
                      );
                    })}
                </Menu>

                <br></br>

                <div>My favorite restaurant near MIT: {this.props.restaurant} </div>
                <div>Advice I would give to an incoming freshman: {this.props.advice} </div>
                {/* <div>A fun & little-known fact about me: {this.props.funFact} </div> */}

                <Button
                  type="primary"
                  style={{top: "10px"}}
                  // onClick={() => { }}
                  onClick={() => {
                    this.setProfileModal(true);
                  }}
                >
                  <UserOutlined /> Edit Profile
                </Button>

                <EditProfile
                  profileModal={this.state.profileModal}
                  setProfileModal={this.setProfileModal}
                  hometown={this.props.hometown}
                  bio={this.props.bio}
                  advice={this.props.advice}
                  curLoc={this.props.curLoc}
                  restaurant={this.props.restaurant}
                />

                {/* <EditProfile
                  onClick={() => {
                    setEditProfile(true);
                  }}
                  visible={editProfile}
                  setVisible={setEditProfile}
                  semester={props.semester}
                  redirectPage={props.redirectPageOverall}
                  pageIds={props.pageIds}
                  updatePageIds={props.updatePageIds}
                /> */}

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
                {", "}
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

        {/*

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
          */}
      </>
    );
  }
}

export default Home;
