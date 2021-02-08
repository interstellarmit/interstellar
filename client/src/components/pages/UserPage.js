import React, { Component } from "react";
import { get, post } from "../../utilities";

import InfoTab from "../modules/InfoTab";
import TabPage from "../modules/TabPage";
import AddLock from "../modules/AddLock";
import AddEnterCode from "../modules/AddEnterCode";
import MySpin from "../modules/MySpin";
import { socket } from "../../client-socket.js";
import {
  Spin,
  Space,
  Button,
  Typography,
  Layout,
  PageHeader,
  Badge,
  Row,
  Col,
  Alert,
  Menu,
  Descriptions,
} from "antd";

import { UserOutlined } from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
import {
  UserAddOutlined,
  UserDeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  HomeOutlined,
  TeamOutlined,
  ReadOutlined,
  GiftOutlined,
  ShopOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import DescriptionsItem from "antd/lib/descriptions/Item";

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
      activities: "",
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
    post("/api/viewProfile", { pageName: this.state.pageName }).then((data) => {
      this.setState({
        worked: data.worked,
        name: data.name,
        profileVisible: data.profileVisible,
        curLoc: data.curLoc,
        bio: data.bio,
        activities: data.activities,
        restaurant: data.restaurant,
        hometown: data.hometown,
        advice: data.advice,
        pageLoaded: true,
        myPages: data.myPages,
        classYear: data.classYear,
      });
      console.log(data.name);
      console.log(data.ans);
    });
    console.log("done?");
  }

  componentDidMount() {
    this.viewProfile();
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
            subTitle={"Profile"}
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
      );
    }

    let userInfo = [
      { label: "Currently lives in", value: this.state.curLoc },
      { label: "Originally from", value: this.state.hometown },
      { label: "Bio", value: this.state.bio },
      { label: "Activities", value: this.state.activities },
      { label: "Favorite Boston Restaurant", value: this.state.restaurant },
      { label: "Advice", value: this.state.advice },
    ];
    let anyInfo =
      userInfo.filter((entry) => {
        return entry.value && entry.value.length > 0;
      }).length > 0;
    return (
      <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <PageHeader
          className="site-layout-sub-header-background"
          style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
          title={this.state.name}
          subTitle={"Class of " + this.state.classYear}
          // title={this.state.page.name}
          // subTitle={this.state.page.title}
        ></PageHeader>

        <Content
          style={{
            padding: "20px 30px 30px 30px",
            background: "#fff",
            height: "calc(100% - 64px)",
          }}
        >
          <Descriptions column={1} bordered={anyInfo}>
            {userInfo
              .filter((entry) => {
                return entry.value && entry.value.length > 0;
              })
              .map((entry) => {
                return <Descriptions.Item label={entry.label}>{entry.value}</Descriptions.Item>;
              })}
          </Descriptions>
          {anyInfo ? "" : "This user has not added a profile yet."}
        </Content>
      </Layout>
    );
  }
}

export default UserPage;
