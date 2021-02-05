import React, { Component } from "react";
import { get, post } from "../../utilities";

import InfoTab from "../modules/InfoTab";
import TabPage from "../modules/TabPage";
import AddLock from "../modules/AddLock";
import AddEnterCode from "../modules/AddEnterCode";
import MySpin from "../modules/MySpin";
import { socket } from "../../client-socket.js";
import { Spin, Space, Button, Typography, Layout, PageHeader, Badge, Row, Col, Alert, Menu } from "antd";
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

class UserPage extends Component {
  constructor(props) {
    super(props);
    let selectedPage = this.props.computedMatch.params.selectedPage;
    this.state = {
      pageName: selectedPage,

      worked: false,
      name: "",
      profileVisible: false,
      curLoc: "",
      bio: "",
      restaurant: "",
      hometown: "",
      advice: "",
      classYear: "",
      myPages: [],
      
      pageLoaded: false,
    };
    props.updateSelectedPageName(selectedPage);
  }

  viewProfile() {
    post("/api/viewProfile", { pageName: this.state.pageName }).then(
      (data) => {
        this.setState({
          worked: data.worked,
          name: data.name,
          profileVisible: data.profileVisible,
          curLoc: data.curLoc,
          bio: data.bio,
          restaurant: data.restaurant,
          hometown: data.hometown,
          advice: data.advice,
          pageLoaded: true,
          myPages: data.myPages,
          classYear: data.classYear
        });
        console.log(data.name);
        console.log(data.ans);
      }
    )
    console.log('done?')
  }
  
  componentDidMount() {
    this.viewProfile()
  }

  render() {

    if (!this.state.pageLoaded) {
      return <MySpin />;
    }

    if (!this.state.profileVisible) {
      return (
        <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <PageHeader
          className="site-layout-sub-header-background"
          style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
          title={this.state.name}
          subTitle="Profile"
        ></PageHeader>

        <Content
          style={{
            padding: "0px 30px 30px 30px",
            background: "#fff",
            height: "calc(100% - 64px)",
          }}
        >
          <br></br>
          Sorry, this user's profile is private.
        </Content>
      </Layout>
      )
    }

    return (
      <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <PageHeader
          className="site-layout-sub-header-background"
          style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
          title={this.state.name}
          subTitle="Profile"
          // title={this.state.page.name}
          // subTitle={this.state.page.title}
        ></PageHeader>

        <Content
          style={{
            padding: "0px 30px 30px 30px",
            background: "#fff",
            height: "calc(100% - 64px)",
          }}
        >
          <br></br>

          <div>Name: {this.state.name} </div>
          <div>Class year: {this.state.classYear} </div>
          <div>Current Location/Dorm: {this.state.curLoc} </div>
          <div>Hometown: {this.state.hometown} </div>

          <br></br>

          <div>Bio: {this.state.bio} </div>

          <br></br>

          <div>Classes taking: Hidden</div> 
          {console.log(this.state.myPages)}
          <Menu>
            {this.state.myPages
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

          <div>Clubs/groups I'm a part of: Hidden</div>

          <Menu>
            {this.state.myPages
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

          <div>My favorite restaurant near MIT: {this.state.restaurant} </div>
          <div>Advice I would give to an incoming freshman: {this.state.advice} </div>

        </Content>
      </Layout>
    );
  }
}

export default UserPage;
